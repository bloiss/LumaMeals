package postgres

import (
	"context"
	"fmt"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type IngredientRepository struct {
	db *pgxpool.Pool
}

func NewIngredientRepository(db *pgxpool.Pool) *IngredientRepository {
	return &IngredientRepository{db: db}
}

func (r *IngredientRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Ingredient, error) {
	const q = `
		SELECT id, name, slug, category_id, default_unit, created_at
		FROM ingredients
		WHERE id = $1`

	var ing domain.Ingredient
	err := r.db.QueryRow(ctx, q, id).Scan(
		&ing.ID, &ing.Name, &ing.Slug,
		&ing.CategoryID, &ing.DefaultUnit, &ing.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("ingredient.FindByID: %w", err)
	}
	return &ing, nil
}

func (r *IngredientRepository) FindByRecipeID(ctx context.Context, recipeID uuid.UUID) ([]domain.RecipeIngredient, error) {
	const q = `
		SELECT
			ri.recipe_id, ri.ingredient_id, ri.quantity, ri.unit, ri.is_optional, ri.notes,
			i.id, i.name, i.slug, i.category_id, i.default_unit, i.created_at
		FROM recipe_ingredients ri
		JOIN ingredients i ON i.id = ri.ingredient_id
		WHERE ri.recipe_id = $1
		ORDER BY i.name`

	rows, err := r.db.Query(ctx, q, recipeID)
	if err != nil {
		return nil, fmt.Errorf("ingredient.FindByRecipeID: %w", err)
	}
	defer rows.Close()

	var results []domain.RecipeIngredient
	for rows.Next() {
		var ri domain.RecipeIngredient
		var ing domain.Ingredient
		var notes *string // notes est nullable dans recipe_ingredients
		if err := rows.Scan(
			&ri.RecipeID, &ri.IngredientID, &ri.Quantity, &ri.Unit, &ri.IsOptional, &notes,
			&ing.ID, &ing.Name, &ing.Slug, &ing.CategoryID, &ing.DefaultUnit, &ing.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("ingredient.FindByRecipeID scan: %w", err)
		}
		if notes != nil {
			ri.Notes = *notes
		}
		ri.Ingredient = &ing
		results = append(results, ri)
	}
	return results, rows.Err()
}
