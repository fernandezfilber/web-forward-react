const router = require('express').Router();
const { getStats, listUsers, updateUser, deleteUser, listAllMedia } = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/media', listAllMedia);

module.exports = router;
