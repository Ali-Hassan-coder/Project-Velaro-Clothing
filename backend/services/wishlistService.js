const Wishlist = require('../models/Wishlist');
const AppError = require('../utils/AppError');

/**
 * Get user's wishlist
 */
const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId })
    .populate({
      path: 'products.product',
      select: 'name slug price compareAtPrice images rating numReviews badges material sizes',
      populate: { path: 'category', select: 'name slug' },
    });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  return wishlist;
};

/**
 * Add product to wishlist
 */
const addToWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [{ product: productId }],
    });
  } else {
    // Check if product already in wishlist
    const exists = wishlist.products.some(
      (item) => item.product.toString() === productId
    );

    if (exists) {
      throw new AppError('Product already in wishlist.', 400);
    }

    wishlist.products.push({ product: productId });
    await wishlist.save();
  }

  return wishlist.populate({
    path: 'products.product',
    select: 'name slug price images rating badges',
    populate: { path: 'category', select: 'name slug' },
  });
};

/**
 * Remove product from wishlist
 */
const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new AppError('Wishlist not found.', 404);
  }

  wishlist.products = wishlist.products.filter(
    (item) => item.product.toString() !== productId
  );

  await wishlist.save();

  return wishlist.populate({
    path: 'products.product',
    select: 'name slug price images rating badges',
    populate: { path: 'category', select: 'name slug' },
  });
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
