export interface GormModel {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
}

export interface Temperature {
  value: number
  unit: string
}

export interface Timing {
  duration: number
  unit: string
  description?: string
}

export interface BakeTiming {
  duration: number
  unit: string
  temperature: Temperature
}

export interface Timings {
  preparation?: Timing
  cooking?: Timing
  baking?: BakeTiming
  resting?: Timing
  totalTime: number
  totalUnit: string
}

export interface Mold {
  shape: string
  dimensions: {
    length: number
    width: number
    depth: number
    unit: string
  }
}

export interface Portion {
  type: string
  quantity: number
}

export interface Yield {
  servings: number
  portions: Portion
}

export type Verb = string

export interface Ingredient extends GormModel {
  name: string
  unit: string
  unitPrice: number
  allergens: string[]
  category?: string
}

export interface RecipeIngredient {
  ingredientId: number
  ingredient?: Ingredient
  quantity: number
  unit: string
  notes?: string
  optional: boolean
}

export interface Step {
  id?: number
  order: number
  title: string
  description: string
  duration: number
  unit: string
  ingredientIds?: number[]
  verbs?: Verb[]
  notes?: string
}

export interface Recipe extends GormModel {
  name: string
  description: string
  timings: Timings
  mold?: Mold
  yield: Yield
  recipeIngredients: RecipeIngredient[]
  steps: Step[]
  tags?: string[]
  image?: string
}

export interface TechnicalSheet extends GormModel {
  title: string
  description: string
  difficulty: string
  image?: string
  tags?: string[]
  categories?: string[]
  recipes: Recipe[]
  timings: Timings
  mold?: Mold
  yield: Yield
  cost?: {
    ingredients: number
    labor: number
    total: number
    currency: string
    unitCost: number
    margin: number
  }
}
