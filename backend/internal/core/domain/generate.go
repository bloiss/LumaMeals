package domain

import "github.com/google/uuid"

// GenerateRequest est la requête pour calculer le coût d'une recette.
// budget_cents est TOUJOURS en centimes (int). Ex: 500 = 5,00 €
type GenerateRequest struct {
	RecipeID       uuid.UUID   `json:"recipe_id"`
	BudgetCents    int         `json:"budget_cents"`              // ex: 500 = 5,00 €
	Servings       int         `json:"servings"`                  // override du nombre de portions
	PostalCode     string      `json:"postal_code,omitempty"`     // pour filtrer par zone géographique
	SupermarketIDs []uuid.UUID `json:"supermarket_ids,omitempty"` // restreindre à certaines enseignes
}

// MappedProduct est le résultat de la résolution d'un ingrédient vers son produit le moins cher.
// price_cents est TOUJOURS en centimes (int).
type MappedProduct struct {
	Ingredient       Ingredient               `json:"ingredient"`
	Mapping          IngredientProductMapping `json:"mapping"`
	Product          Product                  `json:"product"`
	Supermarket      Supermarket              `json:"supermarket"`
	Store            *Store                   `json:"store,omitempty"`
	PriceCents       int                      `json:"price_cents"`        // prix du produit en centimes
	NormalizedCents  int                      `json:"normalized_cents"`   // prix ramené à l'unité de l'ingrédient
}

// GenerateResult est la réponse complète du moteur de génération.
// Tous les montants sont en centimes (int).
type GenerateResult struct {
	Recipe         Recipe          `json:"recipe"`
	MappedProducts []MappedProduct `json:"mapped_products"`
	TotalCostCents int             `json:"total_cost_cents"` // somme des normalized_cents
	BudgetCents    int             `json:"budget_cents"`
	SavingsCents   int             `json:"savings_cents"`    // budget - total_cost (si positif)
	IsWithinBudget bool            `json:"is_within_budget"`
}
