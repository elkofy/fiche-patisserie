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
}

export interface Ingredient extends GormModel {
  name: string
  ref?: string
  allergen?: string
  unit: string
  unitPrice: number
  category?: string
  details?: string
  supplier?: string
  energy?: number
}

export interface RecipeIngredient {
  ingredientId: number
  ingredient?: Ingredient
  quantity: number
}

export type Verb =
  | 'Abaisser' | 'Abricoter' | 'Appareiller' | 'Aromatiser' | 'Arroser'
  | 'Assouplir' | 'Badigeonner' | 'Battre' | 'Blanchir' | 'Bloquer'
  | 'Bouler' | 'Broyer' | 'Brûler' | 'Candir' | 'Canneler'
  | 'Caraméliser' | 'Chemiser' | 'Chiqueter' | 'Clarifier' | 'Coller'
  | 'Colorer' | 'Concasser' | 'Concher' | 'Corner' | 'Coucher'
  | 'Crémer' | 'Croûter' | 'Décuire' | 'Dégazer' | 'Dessécher'
  | 'Détailler' | 'Développer' | 'Dorer' | 'Dresser' | 'Ébarber'
  | 'Écumer' | 'Édulcorer' | 'Effiler' | 'Émonder' | 'Émulsionner'
  | 'Étamer' | 'Façonner' | 'Fariner' | 'Festonner' | 'Fleurer'
  | 'Foisonner' | 'Foncer' | 'Fouetter' | 'Fourrer' | 'Fraiser'
  | 'Frapper' | 'Frémir' | 'Garnir' | 'Glacer' | 'Gommer'
  | 'Grainer' | 'Graisser' | 'Griller' | 'Imbiber' | 'Infuser'
  | 'Lever' | 'Lisser' | 'Lustrer' | 'Macaronner' | 'Macérer'
  | 'Marbrer' | 'Masquer' | 'Meringuer' | 'Monter' | 'Mouler'
  | 'Napper' | 'Parer' | 'Pétrir' | 'Piquer' | 'Pocher'
  | 'Pointer' | 'Puncher' | 'Rabattre' | 'Rayer' | 'Resserrer'
  | 'Rioler' | 'Rompre' | 'Rubanner' | 'Sabler' | 'Sangler'
  | 'Serrer' | 'Souder' | 'Strier' | 'Tabler' | 'Tamiser'
  | 'Tamponner' | 'Tourer' | 'Travailler' | 'Tremper' | 'Turbiner'
  | 'Vanner' | 'Videler' | 'Zester'

export const VERBS: Verb[] = [
  'Abaisser', 'Abricoter', 'Appareiller', 'Aromatiser', 'Arroser',
  'Assouplir', 'Badigeonner', 'Battre', 'Blanchir', 'Bloquer',
  'Bouler', 'Broyer', 'Brûler', 'Candir', 'Canneler',
  'Caraméliser', 'Chemiser', 'Chiqueter', 'Clarifier', 'Coller',
  'Colorer', 'Concasser', 'Concher', 'Corner', 'Coucher',
  'Crémer', 'Croûter', 'Décuire', 'Dégazer', 'Dessécher',
  'Détailler', 'Développer', 'Dorer', 'Dresser', 'Ébarber',
  'Écumer', 'Édulcorer', 'Effiler', 'Émonder', 'Émulsionner',
  'Étamer', 'Façonner', 'Fariner', 'Festonner', 'Fleurer',
  'Foisonner', 'Foncer', 'Fouetter', 'Fourrer', 'Fraiser',
  'Frapper', 'Frémir', 'Garnir', 'Glacer', 'Gommer',
  'Grainer', 'Graisser', 'Griller', 'Imbiber', 'Infuser',
  'Lever', 'Lisser', 'Lustrer', 'Macaronner', 'Macérer',
  'Marbrer', 'Masquer', 'Meringuer', 'Monter', 'Mouler',
  'Napper', 'Parer', 'Pétrir', 'Piquer', 'Pocher',
  'Pointer', 'Puncher', 'Rabattre', 'Rayer', 'Resserrer',
  'Rioler', 'Rompre', 'Rubanner', 'Sabler', 'Sangler',
  'Serrer', 'Souder', 'Strier', 'Tabler', 'Tamiser',
  'Tamponner', 'Tourer', 'Travailler', 'Tremper', 'Turbiner',
  'Vanner', 'Videler', 'Zester',
]

export interface Step {
  id?: number
  verb: Verb
  actionDetail: string
  videoUrl?: string
  recipeId?: number
  technicalSheetId?: number
}

export interface Recipe extends GormModel {
  name: string
  imageUrl: string
  recipeIngredients: RecipeIngredient[]
  steps: Step[]
  timings: Timings
  equipements: string[]
}

export interface Mold extends GormModel {
  name: string
  shape: string
  capacity: number
}

export type PortionType = 'Part' | 'Ramequin'

export interface Portion {
  type: PortionType
  quantity: number
}

export interface Yield {
  servings: number
  portion: Portion
}

export interface AdditionalRecipeStep extends GormModel {
  recipeId: number
  technicalSheetId: number
  stepId: number
}

export interface TechnicalSheet extends GormModel {
  name: string
  description: string
  moldId?: number
  mold?: Mold
  recipes: Recipe[]
  conservation: string
  imageUrl: string
  finishingSteps: Step[]
  additionalRecipeSteps?: AdditionalRecipeStep[]
  yield: Yield
}
