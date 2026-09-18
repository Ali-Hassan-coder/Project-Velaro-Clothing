const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

/**
 * Get all products with filtering, sorting, pagination
 */
const getProducts = async (queryParams) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    minPrice,
    maxPrice,
    sort = '-createdAt',
    material,
    isFeatured,
  } = queryParams;

  const where = { isActive: true };

  // Category filter
  if (category) {
    // If slug provided or UUID
    const matchedCategory = await Category.findOne({
      where: {
        [Op.or]: [{ id: category }, { slug: category }],
      },
    });
    if (matchedCategory) {
      where.categoryId = matchedCategory.id;
    }
  }

  // Search filter
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { material: { [Op.iLike]: `%${search}%` } },
      { materialTag: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Price range filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }

  // Material filter
  if (material) {
    where.material = { [Op.iLike]: `%${material}%` };
  }

  // Featured filter
  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured === 'true' || isFeatured === true;
  }

  // Determine order
  let order = [['createdAt', 'DESC']];
  if (sort) {
    if (sort === 'price') order = [['price', 'ASC']];
    else if (sort === '-price') order = [['price', 'DESC']];
    else if (sort === 'createdAt') order = [['createdAt', 'ASC']];
    else if (sort === '-createdAt') order = [['createdAt', 'DESC']];
    else if (sort === 'rating') order = [['rating', 'DESC']];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { count: total, rows: products } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    order,
    offset,
    limit: Number(limit),
  });

  return {
    products: products.map((p) => p.toJSON()),
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total,
      hasMore: offset + products.length < total,
    },
  };
};

/**
 * Get a single product by ID or slug
 */
const getProductByIdOrSlug = async (identifier) => {
  let product = await Product.findOne({
    where: { slug: identifier, isActive: true },
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
  });

  if (!product) {
    try {
      product = await Product.findOne({
        where: { id: identifier, isActive: true },
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      });
    } catch {
      // not UUID
    }
  }

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  return product.toJSON();
};

/**
 * Create a new product (admin)
 */
const createProduct = async (productData) => {
  if (productData.category && !productData.categoryId) {
    productData.categoryId = productData.category;
  }
  const product = await Product.create(productData);
  const reloaded = await Product.findByPk(product.id, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
  });
  return reloaded.toJSON();
};

/**
 * Update a product (admin)
 */
const updateProduct = async (productId, updateData) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (updateData.category && !updateData.categoryId) {
    updateData.categoryId = updateData.category;
  }

  await product.update(updateData);
  const reloaded = await Product.findByPk(productId, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
  });
  return reloaded.toJSON();
};

/**
 * Delete a product (admin) — soft delete
 */
const deleteProduct = async (productId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  await product.update({ isActive: false });
  return product.toJSON();
};

/**
 * Get featured products for homepage
 */
const getFeaturedProducts = async (limit = 8) => {
  const products = await Product.findAll({
    where: { isActive: true, isFeatured: true },
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
  });
  return products.map((p) => p.toJSON());
};

/**
 * Get all products (admin — includes inactive)
 */
const getAllProductsAdmin = async (queryParams) => {
  const { page = 1, limit = 20, category, search } = queryParams;
  const where = {};

  if (category) {
    where.categoryId = category;
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { sku: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { count: total, rows: products } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    order: [['createdAt', 'DESC']],
    offset,
    limit: Number(limit),
  });

  return {
    products: products.map((p) => p.toJSON()),
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total,
    },
  };
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getAllProductsAdmin,
};
