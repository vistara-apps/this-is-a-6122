import express from 'express';
import Joi from 'joi';
import MarketingPlatformIntegration from '../models/MarketingPlatformIntegration.js';
import { authenticateToken, requireSubscription } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get all user integrations
// @route   GET /api/integrations
// @access  Private
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const integrations = await MarketingPlatformIntegration.find({
    userId: req.user.userId
  }).select('-credentials -oauthData');

  res.json({
    integrations,
    limits: req.user.getSubscriptionLimits()
  });
}));

// @desc    Create new integration
// @route   POST /api/integrations
// @access  Private
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const integrationSchema = Joi.object({
    platformName: Joi.string().valid(
      'google_ads', 'meta_ads', 'linkedin_ads', 'stripe', 'paypal'
    ).required(),
    displayName: Joi.string().required(),
    credentials: Joi.object({
      apiKey: Joi.string().optional(),
      apiSecret: Joi.string().optional(),
      accessToken: Joi.string().optional(),
      accountId: Joi.string().optional()
    }).optional()
  });

  const { error, value } = integrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  // Check subscription limits
  const existingIntegrations = await MarketingPlatformIntegration.countDocuments({
    userId: req.user.userId,
    isActive: true
  });

  const limits = req.user.getSubscriptionLimits();
  if (limits.integrations !== -1 && existingIntegrations >= limits.integrations) {
    return res.status(403).json({
      message: 'Integration limit reached for your subscription tier',
      currentCount: existingIntegrations,
      limit: limits.integrations
    });
  }

  const integration = new MarketingPlatformIntegration({
    ...value,
    userId: req.user.userId,
    status: 'pending'
  });

  await integration.save();

  logger.info(`New integration created: ${value.platformName} for user ${req.user.email}`);

  res.status(201).json({
    message: 'Integration created successfully',
    integration
  });
}));

// @desc    Update integration
// @route   PUT /api/integrations/:id
// @access  Private
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const updateSchema = Joi.object({
    displayName: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    syncConfig: Joi.object({
      frequency: Joi.string().valid('hourly', 'daily', 'weekly').optional(),
      autoSync: Joi.boolean().optional(),
      dataTypes: Joi.array().items(Joi.string()).optional()
    }).optional()
  });

  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const integration = await MarketingPlatformIntegration.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    value,
    { new: true, runValidators: true }
  ).select('-credentials -oauthData');

  if (!integration) {
    return res.status(404).json({
      message: 'Integration not found'
    });
  }

  res.json({
    message: 'Integration updated successfully',
    integration
  });
}));

// @desc    Delete integration
// @route   DELETE /api/integrations/:id
// @access  Private
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const integration = await MarketingPlatformIntegration.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!integration) {
    return res.status(404).json({
      message: 'Integration not found'
    });
  }

  logger.info(`Integration deleted: ${integration.platformName} for user ${req.user.email}`);

  res.json({
    message: 'Integration deleted successfully'
  });
}));

// @desc    Test integration connection
// @route   POST /api/integrations/:id/test
// @access  Private
router.post('/:id/test', authenticateToken, asyncHandler(async (req, res) => {
  const integration = await MarketingPlatformIntegration.findOne({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!integration) {
    return res.status(404).json({
      message: 'Integration not found'
    });
  }

  // Mock connection test - in production, this would test actual API connections
  const isConnected = Math.random() > 0.2; // 80% success rate for demo

  if (isConnected) {
    integration.status = 'connected';
    integration.lastSync = new Date();
    await integration.save();

    res.json({
      message: 'Connection test successful',
      status: 'connected'
    });
  } else {
    integration.status = 'error';
    await integration.save();

    res.status(400).json({
      message: 'Connection test failed',
      status: 'error'
    });
  }
}));

// @desc    Trigger manual sync
// @route   POST /api/integrations/:id/sync
// @access  Private
router.post('/:id/sync', authenticateToken, asyncHandler(async (req, res) => {
  const integration = await MarketingPlatformIntegration.findOne({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!integration) {
    return res.status(404).json({
      message: 'Integration not found'
    });
  }

  if (!integration.canSync()) {
    return res.status(400).json({
      message: 'Integration cannot sync at this time',
      reason: integration.isTokenExpired() ? 'Token expired' : 'Rate limit exceeded'
    });
  }

  // Mock sync process - in production, this would trigger actual data sync
  integration.lastSync = new Date();
  integration.lastSyncStatus = 'success';
  await integration.save();

  logger.info(`Manual sync triggered for ${integration.platformName} by user ${req.user.email}`);

  res.json({
    message: 'Sync triggered successfully',
    lastSync: integration.lastSync
  });
}));

export default router;
