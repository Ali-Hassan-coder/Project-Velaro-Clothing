const express = require('express');
const router = express.Router();
const { getDashboardStats, getAdminProducts, getSettings, updateSetting } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

// Public route to fetch settings (hero banner etc for homepage)
router.get('/settings/public', getSettings);

// All admin routes below require auth + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/products', getAdminProducts);
router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);

module.exports = router;

