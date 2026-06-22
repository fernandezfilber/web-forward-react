-- ============================================================
-- Forward Vision DB — Migración inicial
-- ============================================================

-- Extensión UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tabla: users ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(80)  NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  role          VARCHAR(20)  NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: refresh_tokens ────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         SERIAL PRIMARY KEY,
  token      TEXT         NOT NULL UNIQUE,
  user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ  NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: media (galería) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          VARCHAR(200) NOT NULL,
  type           VARCHAR(10)  NOT NULL CHECK (type IN ('image', 'video')),
  category       VARCHAR(50)  NOT NULL DEFAULT 'General',
  url            TEXT         NOT NULL,
  thumbnail_url  TEXT,
  cloudinary_id  TEXT,
  uploaded_by    UUID         REFERENCES users(id) ON DELETE SET NULL,
  is_visible     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: comments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_id   UUID         NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  content    TEXT         NOT NULL,
  status     VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Tabla: ratings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ratings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_id   UUID         NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  stars      SMALLINT     NOT NULL CHECK (stars BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, media_id)
);

-- ── Índices para performance ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email           ON users(email);
CREATE INDEX IF NOT EXISTS idx_media_category        ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_is_visible      ON media(is_visible);
CREATE INDEX IF NOT EXISTS idx_comments_media_id     ON comments(media_id);
CREATE INDEX IF NOT EXISTS idx_comments_status       ON comments(status);
CREATE INDEX IF NOT EXISTS idx_ratings_media_id      ON ratings(media_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user   ON refresh_tokens(user_id);
