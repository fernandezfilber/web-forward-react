const { prisma }    = require('../config/database');
const cloudinaryModule = require('../config/cloudinary');
const { cacheGet, cacheSet, cacheInvalidate } = require('../config/redis');
const logger = require('../config/logger');

const CACHE_TTL = 300; // 5 minutes

/** GET /api/media */
async function listMedia(req, res) {
  const { category, type, page = '1', limit = '20' } = req.query;
  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const cacheKey = `media:${category || 'all'}:${type || 'all'}:p${page}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);

  const where = {
    isVisible: true,
    ...(category && category !== 'Todos' ? { category } : {}),
    ...(type ? { type } : {}),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: { select: { name: true } },
          ratings:    { select: { stars: true } },
          _count:     { select: { comments: true } },
        },
      }),
      prisma.media.count({ where }),
    ]);

    const formatted = items.map(m => ({
      id:            m.id,
      title:         m.title,
      type:          m.type,
      category:      m.category,
      url:           m.url,
      thumbnailUrl:  m.thumbnailUrl,
      createdAt:     m.createdAt,
      uploadedBy:    m.uploadedBy?.name || null,
      avgRating:     m.ratings.length
        ? parseFloat((m.ratings.reduce((s, r) => s + r.stars, 0) / m.ratings.length).toFixed(1))
        : 0,
      ratingCount:   m.ratings.length,
      commentCount:  m._count.comments,
    }));

    const result = { items: formatted, total, page: parseInt(page), limit: take };
    await cacheSet(cacheKey, result, CACHE_TTL);
    res.json(result);
  } catch (err) {
    console.error('listMedia error:', err);
    res.status(500).json({ error: 'Error al cargar la galería' });
  }
}

/** POST /api/media — Admin upload */
async function uploadMedia(req, res) {
  const { title, category } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No se proporcionó archivo' });

  // Bloquear upload si Cloudinary no está configurado
  if (!cloudinaryModule || !cloudinaryModule.isConfigured) {
    return res.status(503).json({
      error: 'Subida de archivos deshabilitada. Configura las credenciales de Cloudinary en el .env para habilitar esta función.',
    });
  }

  try {
    const mediaType    = file.mimetype.startsWith('video/') ? 'video' : 'image';
    const url          = file.path || file.secure_url;
    const cloudinaryId = file.filename || file.public_id;
    let thumbnailUrl   = null;

    if (mediaType === 'video') {
      thumbnailUrl = url.replace('/upload/', '/upload/so_0,w_800,f_jpg/').replace(/\.[^/.]+$/, '.jpg');
    }

    const media = await prisma.media.create({
      data: {
        title,
        type:        mediaType,
        category:    category || 'General',
        url,
        thumbnailUrl,
        cloudinaryId,
        uploadedById: req.user.id,
      },
    });

    await cacheInvalidate('media:*');
    res.status(201).json({ media });
  } catch (err) {
    logger.error('uploadMedia error:', err.message);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
}

/** PUT /api/media/:id — Admin edit */
async function updateMedia(req, res) {
  const { id } = req.params;
  const { title, category, isVisible } = req.body;
  try {
    const media = await prisma.media.update({
      where: { id },
      data:  { title, category, isVisible },
    });
    await cacheInvalidate('media:*');
    res.json({ media });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Media no encontrada' });
    res.status(500).json({ error: 'Error al actualizar' });
  }
}

/** DELETE /api/media/:id — Admin delete */
async function deleteMedia(req, res) {
  const { id } = req.params;
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return res.status(404).json({ error: 'Media no encontrada' });

    // Solo intentar borrar en Cloudinary si está configurado
    if (media.cloudinaryId && cloudinaryModule?.isConfigured) {
      const resourceType = media.type === 'video' ? 'video' : 'image';
      await cloudinaryModule.uploader.destroy(media.cloudinaryId, { resource_type: resourceType });
    }

    await prisma.media.delete({ where: { id } });
    await cacheInvalidate('media:*');
    res.json({ message: 'Media eliminada correctamente' });
  } catch (err) {
    logger.error('deleteMedia error:', err.message);
    res.status(500).json({ error: 'Error al eliminar' });
  }
}

/** GET /api/media/categories */
async function getCategories(req, res) {
  const cached = await cacheGet('media:categories');
  if (cached) return res.json(cached);

  const categories = await prisma.media.findMany({
    where:    { isVisible: true },
    select:   { category: true },
    distinct: ['category'],
    orderBy:  { category: 'asc' },
  });
  const result = { categories: ['Todos', ...categories.map(c => c.category)] };
  await cacheSet('media:categories', result, 600);
  res.json(result);
}

module.exports = { listMedia, uploadMedia, updateMedia, deleteMedia, getCategories };
