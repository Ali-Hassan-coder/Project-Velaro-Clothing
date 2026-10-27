const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
const register = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const result = await authService.registerUser({ firstName, lastName, email, password });

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: result,
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  res.json({
    success: true,
    message: 'Login successful.',
    data: result,
  });
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 */
const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.body);

  res.json({
    success: true,
    message: 'Profile updated.',
    data: { user },
  });
});

/**
 * @route   POST /api/auth/reset-admin
 * @desc    Reset or initialize admin credentials
 */
const resetAdmin = catchAsync(async (req, res) => {
  const { secretKey, email, newPassword } = req.body;
  const adminSecret = process.env.JWT_SECRET || 'velaro_clothing_jwt_secret_key_change_in_production_2026';
  
  if (!secretKey || secretKey !== adminSecret) {
    return res.status(403).json({ success: false, message: 'Invalid admin secret key.' });
  }

  const targetEmail = (email || 'admin@velaroclothing.com').toLowerCase().trim();
  const targetPassword = newPassword || 'admin123456';

  const User = require('../models/User');
  let user = await User.findOne({ where: { email: targetEmail } });

  if (user) {
    user.password = targetPassword;
    user.role = 'admin';
    user.isActive = true;
    await user.save();
  } else {
    user = await User.create({
      firstName: 'Velaro',
      lastName: 'Admin',
      email: targetEmail,
      password: targetPassword,
      role: 'admin',
      isActive: true,
    });
  }

  res.json({
    success: true,
    message: 'Admin account credentials updated successfully.',
    data: { email: targetEmail },
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  resetAdmin,
};
