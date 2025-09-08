import React, { useState } from 'react'
import Card from '../components/Card'
import Chart from '../components/Chart'
import Button from '../components/Button'
import StatDisplay from '../components/StatDisplay'
import { BarChart3, TrendingDown, Target } from 'lucide-react'

// Mock data
const cacByChannelData = [
  { name: 'Google Ads', value: 85, spend: 4250, conversions: 50 },
  { name: 'Meta Ads', value: 65, spend: 3250, conversions: 50 },
  { name: 'LinkedIn', value: 120, spend: 2400, conversions: 20 },
  { name: 'Twitter', value: 95, spend: 1900, conversions: 20 },
]

const cacTrendData = [
  { name: 'Jan', value: 95 },
  { name: 'Feb', value: 88 },
  { name: 'Mar', value: 82 },
  { name: 'Apr', value: 75 },
  { name: 'May', value: 70 },
  { name: 'Jun', value: 68 },
]

function CAC() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Customer Acquisition Cost</h1>
          <p className="mt-2 text-text-secondary">Track and optimize your marketing spend efficiency</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatDisplay
          title="Average CAC"
          value="$68"
          change="-8.1% from last month"
          changeType="positive"
          icon={BarChart3}
        />
        <StatDisplay
          title="Best Performing Channel"
          value="Meta Ads"
          change="$65 CAC"
          changeType="positive"
          icon={Target}
        />
        <StatDisplay
          title="CAC Trend"
          value="Improving"
          change="-12% over 6 months"
          changeType="positive"
          icon={TrendingDown}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">CAC by Channel</h3>
            <p className="text-sm text-text-secondary">Current acquisition costs across channels</p>
          </div>
          <Chart 
            type="bar" 
            data={cacByChannelData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>

        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">CAC Trend Over Time</h3>
            <p className="text-sm text-text-secondary">6-month optimization progress</p>
          </div>
          <Chart 
            type="line" 
            data={cacTrendData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>
      </div>

      {/* Channel Details */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Channel Performance Details</h3>
          <p className="text-sm text-text-secondary">Detailed breakdown of acquisition costs and performance</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  CAC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {cacByChannelData.map((channel) => (
                <tr key={channel.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {channel.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    ${channel.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {channel.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    ${channel.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="outline" size="sm">
                      Optimize
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Integration Status */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Connected Platforms</h3>
          <p className="text-sm text-text-secondary">Manage your marketing platform integrations</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Google Ads</h4>
              <p className="text-sm text-success">Connected</p>
            </div>
            <div className="h-3 w-3 bg-success rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Meta Ads</h4>
              <p className="text-sm text-success">Connected</p>
            </div>
            <div className="h-3 w-3 bg-success rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">LinkedIn Ads</h4>
              <p className="text-sm text-warning">Pending</p>
            </div>
            <div className="h-3 w-3 bg-warning rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Twitter Ads</h4>
              <p className="text-sm text-text-secondary">Not Connected</p>
            </div>
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CAC