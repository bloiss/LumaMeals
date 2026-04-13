package domain

import (
	"strings"
	"time"

	"github.com/google/uuid"
)

// User est un utilisateur de LumaMeals.
// is_student_verified indique si son adresse mail appartient à un domaine étudiant reconnu.
type User struct {
	ID                uuid.UUID `json:"id"                  db:"id"`
	Email             string    `json:"email"               db:"email"`
	IsStudentVerified bool      `json:"is_student_verified" db:"is_student_verified"`
	CreatedAt         time.Time `json:"created_at"          db:"created_at"`
}

// studentDomainSuffixes liste les suffixes de domaines étudiants reconnus.
var studentDomainSuffixes = []string{
	".edu",
	".ac.fr",
}

// studentDomainPrefixes liste les préfixes de domaines étudiants reconnus.
var studentDomainPrefixes = []string{
	"univ-",
	"etu.",
}

// IsStudentEmail vérifie si une adresse email appartient à un domaine étudiant reconnu.
// Domaines acceptés : *.edu, *.ac.fr, univ-*.fr, etu.*.fr
func IsStudentEmail(email string) bool {
	parts := strings.SplitN(email, "@", 2)
	if len(parts) != 2 || parts[1] == "" {
		return false
	}
	domain := strings.ToLower(parts[1])

	for _, suffix := range studentDomainSuffixes {
		if strings.HasSuffix(domain, suffix) {
			return true
		}
	}
	for _, prefix := range studentDomainPrefixes {
		if strings.HasPrefix(domain, prefix) {
			return true
		}
	}
	return false
}
