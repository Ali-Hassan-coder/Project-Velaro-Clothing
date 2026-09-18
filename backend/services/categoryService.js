const Category = require('../models/Category');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

/**
 * Get all active categories (sorted by displayOrder)
 */
const getCategories = async () => {
  const categories = await Category.findAll({
    where: { isActive: true },
    order: [['displayOrder', 'ASC']],
  });

  const categoriesJson = await Promise.all(
    categories.map(async (cat) => {
      const json = cat.toJSON();
      json.productCount = await Product.count({
        where: { categoryId: cat.id, isActive: true },
      });
      return json;
    })
  );

  return categoriesJson;
};

/**
 * Get a single category by slug or ID
 */
const getCategoryBySlug = async (slug) => {
  let category = await Category.findOne({ where: { slug, isActive: true } });

  if (!category) {
    // If not found by slug, try by ID if it's a UUID
    try {
      category = await Category.findOne({ where: { id: slug, isActive: true } });
    } catch {
      // not a valid UUID format
    }
  }

  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  const categoryJson = category.toJSON();
  categoryJson.productCount = await Product.count({
    where: { categoryId: category.id, isActive: true },
  });

  return categoryJson;
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
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  await category.update(updateData);
  return category;
};

/**
 * Delete a category (admin) — soft delete
 */
const deleteCategory = async (categoryId) => {
  const productCount = await Product.count({
    where: { categoryId, isActive: true },
  });

  if (productCount > 0) {
    throw new AppError(
      `Cannot delete category with ${productCount} active products. Reassign products first.`,
      400
    );
  }

  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  await category.update({ isActive: false });
  return category;
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
