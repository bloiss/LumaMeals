#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# run_seeds.sh — Lance les migrations puis insère les seeds
# Usage : bash backend/seeds/run_seeds.sh [--seeds-only]
#
# Prérequis :
#   - Docker Compose postgres lancé : docker compose up -d postgres
#   - Variables d'environnement depuis backend/.env (chargées auto)
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$ROOT_DIR/backend/.env"

# ── Charger .env ──────────────────────────────────────────────────
if [[ -f "$ENV_FILE" ]]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

DATABASE_URL="${DATABASE_URL:-postgres://lumeameals:lumeameals@localhost:5432/lumeameals?sslmode=disable}"
MIGRATIONS_DIR="$ROOT_DIR/backend/migrations"
SEEDS_DIR="$ROOT_DIR/backend/seeds"

# ── Fonction psql via Docker ──────────────────────────────────────
run_sql() {
  local file="$1"
  echo "  → $(basename "$file")"
  docker exec -i lumeameals-db psql "$DATABASE_URL" < "$file"
}

# ── Migrations ────────────────────────────────────────────────────
if [[ "${1:-}" != "--seeds-only" ]]; then
  echo ""
  echo "▶  Migrations"
  echo "────────────────────────────────────────────────────────────"

  # Utilise golang-migrate s'il est installé, sinon psql direct
  if command -v migrate &>/dev/null; then
    migrate -path "$MIGRATIONS_DIR" \
            -database "$DATABASE_URL" \
            up
  else
    echo "  (migrate CLI non trouvé — exécution des .up.sql via psql)"
    for f in "$MIGRATIONS_DIR"/*.up.sql; do
      run_sql "$f"
    done
  fi
fi

# ── Seeds ─────────────────────────────────────────────────────────
echo ""
echo "▶  Seeds"
echo "────────────────────────────────────────────────────────────"
for f in "$SEEDS_DIR"/0*.sql; do
  run_sql "$f"
done

echo ""
echo "✓  Migrations + seeds terminés avec succès."
echo "   Vue matérialisée cheapest_products_per_ingredient rafraîchie."
