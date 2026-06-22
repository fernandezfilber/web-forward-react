const { prisma } = require('../config/database');
const { cacheGet, cacheSet } = require('../config/redis');

/** GET /api/admin/stats */
async function getStats(req, res) {
  const cached = await cacheGet('admin:stats');
  if (cached) return res.json(cached);

  try {
    const [
      totalClients,
      totalMedia,
      totalApprovedComments,
      pendingComments,
      avgRatingAgg,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'cliente' } }),
      prisma.media.count({ where: { isVisible: true } }),
      prisma.comment.count({ where: { status: 'approved' } }),
      prisma.comment.count({ where: { status: 'pending' } }),
      prisma.rating.aggregate({ _avg: { stars: true } }),
    ]);

    const stats = {
      totalClients,
      totalMedia,
      totalApprovedComments,
      pendingComments,
      avgRating: parseFloat((avgRatingAgg._avg.stars || 0).toFixed(1)),
    };

    await cacheSet('admin:stats', stats, 60);
    res.json(stats);
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
}

/** GET /api/admin/users */
async function listUsers(req, res) {
  const { page = '1', limit = '20', role, search } = req.query;
  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const where = {
    ...(role ? { role } : {}),
    ...(search ? {
      OR: [
        { name:  { contains: search } },
        { email: { contains: search } },
      ],
    } : {}),
  };

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, role: true,
          phone: true, isActive: true, createdAt: true, lastLogin: true,
          _count: { select: { comments: true, ratings: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar usuarios' });
  }
}

/** PUT /api/admin/users/:id */
async function updateUser(req, res) {
  const { id } = req.params;
  const { role, isActive, name } = req.body;

  if (id === req.user.id && role && role !== 'admin') {
    return res.status(400).json({ error: 'No puedes cambiar tu propio rol de admin' });
  }

  try {
    const user = await prisma.user.update({
      where:  { id },
      data:   { role, isActive, name },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    res.json({ user });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

/** DELETE /api/admin/users/:id */
async function deleteUser(req, res) {
  const { id } = req.params;
  if (id === req.user.id) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}

/** GET /api/admin/media */
async function listAllMedia(req, res) {
  const { page = '1', limit = '20' } = req.query;
  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  try {
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: { select: { name: true } },
          ratings:    { select: { stars: true } },
          _count:     { select: { comments: true } },
        },
      }),
      prisma.media.count(),
    ]);

    const formatted = items.map(m => ({
      ...m,
      uploadedByName: m.uploadedBy?.name,
      avgRating:      m.ratings.length
        ? parseFloat((m.ratings.reduce((s, r) => s + r.stars, 0) / m.ratings.length).toFixed(1))
        : 0,
      totalComments: m._count.comments,
    }));

    res.json({ items: formatted, total, page: parseInt(page), limit: take });
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar medios' });
  }
}

module.exports = { getStats, listUsers, updateUser, deleteUser, listAllMedia };
