package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SupermarketRepository struct {
	pool *pgxpool.Pool
}

func NewSupermarketRepository(pool *pgxpool.Pool) *SupermarketRepository {
	return &SupermarketRepository{pool: pool}
}

// FindAll retourne tous les supermarchés.
func (r *SupermarketRepository) FindAll(ctx context.Context) ([]domain.Supermarket, error) {
	const q = `
		SELECT id, name, slug,
		       COALESCE(logo_url, ''),
		       requires_store_selection
		FROM supermarkets
		ORDER BY name`

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("supermarket_repository.FindAll: %w", err)
	}
	defer rows.Close()

	var result []domain.Supermarket
	for rows.Next() {
		var s domain.Supermarket
		if err := rows.Scan(&s.ID, &s.Name, &s.Slug, &s.LogoURL, &s.RequiresStoreSelection); err != nil {
			return nil, fmt.Errorf("supermarket_repository.FindAll scan: %w", err)
		}
		result = append(result, s)
	}
	return result, rows.Err()
}

// FindStoresByPostalCode retourne les magasins d'un code postal donné.
func (r *SupermarketRepository) FindStoresByPostalCode(ctx context.Context, postalCode string) ([]domain.Store, error) {
	const q = `
		SELECT s.id, s.supermarket_id, s.name,
		       COALESCE(s.address, ''),
		       COALESCE(s.city, ''),
		       COALESCE(s.postal_code, ''),
		       COALESCE(s.lat, 0),
		       COALESCE(s.lng, 0),
		       s.created_at,
		       sm.id, sm.name, sm.slug,
		       COALESCE(sm.logo_url, ''),
		       sm.requires_store_selection
		FROM stores s
		JOIN supermarkets sm ON sm.id = s.supermarket_id
		WHERE s.postal_code = $1
		ORDER BY sm.name, s.name`

	rows, err := r.pool.Query(ctx, q, postalCode)
	if err != nil {
		return nil, fmt.Errorf("supermarket_repository.FindStoresByPostalCode: %w", err)
	}
	defer rows.Close()

	var result []domain.Store
	for rows.Next() {
		var st domain.Store
		sm := &domain.Supermarket{}
		if err := rows.Scan(
			&st.ID, &st.SupermarketID, &st.Name,
			&st.Address, &st.City, &st.PostalCode,
			&st.Lat, &st.Lng, &st.CreatedAt,
			&sm.ID, &sm.Name, &sm.Slug, &sm.LogoURL, &sm.RequiresStoreSelection,
		); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return nil, nil
			}
			return nil, fmt.Errorf("supermarket_repository.FindStoresByPostalCode scan: %w", err)
		}
		st.Supermarket = sm
		result = append(result, st)
	}
	return result, rows.Err()
}
