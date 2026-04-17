package server

import (
	"net/http"

	"github.com/bloiss/lumeameals/internal/config"
	"github.com/bloiss/lumeameals/internal/handlers"
	appmiddleware "github.com/bloiss/lumeameals/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Server struct {
	cfg    *config.Config
	router *chi.Mux
}

func New(
	cfg *config.Config,
	recipes *handlers.RecipeHandler,
	vibes *handlers.VibeHandler,
	generate *handlers.GenerateHandler,
	auth *handlers.AuthHandler,
	supermarkets *handlers.SupermarketHandler,
) *Server {
	s := &Server{
		cfg:    cfg,
		router: chi.NewRouter(),
	}
	s.setupMiddleware()
	s.setupRoutes(recipes, vibes, generate, auth, supermarkets)
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
	// CORS — autorise le frontend Vite (dev) et la prod
	s.router.Use(corsMiddleware)
}

func (s *Server) setupRoutes(
	recipes *handlers.RecipeHandler,
	vibes *handlers.VibeHandler,
	generate *handlers.GenerateHandler,
	auth *handlers.AuthHandler,
	supermarkets *handlers.SupermarketHandler,
) {
	s.router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`)) //nolint:errcheck
	})

	s.router.Route("/api/v1", func(r chi.Router) {
		// Auth — routes publiques
		r.Post("/auth/register", auth.Register)
		r.Post("/auth/login", auth.Login)

		// Recettes + vibes — publics
		r.Get("/recipes", recipes.List)
		r.Get("/recipes/{id}", recipes.Get)
		r.Get("/vibes/{vibeID}/recipes", recipes.ListByVibe)
		r.Get("/vibes", vibes.List)

		// Supermarchés — publics
		r.Get("/supermarkets", supermarkets.List)
		r.Get("/supermarkets/{postalCode}/stores", supermarkets.ListStores)

		// Moteur Budget First — protégé par JWT
		r.Group(func(r chi.Router) {
			r.Use(appmiddleware.JWTAuth([]byte(s.cfg.JWTSecret)))
			r.Post("/meals/generate", generate.Generate)
		})
	})
}

// corsMiddleware autorise les requêtes cross-origin du frontend.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
