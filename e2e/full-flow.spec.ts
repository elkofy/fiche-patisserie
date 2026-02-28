import { test, expect, type Page } from '@playwright/test'

/**
 * Flux complet E2E :
 *  1. Créer deux ingrédients (Farine, Beurre)
 *  2. Créer une recette avec image, 2 ingrédients, 2 étapes
 *  3. Créer une fiche technique avec image et cette recette
 *  4. Vérifier les données via l'API
 *
 * Prérequis : backend Go sur http://localhost:8080 (redémarré après modifs structs)
 */

const IMAGE_RECIPE = 'https://placehold.co/600x400'
const IMAGE_SHEET  = 'https://placehold.co/800x600'

// ---------- helpers ----------

async function createIngredient(
  page: Page,
  opts: { name: string; unit: string; price: number; category: string; allergens: string },
) {
  await page.goto('/ingredients/new')
  await page.locator('[data-testid="ingredient-name"]').fill(opts.name)
  await page.locator('[data-testid="ingredient-unit"]').fill(opts.unit)
  await page.locator('[data-testid="ingredient-price"]').fill(String(opts.price))
  await page.locator('[data-testid="ingredient-category"]').fill(opts.category)
  await page.locator('[data-testid="ingredient-allergens"]').fill(opts.allergens)
  await page.locator('[data-testid="ingredient-submit"]').click()
  await page.waitForURL('/ingredients')
}

async function fillIngredientRow(
  page: Page,
  rowIndex: number,
  opts: { ingredientName: string; quantity: number; unit: string },
) {
  const row = page.locator(`[data-testid="ingredient-row-${rowIndex}"]`)
  await row.locator('select').selectOption({ label: opts.ingredientName })
  await row.locator('input[placeholder="Qté"]').fill(String(opts.quantity))
  await row.locator('input[placeholder="unit"]').fill(opts.unit)
}

async function fillStepRow(
  page: Page,
  rowIndex: number,
  opts: { title: string; description: string; duration: number },
) {
  const row = page.locator(`[data-testid="step-row-${rowIndex}"]`)
  await row.locator('input[placeholder="Titre de l\'étape"]').fill(opts.title)
  await row.locator('textarea[placeholder="Description…"]').fill(opts.description)
  await row.locator('input[placeholder="Durée (min)"]').fill(String(opts.duration))
}

// ---------- test ----------

