import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Joi from 'joi';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  company: Joi.string().max(100).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  // Validate input
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const { email, password, firstName, lastName, company } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists with this email',
      code: 'USER_EXISTS'
    });
  }

  // Create user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    company,
    emailVerificationToken: crypto.randomBytes(32).toString('hex')
  });

  await user.save();

  // Generate token
  const token = generateToken(user.userId);

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      subscriptionTier: user.subscriptionTier,
      isEmailVerified: user.isEmailVerified
    }
  });
}));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  // Validate input
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const { email, password } = value;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user.userId);

  logger.info(`User logged in: ${email}`);

  res.json({
    message: 'Login successful',
    token,
    user: {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      subscriptionTier: user.subscriptionTier,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin
    }
  });
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  res.json({
    user: {
      userId: req.user.userId,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      company: req.user.company,
      subscriptionTier: req.user.subscriptionTier,
      subscriptionStatus: req.user.subscriptionStatus,
      isEmailVerified: req.user.isEmailVerified,
      lastLogin: req.user.lastLogin,
      preferences: req.user.preferences,
      createdAt: req.user.createdAt
    }
  });
}));

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const updateSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    company: Joi.string().max(100).optional(),
    preferences: Joi.object({
      currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD').optional(),
      timezone: Joi.string().optional(),
      notifications: Joi.object({
        email: Joi.boolean().optional(),
        dashboard: Joi.boolean().optional()
      }).optional()
    }).optional()
  });

  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  // Update user
  Object.keys(value).forEach(key => {
    if (key === 'preferences') {
      req.user.preferences = { ...req.user.preferences, ...value.preferences };
    } else {
      req.user[key] = value[key];
    }
  });

  await req.user.save();

  res.json({
    message: 'Profile updated successfully',
    user: req.user
  });
}));

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticateToken, asyncHandler(async (req, res) => {
  const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
  });

  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const { currentPassword, newPassword } = value;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      message: 'Current password is incorrect',
      code: 'INVALID_CURRENT_PASSWORD'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);

  res.json({
    message: 'Password changed successfully'
  });
}));

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const { email } = value;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await user.save();

  // TODO: Send email with reset link
  // For now, just log the token (in production, this should be sent via email)
  logger.info(`Password reset token for ${email}: ${resetToken}`);

  res.json({
    message: 'If an account with that email exists, a password reset link has been sent.',
    // TODO: Remove this in production
    ...(process.env.NODE_ENV === 'development' && { resetToken })
  });
}));

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const { token, password } = value;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      message: 'Invalid or expired reset token',
      code: 'INVALID_RESET_TOKEN'
    });
  }

  // Update password and clear reset token
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  logger.info(`Password reset successful for user: ${user.email}`);

  res.json({
    message: 'Password reset successful'
  });
}));

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // In a JWT implementation, logout is typically handled client-side
  // by removing the token. However, we can log the logout event.
  
  logger.info(`User logged out: ${req.user.email}`);

  res.json({
    message: 'Logout successful'
  });
}));

export default router;
