import React, { useState } from 'react'
import Card from './ui/Card'
import { Settings, Check, Plus, ExternalLink, AlertCircle } from 'lucide-react'

const Integrations = () => {
  const [activeTab, setActiveTab] = useState('marketing')

  const marketingIntegrations = [
    {
      name: 'Google Ads',
      description: 'Track ad spend and conversions for accurate CAC calculation',
      status: 'connected',
      icon: '🔍',
      lastSync: '2 hours ago',
      data: { spend: '$5,200', conversions: '64' }
    },
    {
      name: 'Meta Ads (Facebook)',
      description: 'Import Facebook and Instagram advertising data',
      status: 'connected',
      icon: '📘',
      lastSync: '1 hour ago',
      data: { spend: '$3,800', conversions: '42' }
    },
    {
      name: 'LinkedIn Ads',
      description: 'B2B advertising data and lead generation metrics',
      status: 'disconnected',
      icon: '💼',
      lastSync: null,
      data: null
    },
    {
      name: 'Twitter Ads',
      description: 'Social media advertising performance tracking',
      status: 'available',
      icon: '🐦',
      lastSync: null,
      data: null
    }
  ]

  const paymentIntegrations = [
    {
      name: 'Stripe',
      description: 'Subscription billing and revenue tracking for MRR/LTV',
      status: 'connected',
      icon: '💳',
      lastSync: '30 minutes ago',
      data: { mrr: '$24,500', customers: '245' }
    },
    {
      name: 'PayPal',
      description: 'Alternative payment processing and transaction data',
      status: 'available',
      icon: '🅿️',
      lastSync: null,
      data: null
    },
    {
      name: 'Paddle',
      description: 'Merchant of record with built-in tax handling',
      status: 'available',
      icon: '🏓',
      lastSync: null,
      data: null
    }
  ]

  const analyticsIntegrations = [
    {
      name: 'Google Analytics',
      description: 'Website traffic and conversion funnel analysis',
      status: 'connected',
      icon: '📊',
      lastSync: '1 hour ago',
      data: { sessions: '12,450', conversions: '245' }
    },
    {
      name: 'Mixpanel',
      description: 'Product analytics and user behavior tracking',
      status: 'available',
      icon: '📈',
      lastSync: null,
      data: null
    },
    {
      name: 'Amplitude',
      description: 'Advanced product analytics and cohort analysis',
      status: 'available',
      icon: '📉',
      lastSync: null,
      data: null
    }
  ]

  const getIntegrations = () => {
    switch (activeTab) {
      case 'marketing':
        return marketingIntegrations
      case 'payments':
        return paymentIntegrations
      case 'analytics':
        return analyticsIntegrations
      default:
        return marketingIntegrations
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success border-success bg-green-50'
      case 'disconnected':
        return 'text-danger border-danger bg-red-50'
      case 'available':
        return 'text-text-secondary border-gray-200 bg-gray-50'
      default:
        return 'text-text-secondary border-gray-200 bg-gray-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Check className="h-4 w-4" />
      case 'disconnected':
        return <AlertCircle className="h-4 w-4" />
      case 'available':
        return <Plus className="h-4 w-4" />
      default:
        return <Plus className="h-4 w-4" />
    }
  }

  const handleConnect = (integration) => {
    console.log('Connecting to:', integration.name)
    // Here you would implement OAuth flow or API key setup
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Integrations</h1>
          <p className="text-text-secondary mt-1">Connect your tools to automate data collection</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            <Settings className="h-4 w-4" />
            <span>Integration Settings</span>
          </button>
        </div>
      </div>

      {/* Integration Categories */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'marketing', label: 'Marketing' },
          { id: 'payments', label: 'Payments' },
          { id: 'analytics', label: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getIntegrations().map((integration, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{integration.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{integration.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{integration.description}</p>
                  
                  {integration.status === 'connected' && integration.lastSync && (
                    <p className="text-xs text-text-secondary mt-2">
                      Last synced: {integration.lastSync}
                    </p>
                  )}
                  
                  {integration.data && (
                    <div className="mt-3 flex space-x-4">
                      {Object.entries(integration.data).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-text-secondary capitalize">{key}: </span>
                          <span className="font-medium text-text-primary">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)}
                  <span className="capitalize">{integration.status}</span>
                </span>
                
                {integration.status === 'connected' ? (
                  <div className="flex space-x-2">
                    <button className="p-1 text-text-secondary hover:text-text-primary transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-text-secondary hover:text-text-primary transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(integration)}
                    className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Connection Status Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Integration Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-2xl font-bold text-success">5</p>
            <p className="text-sm text-success">Connected</p>
          </div>
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-2xl font-bold text-danger">1</p>
            <p className="text-sm text-danger">Disconnected</p>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-2xl font-bold text-text-secondary">4</p>
            <p className="text-sm text-text-secondary">Available</p>
          </div>
        </div>
      </Card>

      {/* Quick Setup Guide */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Quick Setup Guide</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h4 className="font-medium text-text-primary">Connect Payment Processor</h4>
              <p className="text-sm text-text-secondary">Start with Stripe to track MRR and customer data automatically.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h4 className="font-medium text-text-primary">Add Marketing Platforms</h4>
              <p className="text-sm text-text-secondary">Connect Google Ads and Meta Ads for automatic CAC tracking.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h4 className="font-medium text-text-primary">Setup Analytics</h4>
              <p className="text-sm text-text-secondary">Link Google Analytics to understand your conversion funnel.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Integrations