package domain

import (
	"time"

	"github.com/google/uuid"
)

// Supermarket est une chaîne de supermarchés (ex: Lidl, Aldi, Leclerc).
type Supermarket struct {
	ID                     uuid.UUID `json:"id"                       db:"id"`
	Name                   string    `json:"name"                     db:"name"`
	Slug                   string    `json:"slug"                     db:"slug"`
	LogoURL                string    `json:"logo_url"                 db:"logo_url"`
	RequiresStoreSelection bool      `json:"requires_store_selection" db:"requires_store_selection"`
}

// Store est un magasin physique appartenant à un Supermarket.
type Store struct {
	ID            uuid.UUID    `json:"id"             db:"id"`
	SupermarketID uuid.UUID    `json:"supermarket_id" db:"supermarket_id"`
	Name          string       `json:"name"           db:"name"`
	Address       string       `json:"address"        db:"address"`
	City          string       `json:"city"           db:"city"`
	PostalCode    string       `json:"postal_code"    db:"postal_code"`
	Lat           float64      `json:"lat"            db:"lat"`
	Lng           float64      `json:"lng"            db:"lng"`
	Supermarket   *Supermarket `json:"supermarket,omitempty"`
	CreatedAt     time.Time    `json:"created_at"     db:"created_at"`
}

// Product est un produit concret vendu dans un supermarché (référencé par son scraper ID).
type Product struct {
	ID            uuid.UUID `json:"id"             db:"id"`
	SupermarketID uuid.UUID `json:"supermarket_id" db:"supermarket_id"`
	ExternalID    string    `json:"external_id"    db:"external_id"`
	Name          string    `json:"name"           db:"name"`
	Brand         string    `json:"brand"          db:"brand"`
	ImageURL      string    `json:"image_url"      db:"image_url"`
	URL           string    `json:"url"            db:"url"`
	UnitSize      float64   `json:"unit_size"      db:"unit_size"`
	UnitType      string    `json:"unit_type"      db:"unit_type"` // ex: "g", "ml", "unité"
	CreatedAt     time.Time `json:"created_at"     db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"     db:"updated_at"`
}

// PricePoint est un relevé de prix pour un produit à un instant donné.
// RÈGLE : price_cents est TOUJOURS en centimes (int). Jamais de float pour un prix.
type PricePoint struct {
	ID         uuid.UUID  `json:"id"          db:"id"`
	ProductID  uuid.UUID  `json:"product_id"  db:"product_id"`
	StoreID    *uuid.UUID `json:"store_id"    db:"store_id"`
	PriceCents int        `json:"price_cents" db:"price_cents"` // ex: 89 = 0,89 €
	ScrapedAt  time.Time  `json:"scraped_at"  db:"scraped_at"`
}

// IngredientProductMapping est le pont entre un ingrédient générique et un produit concret.
// conversion_factor exprime combien d'unités de l'ingrédient ce produit couvre.
// Ex: 1 kg de farine → 1 paquet Francine 1kg (conversion_factor = 1000, unit = "g")
type IngredientProductMapping struct {
	ID               uuid.UUID `json:"id"                db:"id"`
	IngredientID     uuid.UUID `json:"ingredient_id"     db:"ingredient_id"`
	ProductID        uuid.UUID `json:"product_id"        db:"product_id"`
	ConversionFactor float64   `json:"conversion_factor" db:"conversion_factor"`
	Unit             string    `json:"unit"              db:"unit"`
	IsVerified       bool      `json:"is_verified"       db:"is_verified"`
	CreatedAt        time.Time `json:"created_at"        db:"created_at"`
}
