// Package scraper définit l'interface commune à tous les scrapers de prix
// et les types partagés utilisés par le runner.
package scraper

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// ScrapedPrice est un relevé de prix brut retourné par un scraper.
// product_external_id correspond à la colonne external_id de la table products.
type ScrapedPrice struct {
	ProductExternalID string
	StoreID           uuid.UUID
	PriceCents        int // toujours en centimes, jamais de float
	ScrapedAt         time.Time
}

// ProductScraper est l'interface que chaque scraper doit implémenter.
type ProductScraper interface {
	// Name retourne l'identifiant humain du scraper (ex: "lidl", "leclerc").
	Name() string
	// Scrape exécute le scraping et retourne la liste des prix récoltés.
	Scrape(ctx context.Context) ([]ScrapedPrice, error)
}
