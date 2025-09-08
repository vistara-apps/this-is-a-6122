import React, { useState } from 'react'
import Card from '../components/Card'
import Chart from '../components/Chart'
import Button from '../components/Button'
import StatDisplay from '../components/StatDisplay'
import { Users, TrendingUp, Crown } from 'lucide-react'

// Mock data
const ltvSegmentData = [
  { name: 'High Value', value: 4500, customers: 25 },
  { name: 'Medium Value', value: 2200, customers: 45 },
  { name: 'Low Value', value: 800, customers: 30 },
]

const ltvTrendData = [
  { name: 'Jan', value: 2200 },
  { name: 'Feb', value: 2350 },
  { name: 'Mar', value: 2500 },
  { name: 'Apr', value: 2650 },
  { name: 'May', value: 2750 },
  { name: 'Jun', value: 2850 },
]

const cohortData = [
  { name: 'Jan 2024', month1: 100, month2: 85, month3: 78, month6: 65 },
  { name: 'Feb 2024', month1: 100, month2: 88, month3: 82, month6: 70 },
  { name: 'Mar 2024', month1: 100, month2: 90, month3: 85, month6: 75 },
  { name: 'Apr 2024', month1: 100, month2: 92, month3: 88 },
  { name: 'May 2024', month1: 100, month2: 95 },
  { name: 'Jun 2024', month1: 100 },
]

function LTV() {
  const [selectedSegment, setSelectedSegment] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Customer Lifetime Value</h1>
          <p className="mt-2 text-text-secondary">Analyze and predict customer value for strategic growth</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select 
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Segments</option>
            <option value="high">High Value</option>
            <option value="medium">Medium Value</option>
            <option value="low">Low Value</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatDisplay
          title="Average LTV"
          value="$2,850"
          change="+5.2% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatDisplay
          title="LTV Growth Rate"
          value="+29.5%"
          change="6-month trend"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatDisplay
          title="High-Value Customers"
          value="25%"
          change="of total customer base"
          changeType="neutral"
          icon={Crown}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">LTV by Customer Segment</h3>
            <p className="text-sm text-text-secondary">Average lifetime value across segments</p>
          </div>
          <Chart 
            type="bar" 
            data={ltvSegmentData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>

        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">LTV Trend Over Time</h3>
            <p className="text-sm text-text-secondary">6-month average LTV progression</p>
          </div>
          <Chart 
            type="line" 
            data={ltvTrendData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>
      </div>

      {/* Customer Segments Detail */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Customer Segment Analysis</h3>
          <p className="text-sm text-text-secondary">Detailed breakdown of customer value segments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ltvSegmentData.map((segment, index) => (
            <div key={segment.name} className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-text-primary">{segment.name}</h4>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  index === 0 ? 'bg-green-100 text-green-800' :
                  index === 1 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {segment.customers}% of customers
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Average LTV:</span>
                  <span className="text-sm font-medium text-text-primary">${segment.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Revenue Impact:</span>
                  <span className="text-sm font-medium text-text-primary">
                    ${((segment.value * segment.customers) / 100 * 100).toLocaleString()}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Cohort Analysis */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Cohort Retention Analysis</h3>
          <p className="text-sm text-text-secondary">Customer retention rates by signup month</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Cohort
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Month 1
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Month 2
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Month 3
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Month 6
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {cohortData.map((cohort) => (
                <tr key={cohort.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {cohort.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {cohort.month1}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {cohort.month2 ? `${cohort.month2}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {cohort.month3 ? `${cohort.month3}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {cohort.month6 ? `${cohort.month6}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary">LTV Optimization Recommendations</h3>
          <p className="text-sm text-text-secondary">AI-powered insights to increase customer lifetime value</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900">Focus on High-Value Segment</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your high-value customers generate 3x more revenue. Consider implementing a VIP program.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900">Improve Month 2-3 Retention</h4>
            <p className="text-sm text-yellow-700 mt-1">
              There's a retention drop in months 2-3. Consider onboarding improvements or engagement campaigns.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900">Upsell Opportunity</h4>
            <p className="text-sm text-green-700 mt-1">
              Medium-value customers show potential for upgrades. Target them with feature demonstrations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LTV