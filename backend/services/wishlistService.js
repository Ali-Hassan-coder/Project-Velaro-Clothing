const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

/**
 * Format populated wishlist
 */
const formatWishlist = async (wishlist) => {
  const json = wishlist.toJSON();
  const productItems = [];

  for (const item of json.products || []) {
    const prod = await Product.findByPk(item.productId, {
      include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }],
    });
    if (prod) {
      productItems.push({
        product: prod.toJSON(),
        addedAt: item.addedAt,
      });
    }
  }

  json.products = productItems;
  return json;
};

/**
 * Get user's wishlist
 */
const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ where: { userId } });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [] });
  }

  return formatWishlist(wishlist);
};

/**
 * Add product to wishlist
 */
const addToWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ where: { userId } });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      products: [{ productId, addedAt: new Date() }],
    });
  } else {
    const currentProducts = [...(wishlist.products || [])];
    const exists = currentProducts.some((item) => item.productId === productId);

    if (exists) {
      throw new AppError('Product already in wishlist.', 400);
    }

    currentProducts.push({ productId, addedAt: new Date() });
    await wishlist.update({ products: currentProducts });
  }

  return formatWishlist(wishlist);
};

/**
 * Remove product from wishlist
 */
const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ where: { userId } });

  if (!wishlist) {
    throw new AppError('Wishlist not found.', 404);
  }

  const updatedProducts = (wishlist.products || []).filter(
    (item) => item.productId !== productId
  );

  await wishlist.update({ products: updatedProducts });
  return formatWishlist(wishlist);
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
