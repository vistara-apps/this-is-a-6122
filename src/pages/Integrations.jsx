import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { 
  Zap, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink,
  Settings,
  RefreshCw
} from 'lucide-react'

const integrations = [
  {
    name: 'Google Ads',
    description: 'Sync advertising spend and conversion data',
    status: 'connected',
    lastSync: '2 hours ago',
    category: 'Marketing',
    logo: '🟦',
    features: ['CAC Tracking', 'Conversion Data', 'Spend Analytics']
  },
  {
    name: 'Meta Ads',
    description: 'Facebook and Instagram advertising data',
    status: 'connected',
    lastSync: '1 hour ago',
    category: 'Marketing',
    logo: '🔵',
    features: ['CAC Tracking', 'Audience Insights', 'Campaign Performance']
  },
  {
    name: 'Stripe',
    description: 'Payment processing and subscription data',
    status: 'connected',
    lastSync: '30 minutes ago',
    category: 'Payments',
    logo: '💳',
    features: ['MRR Tracking', 'Customer Data', 'Churn Analysis']
  },
  {
    name: 'LinkedIn Ads',
    description: 'B2B advertising and lead generation',
    status: 'pending',
    lastSync: null,
    category: 'Marketing',
    logo: '🔗',
    features: ['B2B CAC', 'Lead Quality', 'Professional Targeting']
  },
  {
    name: 'QuickBooks',
    description: 'Expense tracking and financial management',
    status: 'available',
    lastSync: null,
    category: 'Finance',
    logo: '📊',
    features: ['Expense Tracking', 'Financial Reports', 'Tax Preparation']
  },
  {
    name: 'HubSpot',
    description: 'CRM and customer lifecycle tracking',
    status: 'available',
    lastSync: null,
    category: 'CRM',
    logo: '🎯',
    features: ['Customer Journey', 'LTV Analysis', 'Sales Pipeline']
  },
  {
    name: 'Salesforce',
    description: 'Enterprise CRM and sales analytics',
    status: 'available',
    lastSync: null,
    category: 'CRM',
    logo: '☁️',
    features: ['Advanced CRM', 'Sales Forecasting', 'Custom Reports']
  },
  {
    name: 'Xero',
    description: 'Cloud-based accounting software',
    status: 'available',
    lastSync: null,
    category: 'Finance',
    logo: '💰',
    features: ['Accounting', 'Invoice Tracking', 'Cash Flow']
  }
]

function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', 'Marketing', 'Payments', 'Finance', 'CRM']

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success'
      case 'pending': return 'text-warning'
      case 'error': return 'text-danger'
      default: return 'text-text-secondary'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <Check className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'error': return <X className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'pending': return 'Setup Required'
      case 'error': return 'Error'
      default: return 'Available'
    }
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Integrations</h1>
          <p className="mt-2 text-text-secondary">
            Connect your tools to automate financial tracking
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-text-secondary">
            {connectedCount} of {integrations.length} integrations connected
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{connectedCount}</div>
            <div className="text-sm text-text-secondary">Connected</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {integrations.filter(i => i.status === 'pending').length}
            </div>
            <div className="text-sm text-text-secondary">Pending Setup</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-text-secondary">
              {integrations.filter(i => i.status === 'available').length}
            </div>
            <div className="text-sm text-text-secondary">Available</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-text-secondary">Data Accuracy</div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.name} elevated className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="text-2xl mr-3">{integration.logo}</div>
                <div>
                  <h3 className="font-semibold text-text-primary">{integration.name}</h3>
                  <p className="text-xs text-text-secondary">{integration.category}</p>
                </div>
              </div>
              <div className={`flex items-center text-xs ${getStatusColor(integration.status)}`}>
                {getStatusIcon(integration.status)}
                <span className="ml-1">{getStatusText(integration.status)}</span>
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-4 flex-grow">
              {integration.description}
            </p>

            <div className="mb-4">
              <div className="text-xs font-medium text-text-secondary mb-2">Features:</div>
              <div className="flex flex-wrap gap-1">
                {integration.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-gray-100 text-xs rounded text-text-secondary"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {integration.lastSync && (
              <div className="text-xs text-text-secondary mb-4">
                Last sync: {integration.lastSync}
              </div>
            )}

            <div className="flex gap-2 mt-auto">
              {integration.status === 'connected' ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </>
              ) : integration.status === 'pending' ? (
                <Button size="sm" className="flex-1">
                  Complete Setup
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1">
                  <Zap className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Integration Benefits */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Why Connect Your Tools?</h3>
          <p className="text-sm text-text-secondary">
            Automating data collection saves time and improves accuracy
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">Automated Data Sync</h4>
            <p className="text-sm text-text-secondary">
              No more manual data entry. Your metrics update automatically.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Check className="h-6 w-6 text-success" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">Improved Accuracy</h4>
            <p className="text-sm text-text-secondary">
              Eliminate human error with direct API connections.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">Real-time Insights</h4>
            <p className="text-sm text-text-secondary">
              Get up-to-date metrics as soon as data changes.
            </p>
          </div>
        </div>
      </Card>

      {/* API Documentation */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Developer Resources</h3>
          <p className="text-sm text-text-secondary">
            Need a custom integration? Check out our API documentation
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            API Documentation
          </Button>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Developer Guide
          </Button>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Support
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Integrations
