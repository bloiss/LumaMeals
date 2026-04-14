package handlers

import (
	"encoding/json"
	"math"
	"net/http"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/bloiss/lumeameals/internal/core/ports"
	"github.com/google/uuid"
)

type GenerateHandler struct {
	recipes     ports.RecipeRepository
	ingredients ports.IngredientRepository
	products    ports.ProductRepository
}

func NewGenerateHandler(
	recipes ports.RecipeRepository,
	ingredients ports.IngredientRepository,
	products ports.ProductRepository,
) *GenerateHandler {
	return &GenerateHandler{
		recipes:     recipes,
		ingredients: ingredients,
		products:    products,
	}
}

// POST /api/v1/meals/generate
//
// Body JSON :
//
//	{
//	  "recipe_id":      "uuid",
//	  "budget_cents":   500,
//	  "supermarket_id": "uuid",
//	  "servings":       2        (optionnel — défaut = servings de la recette)
//	}
//
// Algorithme Budget First :
//
//	Pour chaque ingrédient non-optionnel :
//	  1. Lire le produit le moins cher dans cheapest_products_per_ingredient
//	     pour (ingredient_id, supermarket_id)
//	  2. Ajuster la quantité selon le ratio de portions
//	  3. packs_needed = CEIL(quantity_needed / conversion_factor)
//	  4. cost_cents   = packs_needed × price_cents   ← jamais de float
//	  5. Cumuler dans total_cost_cents
//
// Tous les montants sont en centimes (int). Jamais de float pour les prix.
func (h *GenerateHandler) Generate(w http.ResponseWriter, r *http.Request) {
	var req domain.GenerateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "corps de requête invalide")
		return
	}

	if req.RecipeID == uuid.Nil {
		respondError(w, http.StatusBadRequest, "recipe_id est requis")
		return
	}
	if req.BudgetCents <= 0 {
		respondError(w, http.StatusBadRequest, "budget_cents doit être > 0 (en centimes, ex: 500 = 5,00 €)")
		return
	}
	if req.SupermarketID == uuid.Nil {
		respondError(w, http.StatusBadRequest, "supermarket_id est requis")
		return
	}

	ctx := r.Context()

	// ── 1. Charger la recette ─────────────────────────────────────────────────
	recipe, err := h.recipes.FindByID(ctx, req.RecipeID)
	if err != nil {
		respondError(w, http.StatusNotFound, "recette introuvable")
		return
	}

	// ── 2. Charger les ingrédients de la recette ──────────────────────────────
	recipeIngredients, err := h.ingredients.FindByRecipeID(ctx, req.RecipeID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "impossible de charger les ingrédients")
		return
	}

	// ── 3. Ratio de portions ──────────────────────────────────────────────────
	// Si servings non fourni, on utilise le nombre de portions de la recette.
	targetServings := req.Servings
	if targetServings <= 0 {
		targetServings = recipe.Servings
	}
	ratio := float64(targetServings) / float64(recipe.Servings)

	// ── 4. Résolution Budget First ────────────────────────────────────────────
	var mapped []domain.MappedProduct
	totalCostCents := 0

	for _, ri := range recipeIngredients {
		if ri.IsOptional {
			continue
		}

		mp, err := h.products.FindCheapestForIngredient(ctx, ri.IngredientID, req.SupermarketID)
		if err != nil {
			// Ingrédient sans mapping vérifié pour ce supermarché — on continue.
			// La recette reste retournée, mais incomplète (prix sous-estimé).
			continue
		}

		// Quantité ajustée selon le ratio de portions
		quantityNeeded := ri.Quantity * ratio

		// CEIL(quantity_needed / conversion_factor) = nombre de packs à acheter
		// Ex : 2.0 (×100g de pâtes) / 5.0 (conversion d'un paquet 500g) = 0.4 → CEIL = 1 pack
		packsNeeded := int(math.Ceil(quantityNeeded / mp.Mapping.ConversionFactor))
		if packsNeeded < 1 {
			packsNeeded = 1
		}

		// Coût réel = packs × prix du pack (en centimes, jamais de float)
		costCents := packsNeeded * mp.PriceCents

		mp.QuantityNeeded = quantityNeeded
		mp.PacksNeeded = packsNeeded
		mp.CostCents = costCents

		totalCostCents += costCents
		mapped = append(mapped, *mp)
	}

	// ── 5. Construire la réponse ──────────────────────────────────────────────
	savingsCents := req.BudgetCents - totalCostCents

	result := domain.GenerateResult{
		Recipe:         *recipe,
		MappedProducts: mapped,
		TotalCostCents: totalCostCents,
		BudgetCents:    req.BudgetCents,
		SavingsCents:   savingsCents,
		IsWithinBudget: totalCostCents <= req.BudgetCents,
	}

	respondJSON(w, http.StatusOK, result)
}
