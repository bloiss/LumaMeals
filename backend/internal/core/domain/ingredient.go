package domain

import (
	"time"

	"github.com/google/uuid"
)

// IngredientCategory regroupe les ingrédients par famille (Légumes, Viandes, etc.).
type IngredientCategory struct {
	ID   uuid.UUID `json:"id"   db:"id"`
	Name string    `json:"name" db:"name"`
	Slug string    `json:"slug" db:"slug"`
}

// Ingredient est un ingrédient générique, indépendant de tout produit ou supermarché.
type Ingredient struct {
	ID          uuid.UUID           `json:"id"           db:"id"`
	Name        string              `json:"name"         db:"name"`
	Slug        string              `json:"slug"         db:"slug"`
	CategoryID  *uuid.UUID          `json:"category_id"  db:"category_id"`
	DefaultUnit string              `json:"default_unit" db:"default_unit"`
	Category    *IngredientCategory `json:"category,omitempty"`
	Aliases     []IngredientAlias   `json:"aliases,omitempty"`
	CreatedAt   time.Time           `json:"created_at"   db:"created_at"`
}

// IngredientAlias est un nom alternatif pour un ingrédient (ex: "courgette" / "zucchini").
type IngredientAlias struct {
	ID           uuid.UUID `json:"id"            db:"id"`
	IngredientID uuid.UUID `json:"ingredient_id" db:"ingredient_id"`
	Alias        string    `json:"alias"         db:"alias"`
	Locale       string    `json:"locale"        db:"locale"` // ex: "fr", "en"
}
