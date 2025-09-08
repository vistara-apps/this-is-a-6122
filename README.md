# ProfitPilot

Navigate your startup's financials with clarity and foresight.

## Overview

ProfitPilot is a comprehensive web application designed for solo founders to easily track key financial metrics like CAC (Customer Acquisition Cost), LTV (Lifetime Value), MRR (Monthly Recurring Revenue), and burn rate for better business management.

## Features

### Core Features
- **Automated CAC Tracking**: Connects to marketing platforms (Google Ads, Meta Ads) to automatically calculate Customer Acquisition Cost per channel
- **LTV Prediction & Segmentation**: Analyzes customer data to predict Lifetime Value and segment users for targeted retention strategies
- **Simple Revenue Projection**: Forecasts Monthly Recurring Revenue based on current metrics and growth projections
- **Burn Rate Calculator**: Tracks expenses and projects company runway

### Technical Features
- **Real-time Dashboard**: Interactive charts and metrics visualization
- **API Integrations**: Connects with Google Ads, Meta Ads, Stripe, and other platforms
- **Subscription Management**: Tiered access (Free, Pro, Premium)
- **Secure Authentication**: JWT-based authentication with password reset
- **Data Export**: Export financial data and reports

## Tech Stack

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Joi** for validation
- **Winston** for logging
- **Helmet** for security

### Integrations
- **Google Ads API** for advertising data
- **Meta Ads API** for Facebook/Instagram ads
- **Stripe API** for payment and subscription data

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd profitpilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - MongoDB connection string
   - JWT secret
   - API keys for integrations
   - Email configuration

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   
   **Development mode (both frontend and backend):**
   ```bash
   npm run dev
   ```
   
   **Or run separately:**
   ```bash
   # Backend only
   npm run dev:server
   
   # Frontend only  
   npm run dev:client
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Dashboard Endpoints
- `GET /api/dashboard/overview` - Dashboard overview metrics
- `GET /api/dashboard/mrr-trend` - MRR trend data
- `GET /api/dashboard/cac-by-channel` - CAC breakdown by channel
- `GET /api/dashboard/ltv-segments` - LTV customer segments
- `POST /api/dashboard/revenue-projections` - Generate revenue projections

### Financial Data Endpoints
- `GET /api/financial-data` - Get financial data with filters
- `POST /api/financial-data` - Create financial data entry
- `PUT /api/financial-data/:id` - Update financial data
- `DELETE /api/financial-data/:id` - Delete financial data

### Integration Endpoints
- `GET /api/integrations` - Get user integrations
- `POST /api/integrations` - Create new integration
- `PUT /api/integrations/:id` - Update integration
- `DELETE /api/integrations/:id` - Delete integration
- `POST /api/integrations/:id/test` - Test integration connection
- `POST /api/integrations/:id/sync` - Trigger manual sync

## Subscription Tiers

### Free Tier
- 2 integrations
- 30 days data retention
- 1,000 API calls/month
- Basic tracking and simple projections

### Pro Tier ($19/month)
- 5 integrations
- 365 days data retention
- 10,000 API calls/month
- LTV prediction and advanced analytics

### Premium Tier ($49/month)
- Unlimited integrations
- Unlimited data retention
- Unlimited API calls
- All features + priority support

## Data Models

### User
- Basic profile information
- Subscription tier and status
- Preferences (currency, timezone, notifications)
- Authentication data

### FinancialData
- Metric type (CAC, LTV, MRR, etc.)
- Value and currency
- Date and source channel
- Metadata for additional context

### MarketingPlatformIntegration
- Platform connection details
- OAuth and API credentials (encrypted)
- Sync configuration and status
- Rate limiting and health monitoring

## Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** with Joi schemas
- **CORS Protection** for cross-origin requests
- **Helmet.js** for security headers
- **API Key Encryption** for integration credentials

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── utils/             # Server utilities
└── public/                # Static assets
```

### Available Scripts
- `npm run dev` - Start both frontend and backend in development
- `npm run dev:client` - Start frontend only
- `npm run dev:server` - Start backend only
- `npm run build` - Build for production
- `npm start` - Start production server

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all required environment variables are set in production:
- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection
- `JWT_SECRET` - Strong JWT secret
- API keys for integrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact: support@profitpilot.com

---

Built with ❤️ for solo founders who want to understand their business metrics.
