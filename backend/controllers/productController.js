const catchAsync = require('../utils/catchAsync');
const productService = require('../services/productService');

/**
 * @route   GET /api/products
 * @desc    Get all products (with filters, search, pagination)
 */
const getProducts = catchAsync(async (req, res) => {
  const result = await productService.getProducts(req.query);

  res.json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products for homepage
 */
const getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.query.limit);

  res.json({
    success: true,
    data: { products },
  });
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID or slug
 */
const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductByIdOrSlug(req.params.id);

  res.json({
    success: true,
    data: { product },
  });
});

/**
 * @route   POST /api/products
 * @desc    Create a new product (admin only)
 */
const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created.',
    data: { product },
  });
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product (admin only)
 */
const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.json({
    success: true,
    message: 'Product updated.',
    data: { product },
  });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Soft-delete a product (admin only)
 */
const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.json({
    success: true,
    message: 'Product deleted.',
  });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
