import mongoose from 'mongoose';

const marketingPlatformIntegrationSchema = new mongoose.Schema({
  integrationId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  platformName: {
    type: String,
    required: true,
    enum: [
      'google_ads',
      'meta_ads',
      'linkedin_ads',
      'stripe',
      'paypal',
      'shopify',
      'woocommerce',
      'hubspot',
      'salesforce',
      'mailchimp',
      'sendgrid'
    ]
  },
  displayName: {
    type: String,
    required: true
  },
  // Encrypted API credentials
  credentials: {
    apiKey: {
      type: String,
      select: false // Don't include in queries by default
    },
    apiSecret: {
      type: String,
      select: false
    },
    accessToken: {
      type: String,
      select: false
    },
    refreshToken: {
      type: String,
      select: false
    },
    accountId: {
      type: String
    },
    customerId: {
      type: String
    }
  },
  // OAuth specific fields
  oauthData: {
    authorizationCode: {
      type: String,
      select: false
    },
    scope: {
      type: [String]
    },
    tokenType: {
      type: String,
      default: 'Bearer'
    },
    expiresAt: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error', 'pending', 'expired'],
    default: 'pending'
  },
  lastSync: {
    type: Date
  },
  lastSyncStatus: {
    type: String,
    enum: ['success', 'error', 'partial'],
    default: 'success'
  },
  syncErrors: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    error: {
      type: String
    },
    details: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  // Sync configuration
  syncConfig: {
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    autoSync: {
      type: Boolean,
      default: true
    },
    dataTypes: [{
      type: String,
      enum: ['campaigns', 'ad_groups', 'ads', 'keywords', 'conversions', 'spend', 'impressions', 'clicks']
    }],
    dateRange: {
      type: Number,
      default: 30 // days
    }
  },
  // Platform specific settings
  platformSettings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Metrics and performance
  metrics: {
    totalDataPoints: {
      type: Number,
      default: 0
    },
    lastDataPoint: {
      type: Date
    },
    avgSyncTime: {
      type: Number, // in milliseconds
      default: 0
    },
    successRate: {
      type: Number, // percentage
      default: 100
    }
  },
  // Rate limiting
  rateLimits: {
    requestsPerHour: {
      type: Number,
      default: 1000
    },
    requestsUsed: {
      type: Number,
      default: 0
    },
    resetTime: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes
marketingPlatformIntegrationSchema.index({ userId: 1, platformName: 1 });
marketingPlatformIntegrationSchema.index({ userId: 1, isActive: 1 });
marketingPlatformIntegrationSchema.index({ lastSync: 1 });
marketingPlatformIntegrationSchema.index({ status: 1 });

// Virtual for connection health
marketingPlatformIntegrationSchema.virtual('connectionHealth').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.status === 'error') return 'unhealthy';
  if (this.status === 'expired') return 'expired';
  
  const daysSinceLastSync = this.lastSync 
    ? Math.floor((Date.now() - this.lastSync.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  if (daysSinceLastSync === null) return 'never_synced';
  if (daysSinceLastSync > 7) return 'stale';
  if (daysSinceLastSync > 2) return 'warning';
  
  return 'healthy';
});

// Instance methods
marketingPlatformIntegrationSchema.methods.updateSyncStatus = function(status, error = null) {
  this.lastSync = new Date();
  this.lastSyncStatus = status;
  
  if (error) {
    this.syncErrors.push({
      timestamp: new Date(),
      error: error.message || error,
      details: error.details || {}
    });
    
    // Keep only last 10 errors
    if (this.syncErrors.length > 10) {
      this.syncErrors = this.syncErrors.slice(-10);
    }
    
    // Update success rate
    const totalSyncs = this.metrics.totalDataPoints || 1;
    const errorCount = this.syncErrors.length;
    this.metrics.successRate = Math.max(0, ((totalSyncs - errorCount) / totalSyncs) * 100);
  }
  
  return this.save();
};

marketingPlatformIntegrationSchema.methods.isTokenExpired = function() {
  if (!this.oauthData.expiresAt) return false;
  return new Date() >= this.oauthData.expiresAt;
};

marketingPlatformIntegrationSchema.methods.canSync = function() {
  if (!this.isActive || this.status === 'error') return false;
  if (this.isTokenExpired()) return false;
  
  // Check rate limits
  if (this.rateLimits.resetTime && new Date() < this.rateLimits.resetTime) {
    return this.rateLimits.requestsUsed < this.rateLimits.requestsPerHour;
  }
  
  return true;
};

marketingPlatformIntegrationSchema.methods.incrementRateLimit = function() {
  const now = new Date();
  
  // Reset if hour has passed
  if (!this.rateLimits.resetTime || now >= this.rateLimits.resetTime) {
    this.rateLimits.requestsUsed = 1;
    this.rateLimits.resetTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
  } else {
    this.rateLimits.requestsUsed += 1;
  }
  
  return this.save();
};

// Static methods
marketingPlatformIntegrationSchema.statics.getActiveIntegrations = function(userId) {
  return this.find({
    userId,
    isActive: true,
    status: { $in: ['connected', 'pending'] }
  }).select('-credentials -oauthData');
};

marketingPlatformIntegrationSchema.statics.getIntegrationsByPlatform = function(platformName) {
  return this.find({
    platformName,
    isActive: true,
    status: 'connected'
  }).select('-credentials -oauthData');
};

// Pre-save middleware
marketingPlatformIntegrationSchema.pre('save', function(next) {
  // Update status based on token expiration
  if (this.isTokenExpired()) {
    this.status = 'expired';
  }
  
  next();
});

// Transform output to hide sensitive data
marketingPlatformIntegrationSchema.methods.toJSON = function() {
  const integration = this.toObject();
  delete integration.credentials;
  delete integration.oauthData;
  return integration;
};

const MarketingPlatformIntegration = mongoose.model('MarketingPlatformIntegration', marketingPlatformIntegrationSchema);

export default MarketingPlatformIntegration;
