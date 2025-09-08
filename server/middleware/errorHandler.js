import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.userId
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404, code: 'RESOURCE_NOT_FOUND' };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400, code: 'DUPLICATE_FIELD' };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400, code: 'VALIDATION_ERROR' };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401, code: 'INVALID_TOKEN' };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401, code: 'TOKEN_EXPIRED' };
  }

  // API integration errors
  if (err.name === 'GoogleAdsError') {
    const message = 'Google Ads API error';
    error = { message, statusCode: 502, code: 'GOOGLE_ADS_ERROR', details: err.details };
  }

  if (err.name === 'MetaAdsError') {
    const message = 'Meta Ads API error';
    error = { message, statusCode: 502, code: 'META_ADS_ERROR', details: err.details };
  }

  if (err.name === 'StripeError') {
    const message = 'Stripe API error';
    error = { message, statusCode: 502, code: 'STRIPE_ERROR', details: err.details };
  }

  // Rate limiting errors
  if (err.name === 'RateLimitError') {
    const message = 'Rate limit exceeded';
    error = { message, statusCode: 429, code: 'RATE_LIMIT_EXCEEDED' };
  }

  // Database connection errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    const message = 'Database error';
    error = { message, statusCode: 500, code: 'DATABASE_ERROR' };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      ...(error.details && { details: error.details })
    }
  });
};

// Async error handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
