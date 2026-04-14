package postgres

import (
	"context"
	"fmt"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RecipeRepository struct {
	db *pgxpool.Pool
}

func NewRecipeRepository(db *pgxpool.Pool) *RecipeRepository {
	return &RecipeRepository{db: db}
}

// scanRecipe scanne une ligne vers domain.Recipe en gérant les colonnes nullable
// (description, prep_time_min, cook_time_min, image_url peuvent être NULL).
func scanRecipe(row pgx.Row) (domain.Recipe, error) {
	var rec domain.Recipe
	var description *string
	var prepTimeMin, cookTimeMin *int
	var imageURL *string

	err := row.Scan(
		&rec.ID, &rec.Name, &description,
		&rec.Servings, &prepTimeMin, &cookTimeMin,
		&imageURL, &rec.CreatedAt,
	)
	if err != nil {
		return rec, err
	}
	if description != nil {
		rec.Description = *description
	}
	if prepTimeMin != nil {
		rec.PrepTimeMin = *prepTimeMin
	}
	if cookTimeMin != nil {
		rec.CookTimeMin = *cookTimeMin
	}
	if imageURL != nil {
		rec.ImageURL = *imageURL
	}
	return rec, nil
}

func (r *RecipeRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Recipe, error) {
	const q = `
		SELECT id, name, description, servings, prep_time_min, cook_time_min, image_url, created_at
		FROM recipes
		WHERE id = $1`

	rec, err := scanRecipe(r.db.QueryRow(ctx, q, id))
	if err != nil {
		return nil, fmt.Errorf("recipe.FindByID: %w", err)
	}
	return &rec, nil
}

func (r *RecipeRepository) FindAll(ctx context.Context) ([]domain.Recipe, error) {
	const q = `
		SELECT id, name, description, servings, prep_time_min, cook_time_min, image_url, created_at
		FROM recipes
		ORDER BY created_at DESC`

	rows, err := r.db.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("recipe.FindAll: %w", err)
	}
	defer rows.Close()

	var recipes []domain.Recipe
	for rows.Next() {
		rec, err := scanRecipe(rows)
		if err != nil {
			return nil, fmt.Errorf("recipe.FindAll scan: %w", err)
		}
		recipes = append(recipes, rec)
	}
	return recipes, rows.Err()
}

func (r *RecipeRepository) FindByVibe(ctx context.Context, vibeID uuid.UUID) ([]domain.Recipe, error) {
	const q = `
		SELECT r.id, r.name, r.description, r.servings, r.prep_time_min, r.cook_time_min, r.image_url, r.created_at
		FROM recipes r
		JOIN recipe_vibes rv ON rv.recipe_id = r.id
		WHERE rv.vibe_id = $1
		ORDER BY r.created_at DESC`

	rows, err := r.db.Query(ctx, q, vibeID)
	if err != nil {
		return nil, fmt.Errorf("recipe.FindByVibe: %w", err)
	}
	defer rows.Close()

	var recipes []domain.Recipe
	for rows.Next() {
		rec, err := scanRecipe(rows)
		if err != nil {
			return nil, fmt.Errorf("recipe.FindByVibe scan: %w", err)
		}
		recipes = append(recipes, rec)
	}
	return recipes, rows.Err()
}

func (r *RecipeRepository) Create(ctx context.Context, recipe *domain.Recipe) error {
	const q = `
		INSERT INTO recipes (id, name, description, servings, prep_time_min, cook_time_min, image_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`

	if recipe.ID == uuid.Nil {
		recipe.ID = uuid.New()
	}
	_, err := r.db.Exec(ctx, q,
		recipe.ID, recipe.Name, recipe.Description,
		recipe.Servings, recipe.PrepTimeMin, recipe.CookTimeMin,
		recipe.ImageURL,
	)
	if err != nil {
		return fmt.Errorf("recipe.Create: %w", err)
	}
	return nil
}
