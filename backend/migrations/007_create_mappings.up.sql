-- Pont entre couche 2 (ingrédients génériques) et couche 3 (produits concrets).
-- conversion_factor : combien d'unités de l'ingrédient ce produit couvre.
-- Ex : paquet Francine 1kg → ingredient "farine", conversion_factor=1000, unit="g"
CREATE TABLE ingredient_product_mappings (
    id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_id     UUID           NOT NULL REFERENCES ingredients(id),
    product_id        UUID           NOT NULL REFERENCES products(id),
    conversion_factor NUMERIC(10, 4) NOT NULL DEFAULT 1,
    unit              VARCHAR(50)    NOT NULL,
    is_verified       BOOLEAN        NOT NULL DEFAULT false,
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    UNIQUE (ingredient_id, product_id)
);

CREATE INDEX idx_mappings_ingredient ON ingredient_product_mappings(ingredient_id);
CREATE INDEX idx_mappings_product    ON ingredient_product_mappings(product_id);
