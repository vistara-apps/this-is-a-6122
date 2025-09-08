import React from 'react'
import Card from '../components/Card'
import StatDisplay from '../components/StatDisplay'
import Chart from '../components/Chart'
import { TrendingUp, Users, DollarSign, Flame } from 'lucide-react'

// Mock data for demonstration
const mrrData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 18000 },
  { name: 'Apr', value: 22000 },
  { name: 'May', value: 25000 },
  { name: 'Jun', value: 28000 },
]

const channelData = [
  { name: 'Google Ads', value: 45 },
  { name: 'Meta Ads', value: 30 },
  { name: 'Organic', value: 15 },
  { name: 'Referral', value: 10 },
]

const cacTrendData = [
  { name: 'Jan', value: 85 },
  { name: 'Feb', value: 78 },
  { name: 'Mar', value: 82 },
  { name: 'Apr', value: 75 },
  { name: 'May', value: 70 },
  { name: 'Jun', value: 68 },
]

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-2 sm:mt-0 text-text-secondary">Overview of your startup's financial health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatDisplay
          title="Monthly Recurring Revenue"
          value="$28,500"
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatDisplay
          title="Customer Acquisition Cost"
          value="$68"
          change="-8.1% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatDisplay
          title="Average LTV"
          value="$2,850"
          change="+5.2% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatDisplay
          title="Burn Rate"
          value="$15,200"
          change="+3.1% from last month"
          changeType="negative"
          icon={Flame}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">MRR Growth Trend</h3>
            <p className="text-sm text-text-secondary">Monthly recurring revenue over time</p>
          </div>
          <Chart 
            type="line" 
            data={mrrData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>

        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Acquisition Channels</h3>
            <p className="text-sm text-text-secondary">Customer acquisition by channel</p>
          </div>
          <Chart 
            type="pie" 
            data={channelData} 
            config={{ valueKey: 'value' }}
          />
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-6">
        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">CAC Trend Analysis</h3>
            <p className="text-sm text-text-secondary">Customer acquisition cost optimization over time</p>
          </div>
          <Chart 
            type="bar" 
            data={cacTrendData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <h4 className="font-medium text-text-primary">Update CAC Data</h4>
            <p className="text-sm text-text-secondary">Sync latest ad spend</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <h4 className="font-medium text-text-primary">Review LTV Segments</h4>
            <p className="text-sm text-text-secondary">Analyze customer value</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <h4 className="font-medium text-text-primary">Generate Projections</h4>
            <p className="text-sm text-text-secondary">Forecast revenue growth</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <h4 className="font-medium text-text-primary">Update Expenses</h4>
            <p className="text-sm text-text-secondary">Track burn rate</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard