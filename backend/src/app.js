const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const { createClient } = require('ioredis');
require('dotenv').config();

const logger = require('./config/logger');
const passport = require('./config/passport');
const { connectDB, disconnectDB } = require('./config/database');
const { redis } = require('./config/redis');

const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://forwardvision.cloud',
  'https://www.forwardvision.cloud',
  'http://localhost',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fv_session_secret_cambiar',
  resave: false, saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 5 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => { logger.info(`${req.method} ${req.path}`); next(); });
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', async (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message || 'Error interno' }));

async function start() {
  try {
    await redis.connect().catch(() => {});
    await connectDB();
    app.listen(PORT, () => logger.info(`Backend corriendo en puerto ${PORT}`));
  } catch (err) { 
    console.error('❌ Error fatal al iniciar:', err);
    process.exit(1); 
  }
}
start();
module.exports = app;
