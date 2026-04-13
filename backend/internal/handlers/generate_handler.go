package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/bloiss/lumeameals/internal/core/ports"
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

// POST /api/v1/generate
// Body: { "recipe_id": "...", "budget_cents": 500, "servings": 2 }
// Tous les montants sont en centimes (int). Ex: budget_cents=500 → 5,00 €
func (h *GenerateHandler) Generate(w http.ResponseWriter, r *http.Request) {
	var req domain.GenerateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "corps de requête invalide")
		return
	}
	if req.RecipeID.String() == "00000000-0000-0000-0000-000000000000" {
		respondError(w, http.StatusBadRequest, "recipe_id est requis")
		return
	}
	if req.BudgetCents <= 0 {
		respondError(w, http.StatusBadRequest, "budget_cents doit être > 0 (en centimes, ex: 500 = 5,00 €)")
		return
	}

	// 1. Récupérer la recette
	recipe, err := h.recipes.FindByID(r.Context(), req.RecipeID)
	if err != nil {
		respondError(w, http.StatusNotFound, "recette introuvable")
		return
	}

	// 2. Résoudre les ingrédients
	recipeIngredients, err := h.ingredients.FindByRecipeID(r.Context(), req.RecipeID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "impossible de charger les ingrédients")
		return
	}

	// 3. Trouver le produit le moins cher pour chaque ingrédient
	servings := req.Servings
	if servings == 0 {
		servings = recipe.Servings
	}
	ratio := float64(servings) / float64(recipe.Servings)

	var mapped []domain.MappedProduct
	totalCents := 0

	for _, ri := range recipeIngredients {
		if ri.IsOptional {
			continue
		}
		mp, err := h.products.FindCheapestForIngredient(r.Context(), ri.IngredientID)
		if err != nil {
			// Ingrédient sans mapping connu — on continue sans bloquer
			continue
		}
		// Ajuster le prix normalisé selon le ratio de portions
		adjustedCents := int(float64(mp.NormalizedCents) * ri.Quantity * ratio)
		mp.NormalizedCents = adjustedCents
		totalCents += adjustedCents
		mapped = append(mapped, *mp)
	}

	savingsCents := req.BudgetCents - totalCents

	result := domain.GenerateResult{
		Recipe:         *recipe,
		MappedProducts: mapped,
		TotalCostCents: totalCents,
		BudgetCents:    req.BudgetCents,
		SavingsCents:   savingsCents,
		IsWithinBudget: totalCents <= req.BudgetCents,
	}

	respondJSON(w, http.StatusOK, result)
}
