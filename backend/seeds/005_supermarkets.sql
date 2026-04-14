-- Seeds : 2 supermarchés + 3 magasins
-- UUIDs fixes préfixés 0005-xxxx (supermarchés) et 0006-xxxx (magasins)
--
-- Lidl  : prix nationaux → 1 magasin virtuel "National"
--         requires_store_selection = false
-- Leclerc : prix par magasin → 2 vrais magasins (Rennes, Nantes)
--           requires_store_selection = true

-- ─── Supermarchés ─────────────────────────────────────────────────────────────
INSERT INTO supermarkets (id, name, slug, requires_store_selection) VALUES
    ('00000000-0000-0000-0005-000000000001', 'Lidl',    'lidl',    false),
    ('00000000-0000-0000-0005-000000000002', 'Leclerc', 'leclerc', true)
ON CONFLICT (slug) DO NOTHING;

-- ─── Magasins ─────────────────────────────────────────────────────────────────
INSERT INTO stores (id, supermarket_id, name, city, postal_code, lat, lng) VALUES
    -- Lidl : magasin national fictif (prix nationaux = identiques partout)
    ('00000000-0000-0000-0006-000000000001',
     '00000000-0000-0000-0005-000000000001',
     'Lidl National', 'National', '00000', NULL, NULL),

    -- Leclerc Rennes
    ('00000000-0000-0000-0006-000000000002',
     '00000000-0000-0000-0005-000000000002',
     'E.Leclerc Rennes Cesson', 'Rennes', '35510',
     48.12345678, -1.60123456),

    -- Leclerc Nantes
    ('00000000-0000-0000-0006-000000000003',
     '00000000-0000-0000-0005-000000000002',
     'E.Leclerc Nantes Saint-Herblain', 'Saint-Herblain', '44800',
     47.23456789, -1.59876543)
ON CONFLICT DO NOTHING;
