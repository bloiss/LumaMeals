CREATE TABLE ingredient_categories (
    id   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ingredients (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) NOT NULL UNIQUE,
    category_id  UUID         REFERENCES ingredient_categories(id) ON DELETE SET NULL,
    default_unit VARCHAR(50),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE ingredient_aliases (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_id UUID         NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    alias         VARCHAR(255) NOT NULL,
    locale        VARCHAR(10)  NOT NULL DEFAULT 'fr',
    UNIQUE (alias, locale)
);

CREATE TABLE recipe_ingredients (
    recipe_id     UUID           NOT NULL REFERENCES recipes(id)     ON DELETE CASCADE,
    ingredient_id UUID           NOT NULL REFERENCES ingredients(id),
    quantity      NUMERIC(10, 3) NOT NULL,
    unit          VARCHAR(50)    NOT NULL,
    is_optional   BOOLEAN        NOT NULL DEFAULT false,
    notes         TEXT,
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE INDEX idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
