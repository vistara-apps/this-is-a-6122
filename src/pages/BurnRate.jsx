import React, { useState } from 'react'
import Card from '../components/Card'
import Chart from '../components/Chart'
import Button from '../components/Button'
import StatDisplay from '../components/StatDisplay'
import { Flame, Clock, AlertTriangle } from 'lucide-react'

// Mock data
const burnRateData = [
  { name: 'Jan', value: 12500 },
  { name: 'Feb', value: 13200 },
  { name: 'Mar', value: 14100 },
  { name: 'Apr', value: 14800 },
  { name: 'May', value: 15200 },
  { name: 'Jun', value: 15200 },
]

const expenseBreakdownData = [
  { name: 'Salaries', value: 8500 },
  { name: 'Marketing', value: 3200 },
  { name: 'Software/Tools', value: 1800 },
  { name: 'Infrastructure', value: 1200 },
  { name: 'Other', value: 500 },
]

const runwayProjectionData = [
  { name: 'Current', runway: 18 },
  { name: 'Optimistic', runway: 24 },
  { name: 'Conservative', runway: 15 },
]

function BurnRate() {
  const [expenses, setExpenses] = useState({
    salaries: 8500,
    marketing: 3200,
    software: 1800,
    infrastructure: 1200,
    other: 500
  })
  
  const [cashReserves, setCashReserves] = useState(275000)

  const totalBurn = Object.values(expenses).reduce((sum, expense) => sum + expense, 0)
  const currentRunway = Math.floor(cashReserves / totalBurn)

  const handleExpenseChange = (category, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Burn Rate & Runway</h1>
          <p className="mt-2 text-text-secondary">Monitor cash flow and plan for sustainability</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatDisplay
          title="Monthly Burn Rate"
          value={`$${totalBurn.toLocaleString()}`}
          change="+2.7% from last month"
          changeType="negative"
          icon={Flame}
        />
        <StatDisplay
          title="Current Runway"
          value={`${currentRunway} months`}
          change="Based on current burn"
          changeType={currentRunway > 12 ? "positive" : "negative"}
          icon={Clock}
        />
        <StatDisplay
          title="Cash Reserves"
          value={`$${cashReserves.toLocaleString()}`}
          change="Updated this month"
          changeType="neutral"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Burn Rate Trend</h3>
            <p className="text-sm text-text-secondary">6-month spending pattern</p>
          </div>
          <Chart 
            type="line" 
            data={burnRateData} 
            config={{ xKey: 'name', yKey: 'value' }}
          />
        </Card>

        <Card elevated>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Expense Breakdown</h3>
            <p className="text-sm text-text-secondary">Current monthly expenses by category</p>
          </div>
          <Chart 
            type="pie" 
            data={expenseBreakdownData} 
            config={{ valueKey: 'value' }}
          />
        </Card>
      </div>

      {/* Expense Calculator */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Expense Calculator</h3>
          <p className="text-sm text-text-secondary">Adjust expenses to see impact on runway</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Salaries & Benefits ($)
              </label>
              <input
                type="number"
                value={expenses.salaries}
                onChange={(e) => handleExpenseChange('salaries', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Marketing & Advertising ($)
              </label>
              <input
                type="number"
                value={expenses.marketing}
                onChange={(e) => handleExpenseChange('marketing', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Software & Tools ($)
              </label>
              <input
                type="number"
                value={expenses.software}
                onChange={(e) => handleExpenseChange('software', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Infrastructure & Hosting ($)
              </label>
              <input
                type="number"
                value={expenses.infrastructure}
                onChange={(e) => handleExpenseChange('infrastructure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Other Expenses ($)
              </label>
              <input
                type="number"
                value={expenses.other}
                onChange={(e) => handleExpenseChange('other', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-text-primary">Total Monthly Burn:</span>
                <span className="text-lg font-bold text-danger">${totalBurn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-text-secondary">Estimated Runway:</span>
                <span className={`text-sm font-medium ${currentRunway > 12 ? 'text-success' : 'text-danger'}`}>
                  {currentRunway} months
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Current Cash Reserves ($)
              </label>
              <input
                type="number"
                value={cashReserves}
                onChange={(e) => setCashReserves(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-text-primary mb-3">Scenario Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">10% Reduction:</span>
                  <span className="text-sm font-medium text-success">
                    {Math.floor(cashReserves / (totalBurn * 0.9))} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">20% Reduction:</span>
                  <span className="text-sm font-medium text-success">
                    {Math.floor(cashReserves / (totalBurn * 0.8))} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">25% Increase:</span>
                  <span className="text-sm font-medium text-danger">
                    {Math.floor(cashReserves / (totalBurn * 1.25))} months
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${currentRunway > 18 ? 'bg-green-50 border border-green-200' : 
              currentRunway > 12 ? 'bg-yellow-50 border border-yellow-200' : 
              'bg-red-50 border border-red-200'}`}>
              <h4 className={`font-medium ${currentRunway > 18 ? 'text-green-900' : 
                currentRunway > 12 ? 'text-yellow-900' : 'text-red-900'}`}>
                Runway Status
              </h4>
              <p className={`text-sm mt-1 ${currentRunway > 18 ? 'text-green-700' : 
                currentRunway > 12 ? 'text-yellow-700' : 'text-red-700'}`}>
                {currentRunway > 18 ? 'Excellent runway length. Good financial cushion.' :
                 currentRunway > 12 ? 'Healthy runway. Monitor burn rate trends.' :
                 'Low runway. Consider reducing expenses or fundraising.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Expense Tracking */}
      <Card elevated>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Monthly Expense Tracking</h3>
          <p className="text-sm text-text-secondary">Track and categorize your monthly expenses</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Current Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  Salaries & Benefits
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  ${expenses.salaries.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  $8,200
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +$300
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {((expenses.salaries / totalBurn) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  Marketing & Advertising
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  ${expenses.marketing.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  $3,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                  +$200
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {((expenses.marketing / totalBurn) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cash Flow Recommendations */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Cash Flow Optimization</h3>
          <p className="text-sm text-text-secondary">Recommendations to extend runway and improve cash efficiency</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900">Expense Optimization</h4>
            <p className="text-sm text-blue-700 mt-1">
              Consider renegotiating software contracts or finding cost-effective alternatives.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900">Revenue Acceleration</h4>
            <p className="text-sm text-green-700 mt-1">
              Focus on converting leads faster to improve cash flow timing.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900">Fundraising Timeline</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Start fundraising process 6-9 months before projected runway end.
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-900">Emergency Planning</h4>
            <p className="text-sm text-purple-700 mt-1">
              Prepare contingency plans for 20-30% expense reduction if needed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default BurnRate