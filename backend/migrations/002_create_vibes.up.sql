CREATE TABLE vibes (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    emoji       VARCHAR(10),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
