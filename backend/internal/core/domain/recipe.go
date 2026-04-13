package domain

import (
	"time"

	"github.com/google/uuid"
)

// Recipe représente une recette abstraite, indépendante de tout supermarché.
type Recipe struct {
	ID          uuid.UUID          `json:"id"           db:"id"`
	Name        string             `json:"name"         db:"name"`
	Description string             `json:"description"  db:"description"`
	Servings    int                `json:"servings"     db:"servings"`
	PrepTimeMin int                `json:"prep_time_min" db:"prep_time_min"`
	CookTimeMin int                `json:"cook_time_min" db:"cook_time_min"`
	ImageURL    string             `json:"image_url"    db:"image_url"`
	Vibes       []Vibe             `json:"vibes,omitempty"`
	Ingredients []RecipeIngredient `json:"ingredients,omitempty"`
	CreatedAt   time.Time          `json:"created_at"   db:"created_at"`
}

// Vibe est une ambiance/catégorie associée à une recette (ex: "Réconfort", "Rapide").
type Vibe struct {
	ID          uuid.UUID `json:"id"          db:"id"`
	Name        string    `json:"name"        db:"name"`
	Slug        string    `json:"slug"        db:"slug"`
	Description string    `json:"description" db:"description"`
	Emoji       string    `json:"emoji"       db:"emoji"`
}

// RecipeIngredient lie une recette à un ingrédient générique avec sa quantité.
type RecipeIngredient struct {
	RecipeID     uuid.UUID   `json:"recipe_id"     db:"recipe_id"`
	IngredientID uuid.UUID   `json:"ingredient_id" db:"ingredient_id"`
	Quantity     float64     `json:"quantity"      db:"quantity"`
	Unit         string      `json:"unit"          db:"unit"`
	IsOptional   bool        `json:"is_optional"   db:"is_optional"`
	Notes        string      `json:"notes,omitempty" db:"notes"`
	Ingredient   *Ingredient `json:"ingredient,omitempty"`
}
