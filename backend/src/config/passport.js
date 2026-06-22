const passport      = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma }    = require('./database');
const logger        = require('./logger');

const CALLBACK_URL = process.env.NODE_ENV === 'production'
  ? 'https://forwardvision.cloud/api/auth/google/callback'
  : 'http://localhost/api/auth/google/callback';

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID     || 'PLACEHOLDER_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'PLACEHOLDER_CLIENT_SECRET',
    callbackURL:  CALLBACK_URL,
    scope: ['profile', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email    = profile.emails?.[0]?.value;
      const name     = profile.displayName;
      const googleId = profile.id;
      const avatar   = profile.photos?.[0]?.value;

      if (!email) {
        return done(new Error('No se obtuvo email desde Google'), null);
      }

      // 1. Buscar por googleId primero
      let user = await prisma.user.findUnique({ where: { googleId } });

      // 2. Si no, buscar por email (usuario ya registrado con email/password)
      if (!user) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          // Vincular cuenta Google al usuario existente
          user = await prisma.user.update({
            where: { id: existing.id },
            data:  { googleId, avatarUrl: avatar, provider: existing.provider === 'local' ? 'google' : existing.provider },
          });
          logger.info(`Cuenta Google vinculada al usuario existente: ${email}`);
        }
      }

      // 3. Crear nuevo usuario
      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            googleId,
            avatarUrl: avatar,
            provider:  'google',
            role:      'cliente',
          },
        });
        logger.info(`Nuevo usuario creado vía Google OAuth: ${email}`);
      }

      if (!user.isActive) {
        return done(new Error('Cuenta desactivada. Contacta al administrador.'), null);
      }

      // Update last login
      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

      return done(null, user);
    } catch (err) {
      logger.error('Google OAuth error:', err.message);
      return done(err, null);
    }
  }
));

// Passport no usa sesiones persistentes (JWT es stateless)
// pero necesitamos serialize/deserialize para el flujo OAuth
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
