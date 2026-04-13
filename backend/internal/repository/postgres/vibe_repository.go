package postgres

import (
	"context"
	"fmt"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VibeRepository struct {
	db *pgxpool.Pool
}

func NewVibeRepository(db *pgxpool.Pool) *VibeRepository {
	return &VibeRepository{db: db}
}

func (r *VibeRepository) FindAll(ctx context.Context) ([]domain.Vibe, error) {
	const q = `SELECT id, name, slug, description, emoji FROM vibes ORDER BY name`

	rows, err := r.db.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("vibe.FindAll: %w", err)
	}
	defer rows.Close()

	var vibes []domain.Vibe
	for rows.Next() {
		var v domain.Vibe
		if err := rows.Scan(&v.ID, &v.Name, &v.Slug, &v.Description, &v.Emoji); err != nil {
			return nil, fmt.Errorf("vibe.FindAll scan: %w", err)
		}
		vibes = append(vibes, v)
	}
	return vibes, rows.Err()
}

func (r *VibeRepository) FindBySlug(ctx context.Context, slug string) (*domain.Vibe, error) {
	const q = `SELECT id, name, slug, description, emoji FROM vibes WHERE slug = $1`

	var v domain.Vibe
	err := r.db.QueryRow(ctx, q, slug).Scan(&v.ID, &v.Name, &v.Slug, &v.Description, &v.Emoji)
	if err != nil {
		return nil, fmt.Errorf("vibe.FindBySlug: %w", err)
	}
	return &v, nil
}