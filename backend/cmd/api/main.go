package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/bloiss/lumeameals/internal/config"
	"github.com/bloiss/lumeameals/internal/handlers"
	"github.com/bloiss/lumeameals/internal/repository/postgres"
	"github.com/bloiss/lumeameals/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	// Connexion PostgreSQL
	pool, err := postgres.NewPool(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()

	// Repositories
	recipeRepo     := postgres.NewRecipeRepository(pool)
	vibeRepo       := postgres.NewVibeRepository(pool)
	ingredientRepo := postgres.NewIngredientRepository(pool)
	productRepo    := postgres.NewProductRepository(pool)
	userRepo       := postgres.NewUserRepository(pool)

	// Handlers
	recipeHandler   := handlers.NewRecipeHandler(recipeRepo, ingredientRepo)
	vibeHandler     := handlers.NewVibeHandler(vibeRepo)
	generateHandler := handlers.NewGenerateHandler(recipeRepo, ingredientRepo, productRepo)
	authHandler     := handlers.NewAuthHandler(userRepo, cfg.JWTSecret)

	// Serveur
	srv := server.New(cfg, recipeHandler, vibeHandler, generateHandler, authHandler)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("LumaMeals API listening on %s (env=%s)\n", addr, cfg.Env)
	log.Fatal(http.ListenAndServe(addr, srv.Router()))
}
