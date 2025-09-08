import express from 'express';
import Joi from 'joi';
import FinancialData from '../models/FinancialData.js';
import MarketingPlatformIntegration from '../models/MarketingPlatformIntegration.js';
import { authenticateToken, requireFeature } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
router.get('/overview', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Get current month's data
  const currentMetrics = await Promise.all([
    // Current MRR
    FinancialData.findOne({
      userId,
      metricType: 'mrr',
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 }),

    // Current CAC
    FinancialData.getCAC(userId, thirtyDaysAgo, now),

    // Current LTV
    FinancialData.findOne({
      userId,
      metricType: 'ltv',
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 }),

    // Current Burn Rate
    FinancialData.getBurnRate(userId, thirtyDaysAgo, now)
  ]);

  // Get previous month's data for comparison
  const previousMetrics = await Promise.all([
    // Previous MRR
    FinancialData.findOne({
      userId,
      metricType: 'mrr',
      date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    }).sort({ date: -1 }),

    // Previous CAC
    FinancialData.getCAC(userId, sixtyDaysAgo, thirtyDaysAgo),

    // Previous LTV
    FinancialData.findOne({
      userId,
      metricType: 'ltv',
      date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    }).sort({ date: -1 }),

    // Previous Burn Rate
    FinancialData.getBurnRate(userId, sixtyDaysAgo, thirtyDaysAgo)
  ]);

  // Calculate percentage changes
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const currentMRR = currentMetrics[0]?.value || 0;
  const previousMRR = previousMetrics[0]?.value || 0;

  const currentCAC = currentMetrics[1]?.avgCAC || 0;
  const previousCAC = previousMetrics[1]?.avgCAC || 0;

  const currentLTV = currentMetrics[2]?.value || 0;
  const previousLTV = previousMetrics[2]?.value || 0;

  const currentBurnRate = currentMetrics[3]?.[0]?.avgBurnRate || 0;
  const previousBurnRate = previousMetrics[3]?.[0]?.avgBurnRate || 0;

  // Get active integrations
  const integrations = await MarketingPlatformIntegration.getActiveIntegrations(userId);

  // Calculate runway (months)
  const runway = currentBurnRate > 0 ? Math.floor(currentMRR / currentBurnRate) : null;

  res.json({
    metrics: {
      mrr: {
        current: currentMRR,
        change: calculateChange(currentMRR, previousMRR),
        currency: req.user.preferences.currency
      },
      cac: {
        current: currentCAC,
        change: calculateChange(currentCAC, previousCAC),
        currency: req.user.preferences.currency
      },
      ltv: {
        current: currentLTV,
        change: calculateChange(currentLTV, previousLTV),
        currency: req.user.preferences.currency
      },
      burnRate: {
        current: currentBurnRate,
        change: calculateChange(currentBurnRate, previousBurnRate),
        currency: req.user.preferences.currency
      },
      runway: {
        months: runway,
        status: runway ? (runway < 6 ? 'critical' : runway < 12 ? 'warning' : 'healthy') : null
      }
    },
    integrations: {
      total: integrations.length,
      connected: integrations.filter(i => i.status === 'connected').length,
      health: integrations.map(i => ({
        name: i.displayName,
        status: i.status,
        lastSync: i.lastSync,
        health: i.connectionHealth
      }))
    },
    lastUpdated: now
  });
}));

// @desc    Get MRR trend data
// @route   GET /api/dashboard/mrr-trend
// @access  Private
router.get('/mrr-trend', authenticateToken, asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const userId = req.user.userId;

  const mrrTrend = await FinancialData.getMRRTrend(userId, parseInt(months));

  // Fill in missing months with zero values
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - parseInt(months));

  const filledData = [];
  for (let i = 0; i < parseInt(months); i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    const existingData = mrrTrend.find(item => 
      item._id.year === date.getFullYear() && 
      item._id.month === date.getMonth() + 1
    );

    filledData.push({
      date: date.toISOString().slice(0, 7), // YYYY-MM format
      totalMRR: existingData?.totalMRR || 0,
      newMRR: existingData?.newMRR || 0,
      expansionMRR: existingData?.expansionMRR || 0,
      contractionMRR: existingData?.contractionMRR || 0,
      churnedMRR: existingData?.churnedMRR || 0
    });
  }

  res.json({
    data: filledData,
    currency: req.user.preferences.currency
  });
}));

