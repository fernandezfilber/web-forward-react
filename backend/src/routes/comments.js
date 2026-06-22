const router = require('express').Router();
const { listComments, createComment, approveComment, rejectComment, deleteComment } = require('../controllers/commentController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
};

router.get('/',                   optionalAuth, listComments);
router.post('/',                  authenticate, apiLimiter, createComment);
router.put('/:id/approve',        authenticate, requireAdmin, approveComment);
router.put('/:id/reject',         authenticate, requireAdmin, rejectComment);
router.delete('/:id',             authenticate, requireAdmin, deleteComment);

module.exports = router;
