import mongoose from 'mongoose';

const financialDataSchema = new mongoose.Schema({
  dataId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  metricType: {
    type: String,
    required: true,
    enum: [
      'cac', // Customer Acquisition Cost
      'ltv', // Lifetime Value
      'mrr', // Monthly Recurring Revenue
      'arr', // Annual Recurring Revenue
      'churn_rate',
      'burn_rate',
      'revenue',
      'expenses',
      'ad_spend',
      'conversions',
      'customers',
      'subscriptions'
    ],
    index: true
  },
  value: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  sourceChannel: {
    type: String,
    enum: [
      'google_ads',
      'meta_ads',
      'linkedin_ads',
      'stripe',
      'manual',
      'organic',
      'referral',
      'direct',
      'email',
      'social',
      'other'
    ]
  },
  sourceIntegrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketingPlatformIntegration'
  },
  metadata: {
    // Flexible field for storing additional data specific to each metric type
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // CAC specific fields
  adSpend: {
    type: Number
  },
  conversions: {
    type: Number
  },
  impressions: {
    type: Number
  },
  clicks: {
    type: Number
  },
  // LTV specific fields
  customerSegment: {
    type: String,
    enum: ['high_value', 'medium_value', 'low_value', 'new', 'churned']
  },
  predictedLTV: {
    type: Number
  },
  actualLTV: {
    type: Number
  },
  // MRR specific fields
  newMRR: {
    type: Number
  },
  expansionMRR: {
    type: Number
  },
  contractionMRR: {
    type: Number
  },
  churnedMRR: {
    type: Number
  },
  // Subscription specific fields
  planType: {
    type: String
  },
  subscriptionCount: {
    type: Number
  },
  // Validation and quality flags
  isValidated: {
    type: Boolean,
    default: false
  },
  validationNotes: {
    type: String
  },
  dataQuality: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
financialDataSchema.index({ userId: 1, date: -1 });
financialDataSchema.index({ userId: 1, metricType: 1, date: -1 });
financialDataSchema.index({ userId: 1, sourceChannel: 1, date: -1 });
financialDataSchema.index({ date: -1, metricType: 1 });

// Static methods for aggregations
financialDataSchema.statics.getCAC = async function(userId, startDate, endDate, channel = null) {
  const matchStage = {
    userId,
    metricType: 'cac',
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (channel) {
    matchStage.sourceChannel = channel;
  }
  
  const result = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: channel ? '$sourceChannel' : null,
        totalSpend: { $sum: '$adSpend' },
        totalConversions: { $sum: '$conversions' },
        avgCAC: { $avg: '$value' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result[0] || { totalSpend: 0, totalConversions: 0, avgCAC: 0, count: 0 };
};

financialDataSchema.statics.getMRRTrend = async function(userId, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    {
      $match: {
        userId,
        metricType: 'mrr',
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        totalMRR: { $sum: '$value' },
        newMRR: { $sum: '$newMRR' },
        expansionMRR: { $sum: '$expansionMRR' },
        contractionMRR: { $sum: '$contractionMRR' },
        churnedMRR: { $sum: '$churnedMRR' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
};

financialDataSchema.statics.getLTVBySegment = async function(userId) {
  return this.aggregate([
    {
      $match: {
        userId,
        metricType: 'ltv',
        customerSegment: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$customerSegment',
        avgLTV: { $avg: '$value' },
        predictedLTV: { $avg: '$predictedLTV' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { avgLTV: -1 }
    }
  ]);
};

financialDataSchema.statics.getBurnRate = async function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId,
        metricType: 'burn_rate',
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        avgBurnRate: { $avg: '$value' },
        totalBurn: { $sum: '$value' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
financialDataSchema.methods.calculateCAC = function() {
  if (this.adSpend && this.conversions && this.conversions > 0) {
    this.value = this.adSpend / this.conversions;
  }
  return this.value;
};

financialDataSchema.methods.validateData = function() {
  const errors = [];
  
  // Basic validation rules
  if (this.value < 0) {
    errors.push('Value cannot be negative');
  }
  
  // CAC specific validation
  if (this.metricType === 'cac') {
    if (this.adSpend && this.adSpend < 0) {
      errors.push('Ad spend cannot be negative');
    }
    if (this.conversions && this.conversions < 0) {
      errors.push('Conversions cannot be negative');
    }
  }
  
  // MRR specific validation
  if (this.metricType === 'mrr') {
    if (this.value < 0) {
      errors.push('MRR cannot be negative');
    }
  }
  
  this.isValidated = errors.length === 0;
  this.validationNotes = errors.join('; ');
  
  return errors;
};

// Pre-save middleware
financialDataSchema.pre('save', function(next) {
  // Auto-calculate CAC if ad spend and conversions are provided
  if (this.metricType === 'cac' && this.adSpend && this.conversions) {
    this.calculateCAC();
  }
  
  // Validate data
  this.validateData();
  
  next();
});

const FinancialData = mongoose.model('FinancialData', financialDataSchema);

export default FinancialData;
