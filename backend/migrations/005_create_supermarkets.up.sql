CREATE TABLE supermarkets (
    id       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name     VARCHAR(100) NOT NULL,
    slug     VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT
);

CREATE TABLE stores (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    supermarket_id UUID           NOT NULL REFERENCES supermarkets(id),
    name           VARCHAR(255)   NOT NULL,
    address        TEXT,
    city           VARCHAR(100),
    postal_code    VARCHAR(20),
    lat            DECIMAL(10, 8),
    lng            DECIMAL(11, 8),
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stores_supermarket ON stores(supermarket_id);
CREATE INDEX idx_stores_postal_code ON stores(postal_code);
