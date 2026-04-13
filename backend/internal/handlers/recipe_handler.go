package handlers

import (
	"net/http"

	"github.com/bloiss/lumeameals/internal/core/ports"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type RecipeHandler struct {
	recipes     ports.RecipeRepository
	ingredients ports.IngredientRepository
}

func NewRecipeHandler(recipes ports.RecipeRepository, ingredients ports.IngredientRepository) *RecipeHandler {
	return &RecipeHandler{recipes: recipes, ingredients: ingredients}
}

// GET /api/v1/recipes
func (h *RecipeHandler) List(w http.ResponseWriter, r *http.Request) {
	recipes, err := h.recipes.FindAll(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "impossible de récupérer les recettes")
		return
	}
	respondJSON(w, http.StatusOK, recipes)
}

// GET /api/v1/recipes/{id}
func (h *RecipeHandler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "id invalide")
		return
	}

	recipe, err := h.recipes.FindByID(r.Context(), id)
	if err != nil {
		respondError(w, http.StatusNotFound, "recette introuvable")
		return
	}

	// Enrichir avec les ingrédients
	ingredients, err := h.ingredients.FindByRecipeID(r.Context(), id)
	if err == nil {
		recipe.Ingredients = ingredients
	}

	respondJSON(w, http.StatusOK, recipe)
}

// GET /api/v1/recipes?vibe={slug} — filtrage par vibe
func (h *RecipeHandler) ListByVibe(w http.ResponseWriter, r *http.Request) {
	vibeID, err := uuid.Parse(chi.URLParam(r, "vibeID"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "vibeID invalide")
		return
	}

	recipes, err := h.recipes.FindByVibe(r.Context(), vibeID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "impossible de filtrer par vibe")
		return
	}
	respondJSON(w, http.StatusOK, recipes)
}
