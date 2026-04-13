package server

import (
	"net/http"

	"github.com/bloiss/lumeameals/internal/config"
	"github.com/bloiss/lumeameals/internal/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Server struct {
	cfg    *config.Config
	router *chi.Mux
}

func New(cfg *config.Config, recipes *handlers.RecipeHandler, vibes *handlers.VibeHandler, generate *handlers.GenerateHandler) *Server {
	s := &Server{
		cfg:    cfg,
		router: chi.NewRouter(),
	}
	s.setupMiddleware()
	s.setupRoutes(recipes, vibes, generate)
	return s
}

func (s *Server) Router() http.Handler {
	return s.router
}

func (s *Server) setupMiddleware() {
	s.router.Use(middleware.RequestID)
	s.router.Use(middleware.Logger)
	s.router.Use(middleware.Recoverer)
	s.router.Use(middleware.StripSlashes)
}

func (s *Server) setupRoutes(recipes *handlers.RecipeHandler, vibes *handlers.VibeHandler, generate *handlers.GenerateHandler) {
	s.router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`)) //nolint:errcheck
	})

	s.router.Route("/api/v1", func(r chi.Router) {
		// Recettes
		r.Get("/recipes", recipes.List)
		r.Get("/recipes/{id}", recipes.Get)
		r.Get("/vibes/{vibeID}/recipes", recipes.ListByVibe)

		// Vibes
		r.Get("/vibes", vibes.List)

		// Moteur de génération — trouve les produits les moins chers pour une recette
		// POST body: { "recipe_id": "...", "budget_cents": 500, "servings": 2 }
		r.Post("/generate", generate.Generate)
	})
}
