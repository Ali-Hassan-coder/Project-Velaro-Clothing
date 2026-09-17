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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
