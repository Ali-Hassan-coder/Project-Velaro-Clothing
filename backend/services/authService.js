const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

/**
 * Register a new user
 */
const registerUser = async ({ firstName, lastName, email, password }) => {
  const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 400);
  }

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase().trim(),
    password,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login user with email and password
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account has been deactivated. Contact support.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Get user profile
 */
const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'avatar', 'addresses', 'measurements'];
  const filteredData = {};
  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  await user.update(filteredData);
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
