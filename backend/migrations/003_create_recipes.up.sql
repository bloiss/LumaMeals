CREATE TABLE recipes (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    servings      SMALLINT     NOT NULL DEFAULT 2,
    prep_time_min SMALLINT,
    cook_time_min SMALLINT,
    image_url     TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE recipe_vibes (
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    vibe_id   UUID NOT NULL REFERENCES vibes(id)   ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, vibe_id)
);

CREATE INDEX idx_recipe_vibes_vibe ON recipe_vibes(vibe_id);
