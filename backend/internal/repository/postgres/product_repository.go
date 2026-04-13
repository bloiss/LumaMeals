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
	err := r.db.QueryRow(ctx, q, id).Scan(
		&p.ID, &p.SupermarketID, &p.ExternalID, &p.Name, &p.Brand,
		&p.ImageURL, &p.URL, &p.UnitSize, &p.UnitType, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("product.FindByID: %w", err)
	}
	return &p, nil
}

// FindCheapestForIngredient utilise la vue matérialisée cheapest_products_per_ingredient.
// Le prix retourné (price_cents) est TOUJOURS en centimes (int).
func (r *ProductRepository) FindCheapestForIngredient(ctx context.Context, ingredientID uuid.UUID) (*domain.MappedProduct, error) {
	const q = `
		SELECT
			i.id, i.name, i.slug, i.category_id, i.default_unit, i.created_at,
			ipm.id, ipm.ingredient_id, ipm.product_id, ipm.conversion_factor, ipm.unit, ipm.is_verified, ipm.created_at,
			p.id, p.supermarket_id, p.external_id, p.name, p.brand, p.image_url, p.url, p.unit_size, p.unit_type, p.created_at, p.updated_at,
			s.id, s.name, s.slug, s.logo_url,
			c.price_cents,
			c.price_per_unit_cents
		FROM cheapest_products_per_ingredient c
		JOIN ingredients               i   ON i.id   = c.ingredient_id
		JOIN ingredient_product_mappings ipm ON ipm.ingredient_id = c.ingredient_id AND ipm.product_id = c.product_id
		JOIN products                  p   ON p.id   = c.product_id
		JOIN supermarkets              s   ON s.id   = p.supermarket_id
		WHERE c.ingredient_id = $1`

	var mp domain.MappedProduct
	err := r.db.QueryRow(ctx, q, ingredientID).Scan(
		&mp.Ingredient.ID, &mp.Ingredient.Name, &mp.Ingredient.Slug,
		&mp.Ingredient.CategoryID, &mp.Ingredient.DefaultUnit, &mp.Ingredient.CreatedAt,
		&mp.Mapping.ID, &mp.Mapping.IngredientID, &mp.Mapping.ProductID,
		&mp.Mapping.ConversionFactor, &mp.Mapping.Unit, &mp.Mapping.IsVerified, &mp.Mapping.CreatedAt,
		&mp.Product.ID, &mp.Product.SupermarketID, &mp.Product.ExternalID, &mp.Product.Name,
		&mp.Product.Brand, &mp.Product.ImageURL, &mp.Product.URL,
		&mp.Product.UnitSize, &mp.Product.UnitType, &mp.Product.CreatedAt, &mp.Product.UpdatedAt,
		&mp.Supermarket.ID, &mp.Supermarket.Name, &mp.Supermarket.Slug, &mp.Supermarket.LogoURL,
		&mp.PriceCents,
		&mp.NormalizedCents,
	)
	if err != nil {
		return nil, fmt.Errorf("product.FindCheapestForIngredient: %w", err)
	}
	return &mp, nil
}
