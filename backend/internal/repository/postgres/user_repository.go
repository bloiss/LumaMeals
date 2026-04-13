package postgres

import (
	"context"
	"fmt"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	user.IsStudentVerified = domain.IsStudentEmail(user.Email)

	const q = `
		INSERT INTO users (id, email, is_student_verified)
		VALUES ($1, $2, $3)
		RETURNING created_at`

	return r.db.QueryRow(ctx, q, user.ID, user.Email, user.IsStudentVerified).
		Scan(&user.CreatedAt)
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	const q = `
		SELECT id, email, is_student_verified, created_at
		FROM users WHERE email = $1`

	var u domain.User
	err := r.db.QueryRow(ctx, q, email).Scan(&u.ID, &u.Email, &u.IsStudentVerified, &u.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("user.FindByEmail: %w", err)
	}
	return &u, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	const q = `
		SELECT id, email, is_student_verified, created_at
		FROM users WHERE id = $1`

	var u domain.User
	err := r.db.QueryRow(ctx, q, id).Scan(&u.ID, &u.Email, &u.IsStudentVerified, &u.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("user.FindByID: %w", err)
	}
	return &u, nil
}
