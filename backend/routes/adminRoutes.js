const express = require('express');
const router = express.Router();
const { getDashboardStats, getAdminProducts } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/products', getAdminProducts);

module.exports = router;
