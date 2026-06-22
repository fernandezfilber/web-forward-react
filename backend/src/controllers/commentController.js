const { prisma } = require('../config/database');
const { cacheInvalidate } = require('../config/redis');
const { sendCommentNotification, sendCommentApprovedEmail } = require('../config/mailer');
const logger = require('../config/logger');

/** GET /api/comments */
async function listComments(req, res) {
  const { media_id, status, page = '1', limit = '20' } = req.query;
  const take    = parseInt(limit);
  const skip    = (parseInt(page) - 1) * take;
  const isAdmin = req.user?.role === 'admin';

  const where = {
    ...(media_id ? { mediaId: media_id } : {}),
    ...(isAdmin && status ? { status } : { status: 'approved' }),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user:  { select: { name: true, avatarUrl: true } },
          media: { select: { id: true, title: true } },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    const formatted = await Promise.all(items.map(async c => {
      const rating = await prisma.rating.findUnique({
        where:  { userId_mediaId: { userId: c.userId, mediaId: c.mediaId } },
        select: { stars: true },
      });
      return {
        id:         c.id,
        content:    c.content,
        status:     c.status,
        createdAt:  c.createdAt,
        mediaId:    c.mediaId,
        mediaTitle: c.media?.title,
        authorName: c.user?.name || 'Anónimo',
        authorAvatar: c.user?.avatarUrl,
        stars:      rating?.stars || null,
      };
    }));

    res.json({ items: formatted, total, page: parseInt(page), limit: take });
  } catch (err) {
    logger.error('listComments error:', err.message);
    res.status(500).json({ error: 'Error al cargar comentarios' });
  }
}

/** POST /api/comments */
async function createComment(req, res) {
  const { media_id, content, stars } = req.body;
  const userId = req.user.id;

  if (!media_id || !content) return res.status(400).json({ error: 'media_id y content requeridos' });
  if (content.length > 1000)  return res.status(400).json({ error: 'Máximo 1000 caracteres' });

  try {
    const media = await prisma.media.findUnique({ where: { id: media_id } });
    if (!media) return res.status(404).json({ error: 'Media no encontrada' });

    if (stars && stars >= 1 && stars <= 5) {
      await prisma.rating.upsert({
        where:  { userId_mediaId: { userId, mediaId: media_id } },
        update: { stars: Math.round(stars) },
        create: { userId, mediaId: media_id, stars: Math.round(stars) },
      });
    }

    const comment = await prisma.comment.create({
      data:   { userId, mediaId: media_id, content, status: 'approved' },
      select: { id: true, content: true, status: true, createdAt: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: { userId, action: 'create_comment', detail: `Media: ${media.title}`, ip: req.ip },
    }).catch(() => {});

    await cacheInvalidate('comments:*');
    await cacheInvalidate('media:*');

    // Notificar al admin por email
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    await sendCommentNotification({
      authorName: user?.name || 'Usuario',
      content,
      mediaTitle: media.title,
      stars: stars || null,
    });

    res.status(201).json({
      comment,
      message: '¡Gracias! Tu comentario ha sido publicado exitosamente.',
    });
  } catch (err) {
    logger.error('createComment error:', err.message);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
}

/** PUT /api/comments/:id/approve */
async function approveComment(req, res) {
  try {
    const comment = await prisma.comment.update({
      where:   { id: req.params.id },
      data:    { status: 'approved' },
      include: { user: { select: { email: true, name: true } }, media: { select: { title: true } } },
    });
    await cacheInvalidate('comments:*');

    // Email al cliente
    await sendCommentApprovedEmail({
      toEmail:    comment.user.email,
      toName:     comment.user.name,
      mediaTitle: comment.media.title,
    });

    await prisma.activityLog.create({
      data: { userId: req.user.id, action: 'approve_comment', detail: `CommentId: ${req.params.id}`, ip: req.ip },
    }).catch(() => {});

    res.json({ comment });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Comentario no encontrado' });
    res.status(500).json({ error: 'Error al aprobar' });
  }
}

/** PUT /api/comments/:id/reject */
async function rejectComment(req, res) {
  try {
    const comment = await prisma.comment.update({
      where: { id: req.params.id },
      data:  { status: 'rejected' },
    });
    await cacheInvalidate('comments:*');
    res.json({ comment });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Comentario no encontrado' });
    res.status(500).json({ error: 'Error al rechazar' });
  }
}

/** DELETE /api/comments/:id */
async function deleteComment(req, res) {
  try {
    await prisma.comment.delete({ where: { id: req.params.id } });
    await cacheInvalidate('comments:*');
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Comentario no encontrado' });
    res.status(500).json({ error: 'Error al eliminar' });
  }
}

module.exports = { listComments, createComment, approveComment, rejectComment, deleteComment };
