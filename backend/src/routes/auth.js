const router    = require('express').Router();
const jwt       = require('jsonwebtoken');
const { body }  = require('express-validator');
const passport  = require('passport');

const { register, login, refresh, logout, me, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { authenticate }  = require('../middleware/auth');
const { loginLimiter }  = require('../middleware/rateLimit');
const { saveRefreshToken } = require('../config/redis');
const logger = require('../config/logger');

const validateRegister = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Nombre debe tener 2-80 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe contener una mayúscula')
    .matches(/[0-9]/).withMessage('Debe contener un número'),
];

// ── Email / Password ──────────────────────────────────────────
router.post('/register', validateRegister, register);
router.post('/login',    loginLimiter,     login);
router.post('/refresh',  refresh);
router.post('/logout',   logout);
router.get('/me',        authenticate, me);
router.put('/profile',   authenticate, updateProfile);

// ── Password Reset ────────────────────────────────────────────
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ── Google OAuth ──────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: true })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_failed', session: true }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generar JWT
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      await saveRefreshToken(user.id, refreshToken);
      req.logout((err) => { if (err) logger.warn('Passport logout error:', err.message); });

      const userPayload = encodeURIComponent(JSON.stringify({
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        avatarUrl: user.avatarUrl,
      }));

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost';
      res.redirect(
        `${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}&user=${userPayload}`
      );
    } catch (err) {
      logger.error('Google callback error:', err.message);
      res.redirect('/login?error=oauth_error');
    }
  }
);

module.exports = router;
