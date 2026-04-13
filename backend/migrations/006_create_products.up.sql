CREATE TABLE products (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    supermarket_id UUID           NOT NULL REFERENCES supermarkets(id),
    external_id    VARCHAR(255),
    name           VARCHAR(255)   NOT NULL,
    brand          VARCHAR(100),
    image_url      TEXT,
    url            TEXT,
    unit_size      NUMERIC(10, 3),
    unit_type      VARCHAR(50),                   -- ex: "g", "ml", "unité"
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    UNIQUE (supermarket_id, external_id)
);

-- price_cents est TOUJOURS en centimes (INTEGER). Jamais de NUMERIC/FLOAT pour les prix.
CREATE TABLE product_price_history (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID        NOT NULL REFERENCES products(id),
    store_id    UUID        REFERENCES stores(id),
    price_cents INTEGER     NOT NULL CHECK (price_cents >= 0),
    scraped_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_supermarket     ON products(supermarket_id);
CREATE INDEX idx_price_history_product    ON product_price_history(product_id, scraped_at DESC);
CREATE INDEX idx_price_history_store      ON product_price_history(store_id);
