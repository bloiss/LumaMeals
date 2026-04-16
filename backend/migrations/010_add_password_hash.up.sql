-- Ajout de la colonne password_hash pour l'auth locale (bcrypt).
-- DEFAULT '' temporaire : les lignes existantes (seeds) n'ont pas de mot de passe.
ALTER TABLE users
    ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';