test('Flux complet : ingrédients → recette → fiche technique', async ({ page }) => {
  const RUN = Date.now()
  const ING1   = `Farine E2E ${RUN}`
  const ING2   = `Beurre E2E ${RUN}`
  const RECIPE = `Pâte sablée E2E ${RUN}`
  const SHEET  = `Tarte aux pommes E2E ${RUN}`

  // ── 1. Ingrédient Farine ─────────────────────────────────────────────────
  await test.step('Créer l\'ingrédient Farine', async () => {
    await createIngredient(page, {
      name: ING1, unit: 'g', price: 1.50, category: 'Farine', allergens: 'Gluten',
    })
    await expect(page.getByText(ING1)).toBeVisible()
  })

  // ── 2. Ingrédient Beurre ─────────────────────────────────────────────────
  await test.step('Créer l\'ingrédient Beurre', async () => {
    await createIngredient(page, {
      name: ING2, unit: 'g', price: 8.00, category: 'Produit laitier', allergens: 'Lactose',
    })
    await expect(page.getByText(ING2)).toBeVisible()
  })

  // ── 3. Recette ───────────────────────────────────────────────────────────
  await test.step('Créer une recette avec image, ingrédients et étapes', async () => {
    await page.goto('/recipes/new')

    // Infos de base
    await page.locator('[data-testid="recipe-name"]').fill(RECIPE)
    await page.locator('[data-testid="recipe-description"]').fill(
      'Une pâte sablée croustillante et dorée.',
    )
    await page.locator('[data-testid="recipe-image"]').fill(IMAGE_RECIPE)
    await page.locator('[data-testid="recipe-tags"]').fill('Tarte, Classique')
    await page.locator('[data-testid="recipe-time"]').fill('45')
    await page.locator('[data-testid="recipe-servings"]').fill('6')

    // Ingrédients
    await page.locator('[data-testid="add-ingredient-btn"]').click()
    await fillIngredientRow(page, 0, { ingredientName: ING1, quantity: 250, unit: 'g' })

    await page.locator('[data-testid="add-ingredient-btn"]').click()
    await fillIngredientRow(page, 1, { ingredientName: ING2, quantity: 125, unit: 'g' })

    // Étape 1 : Sabler
    await page.locator('[data-testid="add-step-btn"]').click()
    await fillStepRow(page, 0, {
      title: 'Sabler la pâte',
      description: 'Mélanger la farine et le beurre du bout des doigts jusqu\'à texture sableuse.',
      duration: 10,
    })

    // Étape 2 : Fraiser
    await page.locator('[data-testid="add-step-btn"]').click()
    await fillStepRow(page, 1, {
      title: 'Fraiser et réfrigérer',
      description: 'Fraiser la pâte une fois, former un disque, filmer et réserver 30 min au frais.',
      duration: 30,
    })

    await page.locator('[data-testid="recipe-submit"]').click()
    await page.waitForURL(/\/recipes\/\d+/)

    // Vérifications UI : nom et ingrédients visibles
    await expect(page.getByText(RECIPE)).toBeVisible()
    await expect(page.getByText(ING1)).toBeVisible()
    await expect(page.getByText(ING2)).toBeVisible()

    // Vérifications API : image et étapes bien stockées
    const recipeId = new URL(page.url()).pathname.split('/').pop()
    const resp = await page.request.get(`http://localhost:8080/recipe/${recipeId}`)
    expect(resp.ok()).toBeTruthy()

    const recipe = await resp.json()
    expect(recipe.image).toBe(IMAGE_RECIPE)
    expect(recipe.steps).toHaveLength(2)
    expect(recipe.steps[0].title).toBe('Sabler la pâte')
    expect(recipe.steps[0].duration).toBe(10)
    expect(recipe.steps[1].title).toBe('Fraiser et réfrigérer')
    expect(recipe.steps[1].duration).toBe(30)
  })

  // ── 4. Fiche technique ───────────────────────────────────────────────────
  await test.step('Créer une fiche technique avec image et la recette', async () => {
    await page.goto('/technicalsheets/new')

    await page.locator('[data-testid="sheet-title"]').fill(SHEET)
    await page.locator('[data-testid="sheet-description"]').fill(
      'Une tarte aux pommes traditionnelle sur pâte sablée.',
    )
    await page.locator('[data-testid="sheet-difficulty"]').selectOption('intermediate')
    await page.locator('[data-testid="sheet-image"]').fill(IMAGE_SHEET)
    await page.locator('[data-testid="sheet-tags"]').fill('Tarte, Pomme, Classique')
    await page.locator('[data-testid="sheet-time"]').fill('90')
    await page.locator('[data-testid="sheet-servings"]').fill('8')

    // Cocher la recette
    await expect(page.getByText(RECIPE)).toBeVisible({ timeout: 10000 })
    await page.getByLabel(RECIPE).check()
    await expect(page.getByLabel(RECIPE)).toBeChecked()

    await page.locator('[data-testid="sheet-submit"]').click()
    await page.waitForURL(/\/technicalsheets\/\d+/)

    // Vérifications API
    const sheetId = new URL(page.url()).pathname.split('/').pop()
    const resp = await page.request.get(`http://localhost:8080/technicalsheet/${sheetId}`)
    expect(resp.ok()).toBeTruthy()

    const sheet = await resp.json()
    expect(sheet.title).toBe(SHEET)
    expect(sheet.image).toBe(IMAGE_SHEET)

    // La recette est associée avec ses étapes
    expect(sheet.recipes).toHaveLength(1)
    expect(sheet.recipes[0].name).toBe(RECIPE)
    expect(sheet.recipes[0].steps).toHaveLength(2)
    expect(sheet.recipes[0].steps[0].title).toBe('Sabler la pâte')
    expect(sheet.recipes[0].steps[1].title).toBe('Fraiser et réfrigérer')
  })
})
