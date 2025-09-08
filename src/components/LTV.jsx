import React, { useState } from 'react'
import Card from './ui/Card'
import StatDisplay from './ui/StatDisplay'
import Chart from './ui/Chart'
import { Users, Target, TrendingUp } from 'lucide-react'

const LTV = () => {
  const [selectedSegment, setSelectedSegment] = useState('all')

  const segments = [
    { 
      name: 'High Value', 
      count: 85, 
      avgLTV: 2400, 
      churnRate: 3.2, 
      color: '#059669',
      description: 'Enterprise customers with high engagement'
    },
    { 
      name: 'Mid Value', 
      count: 156, 
      avgLTV: 1200, 
      churnRate: 5.8, 
      color: '#2563eb',
      description: 'Growing businesses with steady usage'
    },
    { 
      name: 'Low Value', 
      count: 203, 
      avgLTV: 450, 
      churnRate: 12.3, 
      color: '#dc2626',
      description: 'Small businesses or trial users'
    }
  ]

  const cohortData = [
    { month: 'Month 1', highValue: 100, midValue: 100, lowValue: 100 },
    { month: 'Month 3', highValue: 95, midValue: 88, lowValue: 75 },
    { month: 'Month 6', highValue: 92, midValue: 78, lowValue: 55 },
    { month: 'Month 12', highValue: 87, midValue: 65, lowValue: 35 },
    { month: 'Month 18', highValue: 83, midValue: 58, lowValue: 25 },
    { month: 'Month 24', highValue: 78, midValue: 52, lowValue: 18 },
  ]

  const ltvTrends = [
    { month: 'Jan', predicted: 1250, actual: 1180 },
    { month: 'Feb', predicted: 1280, actual: 1220 },
    { month: 'Mar', predicted: 1310, actual: 1290 },
    { month: 'Apr', predicted: 1340, actual: 1315 },
    { month: 'May', predicted: 1375, actual: 1350 },
    { month: 'Jun', predicted: 1410, actual: null },
  ]

  const totalCustomers = segments.reduce((sum, segment) => sum + segment.count, 0)
  const weightedLTV = segments.reduce((sum, segment) => sum + (segment.avgLTV * segment.count), 0) / totalCustomers
  const avgChurnRate = segments.reduce((sum, segment) => sum + (segment.churnRate * segment.count), 0) / totalCustomers

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Lifetime Value Prediction</h1>
          <p className="text-text-secondary mt-1">Analyze customer segments and predict long-term value</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select 
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Segments</option>
            <option value="high">High Value</option>
            <option value="mid">Mid Value</option>
            <option value="low">Low Value</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatDisplay
          title="Average LTV"
          value={`$${weightedLTV.toFixed(0)}`}
          change="+8.4%"
          trend="up"
          icon={Users}
          color="success"
        />
        <StatDisplay
          title="Total Customers"
          value={totalCustomers.toString()}
          change="+15.2%"
          trend="up"
          icon={Target}
          color="primary"
        />
        <StatDisplay
          title="Avg Churn Rate"
          value={`${avgChurnRate.toFixed(1)}%`}
          change="-2.3%"
          trend="down"
          icon={TrendingUp}
          color="success"
        />
      </div>

      {/* Customer Segments */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Customer Segments</h3>
        <div className="space-y-4">
          {segments.map((segment, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary">{segment.name}</h4>
                    <p className="text-sm text-text-secondary">{segment.description}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-text-primary">{segment.count}</p>
                    <p className="text-xs text-text-secondary">Customers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-text-primary">${segment.avgLTV}</p>
                    <p className="text-xs text-text-secondary">Avg LTV</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-text-primary">{segment.churnRate}%</p>
                    <p className="text-xs text-text-secondary">Churn Rate</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Cohort Retention</h3>
          <Chart 
            data={cohortData} 
            type="line" 
            dataKey="highValue"
            color="#059669"
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">LTV Prediction vs Actual</h3>
          <Chart 
            data={ltvTrends} 
            type="line" 
            dataKey="predicted"
            color="#2563eb"
            height={300}
          />
        </Card>
      </div>

      {/* LTV Optimization Recommendations */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Optimization Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">High Value Segment</h4>
            <p className="text-sm text-green-700">Focus on premium features and dedicated support to maintain low churn.</p>
            <button className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
              View Strategy
            </button>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Mid Value Segment</h4>
            <p className="text-sm text-blue-700">Implement upselling campaigns to move customers to higher value tiers.</p>
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
              Start Campaign
            </button>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Low Value Segment</h4>
            <p className="text-sm text-red-700">Improve onboarding and early engagement to reduce churn rate.</p>
            <button className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
              Optimize Flow
            </button>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Predictive Model</h4>
            <p className="text-sm text-purple-700">Current model accuracy: 87%. Retrain with latest data monthly.</p>
            <button className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
              Retrain Model
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LTV