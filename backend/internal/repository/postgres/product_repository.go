package postgres

import (
	"context"
	"fmt"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProductRepository struct {
	db *pgxpool.Pool
}

func NewProductRepository(db *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{db: db}
}

func (r *ProductRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	const q = `
		SELECT id, supermarket_id, external_id, name, brand, image_url, url,
		       unit_size, unit_type, created_at, updated_at
		FROM products WHERE id = $1`

	var p domain.Product
	var brand, imageURL, url, externalID *string
	err := r.db.QueryRow(ctx, q, id).Scan(
		&p.ID, &p.SupermarketID, &externalID, &p.Name, &brand,
		&imageURL, &url, &p.UnitSize, &p.UnitType, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("product.FindByID: %w", err)
	}
	if externalID != nil {
		p.ExternalID = *externalID
	}
	if brand != nil {
		p.Brand = *brand
	}
	if imageURL != nil {
		p.ImageURL = *imageURL
	}
	if url != nil {
		p.URL = *url
	}
	return &p, nil
}

// FindCheapestForIngredient interroge la vue matérialisée cheapest_products_per_ingredient
// filtrée par (ingredient_id, supermarket_id).
// Tous les prix sont en centimes (int). Jamais de float.
func (r *ProductRepository) FindCheapestForIngredient(ctx context.Context, ingredientID uuid.UUID, supermarketID uuid.UUID) (*domain.MappedProduct, error) {
	const q = `
		SELECT
			i.id, i.name, i.slug, i.category_id, i.default_unit, i.created_at,
			ipm.id, ipm.ingredient_id, ipm.product_id, ipm.conversion_factor, ipm.unit, ipm.is_verified, ipm.created_at,
			p.id, p.supermarket_id, p.external_id, p.name, p.brand, p.image_url, p.url,
			p.unit_size, p.unit_type, p.created_at, p.updated_at,
			s.id, s.name, s.slug, s.logo_url, s.requires_store_selection,
			c.price_cents,
			c.price_per_unit_cents
		FROM cheapest_products_per_ingredient c
		JOIN ingredients                  i   ON i.id  = c.ingredient_id
		JOIN ingredient_product_mappings  ipm ON ipm.ingredient_id = c.ingredient_id
		                                     AND ipm.product_id    = c.product_id
		JOIN products                     p   ON p.id  = c.product_id
		JOIN supermarkets                 s   ON s.id  = c.supermarket_id
		WHERE c.ingredient_id  = $1
		  AND c.supermarket_id = $2`

	var mp domain.MappedProduct

	// Colonnes TEXT nullable (brand, image_url, url, logo_url, external_id)
	// category_id n'est jamais NULL dans nos données (ON DELETE SET NULL non déclenché)
	var productExternalID, productBrand, productImageURL, productURL *string
	var supermarketLogoURL *string

	err := r.db.QueryRow(ctx, q, ingredientID, supermarketID).Scan(
		// ingredient — category_id scanné directement (jamais NULL dans nos données)
		&mp.Ingredient.ID, &mp.Ingredient.Name, &mp.Ingredient.Slug,
		&mp.Ingredient.CategoryID, &mp.Ingredient.DefaultUnit, &mp.Ingredient.CreatedAt,
		// mapping
		&mp.Mapping.ID, &mp.Mapping.IngredientID, &mp.Mapping.ProductID,
		&mp.Mapping.ConversionFactor, &mp.Mapping.Unit, &mp.Mapping.IsVerified, &mp.Mapping.CreatedAt,
		// product
		&mp.Product.ID, &mp.Product.SupermarketID, &productExternalID, &mp.Product.Name,
		&productBrand, &productImageURL, &productURL,
		&mp.Product.UnitSize, &mp.Product.UnitType, &mp.Product.CreatedAt, &mp.Product.UpdatedAt,
		// supermarket
		&mp.Supermarket.ID, &mp.Supermarket.Name, &mp.Supermarket.Slug,
		&supermarketLogoURL, &mp.Supermarket.RequiresStoreSelection,
		// prix
		&mp.PriceCents,
		&mp.NormalizedCents,
	)
	if err != nil {
		return nil, fmt.Errorf("product.FindCheapestForIngredient: %w", err)
	}

	if productExternalID != nil {
		mp.Product.ExternalID = *productExternalID
	}
	if productBrand != nil {
		mp.Product.Brand = *productBrand
	}
	if productImageURL != nil {
		mp.Product.ImageURL = *productImageURL
	}
	if productURL != nil {
		mp.Product.URL = *productURL
	}
	if supermarketLogoURL != nil {
		mp.Supermarket.LogoURL = *supermarketLogoURL
	}
	return &mp, nil
}
