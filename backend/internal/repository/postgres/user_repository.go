package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	user.IsStudentVerified = domain.IsStudentEmail(user.Email)

	const q = `
		INSERT INTO users (id, email, password_hash, is_student_verified)
		VALUES ($1, $2, $3, $4)
		RETURNING created_at`

	return r.pool.QueryRow(ctx, q,
		user.ID,
		user.Email,
		user.PasswordHash,
		user.IsStudentVerified,
	).Scan(&user.CreatedAt)
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	const q = `
		SELECT id, email, password_hash, is_student_verified, created_at
		FROM users WHERE email = $1`

	row := r.pool.QueryRow(ctx, q, email)
	u, err := scanUser(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("user_repository.FindByEmail: %w", err)
	}
	return &u, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	const q = `
		SELECT id, email, password_hash, is_student_verified, created_at
		FROM users WHERE id = $1`

	row := r.pool.QueryRow(ctx, q, id)
	u, err := scanUser(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("user_repository.FindByID: %w", err)
	}
	return &u, nil
}

func scanUser(row pgx.Row) (domain.User, error) {
	var u domain.User
	err := row.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.IsStudentVerified, &u.CreatedAt)
	return u, err
}
