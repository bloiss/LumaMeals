-- Seeds : 3 catégories d'ingrédients
-- UUIDs fixes préfixés 0002-xxxx

INSERT INTO ingredient_categories (id, name, slug) VALUES
    ('00000000-0000-0000-0002-000000000001', 'Féculents',  'feculent'),
    ('00000000-0000-0000-0002-000000000002', 'Protéines',  'proteine'),
    ('00000000-0000-0000-0002-000000000003', 'Légumes',    'legume')
ON CONFLICT (slug) DO NOTHING;
