import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Get user from database
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user account is active
    if (user.subscriptionStatus === 'cancelled') {
      return res.status(403).json({ 
        message: 'Account cancelled',
        code: 'ACCOUNT_CANCELLED'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    res.status(500).json({ 
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Check subscription tier access
export const requireSubscription = (requiredTier) => {
  const tierLevels = {
    free: 0,
    pro: 1,
    premium: 2
  };

  return (req, res, next) => {
    const userTierLevel = tierLevels[req.user.subscriptionTier] || 0;
    const requiredTierLevel = tierLevels[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        message: `${requiredTier} subscription required`,
        code: 'SUBSCRIPTION_REQUIRED',
        currentTier: req.user.subscriptionTier,
        requiredTier
      });
    }

    next();
  };
};

// Check feature access
export const requireFeature = (feature) => {
  return (req, res, next) => {
    if (!req.user.canAccessFeature(feature)) {
      return res.status(403).json({
        message: `Feature '${feature}' not available in your subscription`,
        code: 'FEATURE_NOT_AVAILABLE',
        feature,
        subscriptionTier: req.user.subscriptionTier
      });
    }

    next();
  };
};

// Rate limiting per user
export const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    const userId = req.user.userId;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get user's request history
    let requests = userRequests.get(userId) || [];
    
    // Filter out old requests
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if user has exceeded limit
    if (requests.length >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        limit: maxRequests,
        windowMs,
        retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    requests.push(now);
    userRequests.set(userId, requests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance
      for (const [key, value] of userRequests.entries()) {
        const filteredRequests = value.filter(timestamp => timestamp > windowStart);
        if (filteredRequests.length === 0) {
          userRequests.delete(key);
        } else {
          userRequests.set(key, filteredRequests);
        }
      }
    }

    next();
  };
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      const user = await User.findOne({ userId: decoded.userId });
      
      if (user && user.subscriptionStatus !== 'cancelled') {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional auth failed:', error.message);
  }

  next();
};

// Admin access (for future admin features)
export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};
