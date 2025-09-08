import React from 'react'
import Card from './ui/Card'
import StatDisplay from './ui/StatDisplay'
import Chart from './ui/Chart'
import { TrendingUp, DollarSign, Users, Flame } from 'lucide-react'

const Dashboard = () => {
  // Mock data for dashboard metrics
  const metrics = [
    {
      title: 'Monthly Recurring Revenue',
      value: '$24,500',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Customer Acquisition Cost',
      value: '$89',
      change: '-8.2%',
      trend: 'down',
      icon: DollarSign,
      color: 'success'
    },
    {
      title: 'Lifetime Value',
      value: '$1,250',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'success'
    },
    {
      title: 'Burn Rate',
      value: '$18,200',
      change: '+3.1%',
      trend: 'up',
      icon: Flame,
      color: 'warning'
    }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 18000, customers: 180 },
    { month: 'Feb', revenue: 19500, customers: 195 },
    { month: 'Mar', revenue: 21000, customers: 210 },
    { month: 'Apr', revenue: 22800, customers: 228 },
    { month: 'May', revenue: 24500, customers: 245 },
    { month: 'Jun', revenue: 26200, customers: 262 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Overview of your startup's financial health</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Sync Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <StatDisplay key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Revenue Growth</h3>
          <Chart 
            data={revenueData} 
            type="line" 
            dataKey="revenue"
            color="#2563eb"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Customer Growth</h3>
          <Chart 
            data={revenueData} 
            type="bar" 
            dataKey="customers"
            color="#059669"
          />
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-medium text-text-primary">Connect Google Ads</h4>
            <p className="text-sm text-text-secondary mt-1">Auto-track CAC</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-medium text-text-primary">Setup Stripe</h4>
            <p className="text-sm text-text-secondary mt-1">Track MRR & LTV</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-medium text-text-primary">Add Expenses</h4>
            <p className="text-sm text-text-secondary mt-1">Calculate burn rate</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-medium text-text-primary">View Projections</h4>
            <p className="text-sm text-text-secondary mt-1">12-month forecast</p>
          </button>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard