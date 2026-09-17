const catchAsync = require('../utils/catchAsync');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const productService = require('../services/productService');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard stats
 */
const getDashboardStats = catchAsync(async (req, res) => {
  const [totalProducts, totalCategories, totalUsers, totalOrders, recentOrders] =
    await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.find()
        .sort('-createdAt')
        .limit(5)
        .populate('user', 'firstName lastName email')
        .lean(),
    ]);

  // Revenue from paid orders
  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
  ]);
  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // Products per category
  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$price' } } },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    { $project: { name: '$category.name', count: 1, totalValue: 1 } },
    { $sort: { count: -1 } },
  ]);

  // Low stock alert (products with total stock <= 4)
  const lowStockProducts = await Product.find({
    isActive: true,
    totalStock: { $lte: 4, $gt: 0 },
  })
    .select('name sku totalStock')
    .limit(10)
    .lean();

  res.json({
    success: true,
    data: {
      stats: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalOrders,
        totalRevenue,
      },
      categoryStats,
      lowStockProducts,
      recentOrders,
    },
  });
});

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (admin view — includes inactive)
 */
const getAdminProducts = catchAsync(async (req, res) => {
  const result = await productService.getAllProductsAdmin(req.query);
  res.json({ success: true, data: result });
});

module.exports = { getDashboardStats, getAdminProducts };
