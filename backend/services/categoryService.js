const Category = require('../models/Category');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

/**
 * Get all active categories (sorted by displayOrder)
 */
const getCategories = async () => {
  const categories = await Category.find({ isActive: true })
    .sort('displayOrder')
    .lean();

  // Attach product count
  for (const cat of categories) {
    cat.productCount = await Product.countDocuments({ category: cat._id, isActive: true });
  }

  return categories;
};

/**
 * Get a single category by slug or ID
 */
const getCategoryBySlug = async (slug) => {
  let category = await Category.findOne({ slug, isActive: true }).lean();

  if (!category) {
    category = await Category.findOne({ _id: slug, isActive: true }).lean();
  }

  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  category.productCount = await Product.countDocuments({
    category: category._id,
    isActive: true,
  });

  return category;
};

/**
 * Create a new category (admin)
 */
const createCategory = async (categoryData) => {
  return Category.create(categoryData);
};

/**
 * Update a category (admin)
 */
const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  return category;
};

/**
 * Delete a category (admin) — soft delete
 */
const deleteCategory = async (categoryId) => {
  const productCount = await Product.countDocuments({ category: categoryId, isActive: true });
  if (productCount > 0) {
    throw new AppError(
      `Cannot delete category with ${productCount} active products. Reassign products first.`,
      400
    );
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isActive: false },
    { new: true }
  );

  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  return category;
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
