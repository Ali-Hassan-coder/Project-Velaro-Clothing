const catchAsync = require('../utils/catchAsync');
const wishlistService = require('../services/wishlistService');

const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user._id);
  res.json({ success: true, data: { wishlist } });
});

const addToWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.addToWishlist(req.user._id, req.body.productId);
  res.status(201).json({ success: true, message: 'Added to wishlist.', data: { wishlist } });
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.removeFromWishlist(req.user._id, req.params.productId);
  res.json({ success: true, message: 'Removed from wishlist.', data: { wishlist } });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
