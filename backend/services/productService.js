const Product = require('../models/Product');
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
    badges,
    sizes,
  } = queryParams;

  const filter = { isActive: true };

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Search filter (text search)
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { material: { $regex: search, $options: 'i' } },
      { materialTag: { $regex: search, $options: 'i' } },
    ];
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Material filter
  if (material) {
    filter.material = { $regex: material, $options: 'i' };
  }

  // Featured filter
  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured === 'true';
  }

  // Badge filter
  if (badges) {
    filter.badges = { $in: badges.split(',') };
  }

  // Size availability filter
  if (sizes) {
    filter['sizes.label'] = { $in: sizes.split(',') };
    filter['sizes.inStock'] = { $gt: 0 };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total,
      hasMore: skip + products.length < total,
    },
  };
};

/**
 * Get a single product by ID or slug
 */
const getProductByIdOrSlug = async (identifier) => {
  let product;

  // Try finding by slug first, then by ID
  product = await Product.findOne({ slug: identifier, isActive: true })
    .populate('category', 'name slug');

  if (!product) {
    product = await Product.findOne({ _id: identifier, isActive: true })
      .populate('category', 'name slug');
  }

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  return product;
};

/**
 * Create a new product (admin)
 */
const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product.populate('category', 'name slug');
};

/**
 * Update a product (admin)
 */
const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  return product;
};

/**
 * Delete a product (admin) — soft delete
 */
const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  return product;
};

/**
 * Get featured products for homepage
 */
const getFeaturedProducts = async (limit = 8) => {
  return Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(Number(limit))
    .lean();
};

/**
 * Get all products (admin — includes inactive)
 */
const getAllProductsAdmin = async (queryParams) => {
  const { page = 1, limit = 20, category, search } = queryParams;
  const filter = {};

  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
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
