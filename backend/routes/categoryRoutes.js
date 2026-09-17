const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const { categoryRules, validate } = require('../middlewares/validationMiddleware');

// Public
router.get('/', getCategories);
router.get('/:slug', getCategory);

// Admin
router.post('/', protect, adminOnly, categoryRules, validate, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
