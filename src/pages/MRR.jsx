import React, { useState } from 'react'
import Card from '../components/Card'
import Chart from '../components/Chart'
import Button from '../components/Button'
import StatDisplay from '../components/StatDisplay'
import { TrendingUp, Target, Calculator } from 'lucide-react'

// Mock data
const mrrHistoryData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 18000 },
  { name: 'Apr', value: 22000 },
  { name: 'May', value: 25000 },
  { name: 'Jun', value: 28000 },
]

const projectionData = [
  { name: 'Jul', historical: 28000, projected: 31000 },
  { name: 'Aug', projected: 34500 },
  { name: 'Sep', projected: 38200 },
  { name: 'Oct', projected: 42100 },
  { name: 'Nov', projected: 46300 },
  { name: 'Dec', projected: 50800 },
]

const mrrBreakdownData = [
  { name: 'New Customers', value: 8500 },
  { name: 'Expansion', value: 4200 },
  { name: 'Existing', value: 15300 },
]

function MRR() {
  const [projectionInputs, setProjectionInputs] = useState({
    currentMRR: 28000,
    growthRate: 10,
    churnRate: 5
  })

  const handleInputChange = (field, value) => {
    setProjectionInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Monthly Recurring Revenue</h1>
          <p className="mt-2 text-text-secondary">Track growth and forecast future revenue</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatDisplay
          title="Current MRR"
          value="$28,500"
          change="+12.5% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatDisplay
          title="6-Month Growth"
          value="+137%"
          change="From $12K to $28.5K"
          changeType="positive"
          icon={Target}
        />
        <StatDisplay
          title="Projected ARR"
          value="$608K"
          change="Based on current trends"
          changeType="neutral"
          icon={Calculator}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">MRR Historical Growth</h3>
            <p className="text-sm text-text-secondary">6-month revenue progression</p>
          </div>
          <Chart 
            type="line" 
            data={mrrHistoryData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>

        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">MRR Composition</h3>
            <p className="text-sm text-text-secondary">Revenue breakdown by source</p>
          </div>
          <Chart 
            type="pie" 
            data={mrrBreakdownData} 
            config={{ valueKey: 'value' }}
          />
        </Card>
      </div>

      {/* Revenue Projection Tool */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Revenue Projection Calculator</h3>
          <p className="text-sm text-text-secondary">Adjust parameters to see different growth scenarios</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Current MRR ($)
              </label>
              <input
                type="number"
                value={projectionInputs.currentMRR}
                onChange={(e) => handleInputChange('currentMRR', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Monthly Growth Rate (%)
              </label>
              <input
                type="number"
                value={projectionInputs.growthRate}
                onChange={(e) => handleInputChange('growthRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Monthly Churn Rate (%)
              </label>
              <input
                type="number"
                value={projectionInputs.churnRate}
                onChange={(e) => handleInputChange('churnRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.1"
              />
            </div>
            
            <Button className="w-full">
              Update Projections
            </Button>
          </div>
          
          <div className="lg:col-span-2">
            <Chart 
              type="line" 
              data={[...mrrHistoryData, ...projectionData]}
              config={{ xKey: 'name', yKey: 'projected' }}
            />
          </div>
        </div>
      </Card>

      {/* Detailed MRR Breakdown */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Monthly MRR Movement</h3>
          <p className="text-sm text-text-secondary">Track changes in recurring revenue components</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Starting MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  New Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Expansion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Churn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Ending MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  June 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  $25,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +$5,200
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +$1,800
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-danger">
                  -$3,500
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  $28,500
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +14%
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  May 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  $22,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +$4,800
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +$1,200
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-danger">
                  -$3,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  $25,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +13.6%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Growth Insights */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Growth Insights & Recommendations</h3>
          <p className="text-sm text-text-secondary">Data-driven suggestions to accelerate MRR growth</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900">Strong Growth Momentum</h4>
            <p className="text-sm text-green-700 mt-1">
              Your 6-month growth rate of 137% is excellent. Focus on sustaining this momentum.
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900">Expansion Revenue Opportunity</h4>
            <p className="text-sm text-blue-700 mt-1">
              Expansion revenue is 15% of MRR. Consider upselling to increase this percentage.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900">Monitor Churn Rate</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Current churn rate is manageable but watch for trends that could impact growth.
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-900">Forecast Accuracy</h4>
            <p className="text-sm text-purple-700 mt-1">
              Regularly update projections with actual results to improve forecasting accuracy.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MRR