-- ============================================================
-- Forward Vision DB — Seed inicial
-- Admin: admin@forwardvision.com / Admin123!
-- ============================================================

-- Admin user (bcrypt hash de "Admin123!")
INSERT INTO users (id, name, email, password_hash, role)
VALUES (
  gen_random_uuid(),
  'Administrador Forward Vision',
  'admin@forwardvision.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfkZlba5sCNNGKS',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Cliente de demostración (demo@cliente.com / Cliente123!)
INSERT INTO users (id, name, email, password_hash, role)
VALUES (
  gen_random_uuid(),
  'Cliente Demo',
  'demo@cliente.com',
  '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uswpefYLey',
  'cliente'
)
ON CONFLICT (email) DO NOTHING;

-- Galería de ejemplo (imágenes públicas para demo)
WITH admin_user AS (SELECT id FROM users WHERE email = 'admin@forwardvision.com')
INSERT INTO media (id, title, type, category, url, thumbnail_url, cloudinary_id, uploaded_by)
SELECT
  gen_random_uuid(), title, type, category, url, thumbnail_url, 'demo-' || category, admin_user.id
FROM admin_user, (VALUES
  ('Fibra Óptica Residencial', 'image', 'Instalaciones',
   'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=1200',
   'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=800',
   'inst-1'),
  ('Configuración Router Giga', 'image', 'Instalaciones',
   'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800',
   'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=400',
   'inst-2'),
  ('Técnicos en Acción', 'image', 'Campo',
   'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200',
   'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',
   'campo-1'),
  ('Mantenimiento de Red', 'image', 'Campo',
   'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800',
   'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=400',
   'campo-2'),
  ('Lanzamiento Giga Planes', 'image', 'Marketing',
   'https://images.unsplash.com/photo-1533750516457-a7f992034fce?q=80&w=800',
   'https://images.unsplash.com/photo-1533750516457-a7f992034fce?q=80&w=400',
   'mktg-1'),
  ('Equipo de Ventas Forward', 'image', 'Marketing',
   'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800',
   'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400',
   'mktg-2')
) AS t(title, type, category, url, thumbnail_url, cloud_id)
ON CONFLICT DO NOTHING;
