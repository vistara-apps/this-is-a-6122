import express from 'express';
import Joi from 'joi';
import FinancialData from '../models/FinancialData.js';
import { authenticateToken, requireFeature } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Validation schema for financial data
const financialDataSchema = Joi.object({
  metricType: Joi.string().valid(
    'cac', 'ltv', 'mrr', 'arr', 'churn_rate', 'burn_rate', 
    'revenue', 'expenses', 'ad_spend', 'conversions', 'customers', 'subscriptions'
  ).required(),
  value: Joi.number().required(),
  date: Joi.date().required(),
  sourceChannel: Joi.string().optional(),
  adSpend: Joi.number().optional(),
  conversions: Joi.number().optional(),
  customerSegment: Joi.string().optional(),
  metadata: Joi.object().optional()
});

// @desc    Create financial data entry
// @route   POST /api/financial-data
// @access  Private
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { error, value } = financialDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const financialData = new FinancialData({
    ...value,
    userId: req.user.userId
  });

  await financialData.save();

  res.status(201).json({
    message: 'Financial data created successfully',
    data: financialData
  });
}));

// @desc    Get financial data
// @route   GET /api/financial-data
// @access  Private
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const { 
    metricType, 
    startDate, 
    endDate, 
    sourceChannel,
    page = 1,
    limit = 50
  } = req.query;

  const query = { userId: req.user.userId };
  
  if (metricType) query.metricType = metricType;
  if (sourceChannel) query.sourceChannel = sourceChannel;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [data, total] = await Promise.all([
    FinancialData.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    FinancialData.countDocuments(query)
  ]);

  res.json({
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// @desc    Update financial data entry
// @route   PUT /api/financial-data/:id
// @access  Private
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { error, value } = financialDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }

  const financialData = await FinancialData.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    value,
    { new: true, runValidators: true }
  );

  if (!financialData) {
    return res.status(404).json({
      message: 'Financial data not found'
    });
  }

  res.json({
    message: 'Financial data updated successfully',
    data: financialData
  });
}));

// @desc    Delete financial data entry
// @route   DELETE /api/financial-data/:id
// @access  Private
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const financialData = await FinancialData.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!financialData) {
    return res.status(404).json({
      message: 'Financial data not found'
    });
  }

  res.json({
    message: 'Financial data deleted successfully'
  });
}));

export default router;
