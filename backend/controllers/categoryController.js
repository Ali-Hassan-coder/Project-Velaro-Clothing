const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/categoryService');

/**
 * @route   GET /api/categories
 */
const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.json({ success: true, data: { categories } });
});

/**
 * @route   GET /api/categories/:slug
 */
const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.json({ success: true, data: { category } });
});

/**
 * @route   POST /api/categories (admin)
 */
const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, message: 'Category created.', data: { category } });
});

/**
 * @route   PUT /api/categories/:id (admin)
 */
const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json({ success: true, message: 'Category updated.', data: { category } });
});

/**
 * @route   DELETE /api/categories/:id (admin)
 */
const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.json({ success: true, message: 'Category deleted.' });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
