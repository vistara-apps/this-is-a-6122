import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due'],
    default: 'active'
  },
  subscriptionStartDate: {
    type: Date
  },
  subscriptionEndDate: {
    type: Date
  },
  stripeCustomerId: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      dashboard: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });
userSchema.index({ subscriptionTier: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get user's subscription limits
userSchema.methods.getSubscriptionLimits = function() {
  const limits = {
    free: {
      integrations: 2,
      dataRetention: 30, // days
      apiCalls: 1000, // per month
      features: ['basic_tracking', 'simple_projections']
    },
    pro: {
      integrations: 5,
      dataRetention: 365, // days
      apiCalls: 10000, // per month
      features: ['basic_tracking', 'simple_projections', 'ltv_prediction', 'advanced_analytics']
    },
    premium: {
      integrations: -1, // unlimited
      dataRetention: -1, // unlimited
      apiCalls: -1, // unlimited
      features: ['all']
    }
  };
  
  return limits[this.subscriptionTier] || limits.free;
};

// Check if user can access feature
userSchema.methods.canAccessFeature = function(feature) {
  const limits = this.getSubscriptionLimits();
  return limits.features.includes('all') || limits.features.includes(feature);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Transform output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
