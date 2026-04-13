package ports

import (
	"context"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/google/uuid"
)

// RecipeRepository gère la persistance des recettes (couche 1).
type RecipeRepository interface {
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Recipe, error)
	FindAll(ctx context.Context) ([]domain.Recipe, error)
	FindByVibe(ctx context.Context, vibeID uuid.UUID) ([]domain.Recipe, error)
	Create(ctx context.Context, recipe *domain.Recipe) error
}

// VibeRepository gère la persistance des vibes (couche 1).
type VibeRepository interface {
	FindAll(ctx context.Context) ([]domain.Vibe, error)
	FindBySlug(ctx context.Context, slug string) (*domain.Vibe, error)
}

// IngredientRepository gère les ingrédients génériques (couche 2).
type IngredientRepository interface {
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Ingredient, error)
	FindByRecipeID(ctx context.Context, recipeID uuid.UUID) ([]domain.RecipeIngredient, error)
}

// ProductRepository gère les produits concrets et leurs prix (couche 3).
// Les prix sont TOUJOURS en centimes (int).
type ProductRepository interface {
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error)
	FindCheapestForIngredient(ctx context.Context, ingredientID uuid.UUID) (*domain.MappedProduct, error)
}

// MappingRepository gère le pont entre ingrédients génériques et produits concrets.
type MappingRepository interface {
	FindByIngredientID(ctx context.Context, ingredientID uuid.UUID) ([]domain.IngredientProductMapping, error)
}

// GenerateRepository orchestre la résolution complète d'une recette vers les produits les moins chers.
// Utilise la vue matérialisée cheapest_products_per_ingredient côté SQL.
type GenerateRepository interface {
	Generate(ctx context.Context, req domain.GenerateRequest) (*domain.GenerateResult, error)
}

// UserRepository gère la persistance des utilisateurs.
type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
}

// SupermarketRepository gère les enseignes et leurs magasins (couche 3).
type SupermarketRepository interface {
	FindAll(ctx context.Context) ([]domain.Supermarket, error)
	FindStoresByPostalCode(ctx context.Context, postalCode string) ([]domain.Store, error)
}
