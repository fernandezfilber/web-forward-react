const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Valores que NO son credenciales reales
const PLACEHOLDERS = ['tu_cloud_name_aqui', 'tu_api_key_aqui', 'tu_api_secret_aqui', '', undefined, null];

const isConfigured =
  !PLACEHOLDERS.includes(CLOUD_NAME) &&
  !PLACEHOLDERS.includes(API_KEY) &&
  !PLACEHOLDERS.includes(API_SECRET);

if (isConfigured) {
  cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });
  logger.info('☁️  Cloudinary configurado correctamente');
} else {
  logger.warn('⚠️  Cloudinary NO configurado — subida de archivos deshabilitada.');
}

// Siempre exporta el objeto cloudinary + flag isConfigured
cloudinary.isConfigured = isConfigured;
module.exports = cloudinary;