// @desc    Get CAC by channel
// @route   GET /api/dashboard/cac-by-channel
// @access  Private
router.get('/cac-by-channel', authenticateToken, asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const userId = req.user.userId;
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - parseInt(days) * 24 * 60 * 60 * 1000);

  const cacByChannel = await FinancialData.aggregate([
    {
      $match: {
        userId,
        metricType: 'cac',
        date: { $gte: startDate, $lte: endDate },
        sourceChannel: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$sourceChannel',
        avgCAC: { $avg: '$value' },
        totalSpend: { $sum: '$adSpend' },
        totalConversions: { $sum: '$conversions' },
        dataPoints: { $sum: 1 }
      }
    },
    {
      $sort: { avgCAC: 1 }
    }
  ]);

  res.json({
    data: cacByChannel.map(item => ({
      channel: item._id,
      avgCAC: item.avgCAC,
      totalSpend: item.totalSpend,
      totalConversions: item.totalConversions,
      dataPoints: item.dataPoints
    })),
    currency: req.user.preferences.currency,
    period: `${days} days`
  });
}));

// @desc    Get LTV segments
// @route   GET /api/dashboard/ltv-segments
// @access  Private
router.get('/ltv-segments', authenticateToken, requireFeature('ltv_prediction'), asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const ltvSegments = await FinancialData.getLTVBySegment(userId);

  res.json({
    data: ltvSegments.map(segment => ({
      segment: segment._id,
      avgLTV: segment.avgLTV,
      predictedLTV: segment.predictedLTV,
      customerCount: segment.count
    })),
    currency: req.user.preferences.currency
  });
}));

// @desc    Get revenue projections
// @route   POST /api/dashboard/revenue-projections
// @access  Private
router.post('/revenue-projections', authenticateToken, asyncHandler(async (req, res) => {
  const projectionSchema = Joi.object({
    currentMRR: Joi.number().min(0).required(),
    growthRate: Joi.number().min(-100).max(1000).required(), // Monthly growth rate percentage
    churnRate: Joi.number().min(0).max(100).required(), // Monthly churn rate percentage
    months: Joi.number().min(1).max(36).default(12)
  });

  const { error, value } = projectionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const { currentMRR, growthRate, churnRate, months } = value;

  // Calculate projections
  const projections = [];
  let projectedMRR = currentMRR;

  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() + i);

    // Apply growth and churn
    const growth = projectedMRR * (growthRate / 100);
    const churn = projectedMRR * (churnRate / 100);
    projectedMRR = projectedMRR + growth - churn;

    projections.push({
      month: date.toISOString().slice(0, 7),
      projectedMRR: Math.max(0, projectedMRR),
      growth,
      churn
    });
  }

  res.json({
    projections,
    assumptions: {
      currentMRR,
      monthlyGrowthRate: growthRate,
      monthlyChurnRate: churnRate
    },
    currency: req.user.preferences.currency
  });
}));

// @desc    Get burn rate analysis
// @route   GET /api/dashboard/burn-rate-analysis
// @access  Private
router.get('/burn-rate-analysis', authenticateToken, asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;
  const userId = req.user.userId;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - parseInt(months));

  // Get monthly burn rate data
  const burnRateData = await FinancialData.aggregate([
    {
      $match: {
        userId,
        metricType: 'burn_rate',
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        avgBurnRate: { $avg: '$value' },
        totalBurn: { $sum: '$value' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Get current cash position (if available)
  const currentCash = await FinancialData.findOne({
    userId,
    metricType: 'cash',
    date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  }).sort({ date: -1 });

  // Calculate runway
  const latestBurnRate = burnRateData[burnRateData.length - 1]?.avgBurnRate || 0;
  const cashPosition = currentCash?.value || 0;
  const runway = latestBurnRate > 0 ? Math.floor(cashPosition / latestBurnRate) : null;

  res.json({
    burnRateHistory: burnRateData.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      avgBurnRate: item.avgBurnRate,
      totalBurn: item.totalBurn
    })),
    currentBurnRate: latestBurnRate,
    cashPosition,
    runway: {
      months: runway,
      status: runway ? (runway < 6 ? 'critical' : runway < 12 ? 'warning' : 'healthy') : null
    },
    currency: req.user.preferences.currency
  });
}));

// @desc    Get quick stats for dashboard cards
// @route   GET /api/dashboard/quick-stats
// @access  Private
router.get('/quick-stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get recent data points count
  const recentDataPoints = await FinancialData.countDocuments({
    userId,
    date: { $gte: sevenDaysAgo }
  });

  // Get total integrations
  const totalIntegrations = await MarketingPlatformIntegration.countDocuments({
    userId,
    isActive: true
  });

  // Get connected integrations
  const connectedIntegrations = await MarketingPlatformIntegration.countDocuments({
    userId,
    isActive: true,
    status: 'connected'
  });

  // Get last sync time
  const lastSync = await MarketingPlatformIntegration.findOne({
    userId,
    isActive: true,
    lastSync: { $exists: true }
  }).sort({ lastSync: -1 });

  res.json({
    recentDataPoints,
    integrations: {
      total: totalIntegrations,
      connected: connectedIntegrations,
      lastSync: lastSync?.lastSync
    },
    subscriptionTier: req.user.subscriptionTier,
    subscriptionLimits: req.user.getSubscriptionLimits()
  });
}));

export default router;
