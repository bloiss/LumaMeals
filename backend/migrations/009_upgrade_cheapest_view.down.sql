-- Rollback migration 009

DROP INDEX IF EXISTS idx_cheapest_ingredient_supermarket;
DROP MATERIALIZED VIEW IF EXISTS cheapest_products_per_ingredient;

ALTER TABLE supermarkets
    DROP COLUMN IF EXISTS requires_store_selection;

-- Restaurer la vue originale de migration 008
CREATE MATERIALIZED VIEW cheapest_products_per_ingredient AS
WITH latest_prices AS (
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
        p.name           AS product_name,
        p.supermarket_id,
        p.unit_size,
        p.unit_type,
        ipm.conversion_factor,
        ipm.unit,
        lp.store_id,
        lp.price_cents,
        ROUND(lp.price_cents::NUMERIC / ipm.conversion_factor)::INTEGER AS price_per_unit_cents,
        lp.scraped_at
    FROM ingredient_product_mappings ipm
    JOIN products                p  ON p.id  = ipm.product_id
    JOIN latest_prices           lp ON lp.product_id = p.id
    WHERE ipm.is_verified = true
)
SELECT DISTINCT ON (ingredient_id)
    ingredient_id,
    product_id,
    product_name,
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
ORDER BY ingredient_id, price_per_unit_cents ASC;

CREATE UNIQUE INDEX idx_cheapest_ingredient
    ON cheapest_products_per_ingredient(ingredient_id);
