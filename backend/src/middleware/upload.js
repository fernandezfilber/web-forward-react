const multer  = require('multer');
const cloudinaryModule = require('../config/cloudinary');

// Si Cloudinary no está configurado, usa memoria como fallback
const buildUpload = () => {
  if (!cloudinaryModule || !cloudinaryModule.isConfigured) {
    // Fallback: guarda en memoria (solo para dev sin Cloudinary)
    return multer({
      storage: multer.memoryStorage(),
      limits:  { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter,
    });
  }

  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  const autoStorage = new CloudinaryStorage({
    cloudinary: cloudinaryModule,
    params: async (req, file) => {
      const isVideo = file.mimetype.startsWith('video/');
      return {
        folder: `forward-vision/${isVideo ? 'videos' : 'gallery'}`,
        resource_type: isVideo ? 'video' : 'image',
        allowed_formats: isVideo
          ? ['mp4', 'mov', 'avi', 'webm']
          : ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: isVideo ? [] : [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }],
      };
    },
  });

  return multer({
    storage: autoStorage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  });
};

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/quicktime', 'video/avi', 'video/webm',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const uploadMedia = buildUpload();

module.exports = { uploadMedia };
