const router = require('express').Router();
const { listMedia, uploadMedia, updateMedia, deleteMedia, getCategories } = require('../controllers/mediaController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { uploadMedia: uploadMiddleware } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimit');

router.get('/', listMedia);
router.get('/categories', getCategories);
router.post('/', authenticate, requireAdmin, uploadLimiter, uploadMiddleware.single('file'), uploadMedia);
router.put('/:id', authenticate, requireAdmin, updateMedia);
router.delete('/:id', authenticate, requireAdmin, deleteMedia);

module.exports = router;
