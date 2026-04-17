package handlers

import (
	"net/http"

	"github.com/bloiss/lumeameals/internal/core/ports"
	"github.com/go-chi/chi/v5"
)

type SupermarketHandler struct {
	supermarkets ports.SupermarketRepository
}

func NewSupermarketHandler(supermarkets ports.SupermarketRepository) *SupermarketHandler {
	return &SupermarketHandler{supermarkets: supermarkets}
}

// GET /api/v1/supermarkets
func (h *SupermarketHandler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.supermarkets.FindAll(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}
	if items == nil {
		respondJSON(w, http.StatusOK, []any{})
		return
	}
	respondJSON(w, http.StatusOK, items)
}

// GET /api/v1/supermarkets/{postalCode}/stores
func (h *SupermarketHandler) ListStores(w http.ResponseWriter, r *http.Request) {
	postalCode := chi.URLParam(r, "postalCode")
	if postalCode == "" {
		respondError(w, http.StatusBadRequest, "code postal manquant")
		return
	}

	stores, err := h.supermarkets.FindStoresByPostalCode(r.Context(), postalCode)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}
	if stores == nil {
		respondJSON(w, http.StatusOK, []any{})
		return
	}
	respondJSON(w, http.StatusOK, stores)
}
