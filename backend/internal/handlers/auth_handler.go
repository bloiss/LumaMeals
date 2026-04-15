package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/bloiss/lumeameals/internal/core/domain"
	"github.com/bloiss/lumeameals/internal/core/ports"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	users     ports.UserRepository
	jwtSecret []byte
}

func NewAuthHandler(users ports.UserRepository, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		users:     users,
		jwtSecret: []byte(jwtSecret),
	}
}

// POST /api/v1/auth/register
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req domain.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "corps JSON invalide")
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if req.Email == "" || !strings.Contains(req.Email, "@") {
		respondError(w, http.StatusBadRequest, "adresse email invalide")
		return
	}
	if len(req.Password) < 8 {
		respondError(w, http.StatusBadRequest, "mot de passe trop court (8 caractères minimum)")
		return
	}

	existing, err := h.users.FindByEmail(r.Context(), req.Email)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}
	if existing != nil {
		respondError(w, http.StatusConflict, "un compte existe déjà avec cet email")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}

	user := &domain.User{
		Email:        req.Email,
		PasswordHash: string(hash),
	}
	if err := h.users.Create(r.Context(), user); err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}

	token, err := h.signToken(user)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}

	respondJSON(w, http.StatusCreated, domain.AuthResponse{Token: token, User: *user})
}

// POST /api/v1/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req domain.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "corps JSON invalide")
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	user, err := h.users.FindByEmail(r.Context(), req.Email)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}
	if user == nil {
		respondError(w, http.StatusUnauthorized, "email ou mot de passe incorrect")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		respondError(w, http.StatusUnauthorized, "email ou mot de passe incorrect")
		return
	}

	token, err := h.signToken(user)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "erreur serveur")
		return
	}

	respondJSON(w, http.StatusOK, domain.AuthResponse{Token: token, User: *user})
}

func (h *AuthHandler) signToken(user *domain.User) (string, error) {
	claims := jwt.MapClaims{
		"sub": user.ID.String(),
		"exp": time.Now().Add(30 * 24 * time.Hour).Unix(), // 30 jours
		"iat": time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(h.jwtSecret)
}
