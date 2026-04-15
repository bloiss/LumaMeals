// Types TypeScript qui reflètent exactement les structs Go du backend.
// Tous les montants sont en centimes (number entier). Jamais de float pour les prix.

export interface Vibe {
  id: string
  name: string
  slug: string
  description: string
  emoji: string
}

export interface Supermarket {
  id: string
  name: string
  slug: string
  logo_url: string
  requires_store_selection: boolean
}

export interface Ingredient {
  id: string
  name: string
  slug: string
  category_id: string
  default_unit: string
  created_at: string
}

export interface IngredientMapping {
  id: string
  ingredient_id: string
  product_id: string
  conversion_factor: number
  unit: string
  is_verified: boolean
  created_at: string
}

export interface Product {
  id: string
  supermarket_id: string
  external_id: string
  name: string
  brand: string
  image_url: string
  url: string
  unit_size: number
  unit_type: string
  created_at: string
  updated_at: string
}

export interface MappedProduct {
  ingredient: Ingredient
  mapping: IngredientMapping
  product: Product
  supermarket: Supermarket
  quantity_needed: number
  packs_needed: number
  price_cents: number       // prix d'un pack en centimes (int)
  cost_cents: number        // coût réel pour cet ingrédient en centimes (int)
  normalized_cents: number  // prix par unité pour comparaison
}

export interface Recipe {
  id: string
  name: string
  description: string
  servings: number
  prep_time_min: number
  cook_time_min: number
  image_url: string
  created_at: string
}

// Requête POST /api/v1/meals/generate
export interface GenerateRequest {
  recipe_id: string
  budget_cents: number      // en centimes (int), ex: 500 = 5,00 €
  supermarket_id: string
  servings?: number
}

// Réponse POST /api/v1/meals/generate
export interface GenerateResult {
  recipe: Recipe
  mapped_products: MappedProduct[]
  total_cost_cents: number  // en centimes (int)
  budget_cents: number      // en centimes (int)
  savings_cents: number     // en centimes (int), négatif si dépassement
  is_within_budget: boolean
}

export interface ApiError {
  error: string
}
