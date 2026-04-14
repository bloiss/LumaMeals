-- Migration 009 : corrige la vue matérialisée pour supporter le filtrage par supermarché
-- + ajoute requires_store_selection sur supermarkets

-- 1. Supprimer l'ancienne vue et son index
DROP INDEX IF EXISTS idx_cheapest_ingredient;
DROP MATERIALIZED VIEW IF EXISTS cheapest_products_per_ingredient;

-- 2. Ajouter requires_store_selection à supermarkets
ALTER TABLE supermarkets
    ADD COLUMN requires_store_selection BOOLEAN NOT NULL DEFAULT false;

-- 3. Recréer la vue avec DISTINCT ON (ingredient_id, supermarket_id)
--    + brand et image_url pour l'affichage frontend
CREATE MATERIALIZED VIEW cheapest_products_per_ingredient AS
WITH latest_prices AS (
    -- Prix le plus récent par produit
    SELECT DISTINCT ON (product_id)
        product_id,
        store_id,
        price_cents,
        scraped_at
    FROM product_price_history
    ORDER BY product_id, scraped_at DESC
),
normalized AS (
    SELECT
        ipm.ingredient_id,
        ipm.product_id,
        p.name              AS product_name,
        p.brand             AS product_brand,
        p.image_url,
        p.supermarket_id,
        p.unit_size,
        p.unit_type,
        ipm.conversion_factor,
        ipm.unit,
        lp.store_id,
        lp.price_cents,
        -- Prix normalisé par unité de l'ingrédient (ex: centimes par 100g)
        ROUND(lp.price_cents::NUMERIC / ipm.conversion_factor)::INTEGER AS price_per_unit_cents,
        lp.scraped_at
    FROM ingredient_product_mappings ipm
    JOIN products       p  ON p.id = ipm.product_id
    JOIN latest_prices  lp ON lp.product_id = p.id
    WHERE ipm.is_verified = true
)
SELECT DISTINCT ON (ingredient_id, supermarket_id)
    ingredient_id,
    product_id,
    product_name,
    product_brand,
    image_url,
    supermarket_id,
    unit_size,
    unit_type,
    conversion_factor,
    unit,
    store_id,
    price_cents,
    price_per_unit_cents,
    scraped_at
FROM normalized
ORDER BY ingredient_id, supermarket_id, price_per_unit_cents ASC;

-- Index unique sur (ingredient_id, supermarket_id) pour les lookups du generate handler
CREATE UNIQUE INDEX idx_cheapest_ingredient_supermarket
    ON cheapest_products_per_ingredient(ingredient_id, supermarket_id);
