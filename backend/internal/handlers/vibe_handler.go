package handlers

import (
	"net/http"

	"github.com/bloiss/lumeameals/internal/core/ports"
)

type VibeHandler struct {
	vibes ports.VibeRepository
}

func NewVibeHandler(vibes ports.VibeRepository) *VibeHandler {
	return &VibeHandler{vibes: vibes}
}

// GET /api/v1/vibes
func (h *VibeHandler) List(w http.ResponseWriter, r *http.Request) {
	vibes, err := h.vibes.FindAll(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "impossible de récupérer les vibes")
		return
	}
	respondJSON(w, http.StatusOK, vibes)
}
