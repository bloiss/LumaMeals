-- Seeds : 6 vibes
-- UUIDs fixes préfixés 0001-xxxx pour les vibes

INSERT INTO vibes (id, name, slug, description, emoji) VALUES
    ('00000000-0000-0000-0001-000000000001', 'Protéiné',    'proteine',    'Riche en protéines pour les sportifs',           '💪'),
    ('00000000-0000-0000-0001-000000000002', 'Rapide',      'rapide',      'Prêt en moins de 20 minutes',                    '⚡'),
    ('00000000-0000-0000-0001-000000000003', 'Cheat Meal',  'cheat-meal',  'Pour se faire plaisir sans culpabilité',         '🍔'),
    ('00000000-0000-0000-0001-000000000004', 'Végétarien',  'vegetarien',  'Sans viande ni poisson',                         '🥗'),
    ('00000000-0000-0000-0001-000000000005', 'Équilibré',   'equilibre',   'Macros équilibrés, repas complet',               '⚖️'),
    ('00000000-0000-0000-0001-000000000006', 'Ultra budget','ultra-budget','Le maximum de calories pour le minimum de budget','💰')
ON CONFLICT (slug) DO NOTHING;
