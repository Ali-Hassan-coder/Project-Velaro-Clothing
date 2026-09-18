const catchAsync = require('../utils/catchAsync');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const productService = require('../services/productService');
const { Op } = require('sequelize');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard stats
 */
const getDashboardStats = catchAsync(async (req, res) => {
  const [totalProducts, totalCategories, totalUsers, totalOrders, recentOrders] =
    await Promise.all([
      Product.count({ where: { isActive: true } }),
      Category.count({ where: { isActive: true } }),
      User.count({ where: { isActive: true } }),
      Order.count(),
      Order.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }],
      }),
    ]);

  const totalRevenue = (await Order.sum('totalAmount', { where: { paymentStatus: 'paid' } })) || 0;

  // Products per category
  const categories = await Category.findAll({
    where: { isActive: true },
    include: [{ model: Product, as: 'products', where: { isActive: true }, required: false }],
  });

  const categoryStats = categories.map((cat) => {
    const prods = cat.products || [];
    const totalVal = prods.reduce((sum, p) => sum + (p.price || 0), 0);
    return {
      name: cat.name,
      count: prods.length,
      totalValue: totalVal,
    };
  });

  // Low stock alert (products with total stock <= 4)
  const lowStockProducts = await Product.findAll({
    where: {
      isActive: true,
      totalStock: { [Op.lte]: 4, [Op.gt]: 0 },
    },
    attributes: ['id', 'name', 'sku', 'totalStock'],
    limit: 10,
  });

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
      lowStockProducts: lowStockProducts.map((p) => p.toJSON()),
      recentOrders: recentOrders.map((o) => o.toJSON()),
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
