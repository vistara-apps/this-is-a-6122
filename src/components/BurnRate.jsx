import React, { useState } from 'react'
import Card from './ui/Card'
import StatDisplay from './ui/StatDisplay'
import Chart from './ui/Chart'
import { Flame, Plus, DollarSign, Calendar } from 'lucide-react'

const BurnRate = () => {
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '' })
  const [cashReserves, setCashReserves] = useState(250000)

  const expenses = [
    { category: 'Salaries & Benefits', amount: 12500, percentage: 68.7 },
    { category: 'Marketing & Advertising', amount: 2800, percentage: 15.4 },
    { category: 'Software & Tools', amount: 1200, percentage: 6.6 },
    { category: 'Office & Operations', amount: 800, percentage: 4.4 },
    { category: 'Legal & Professional', amount: 500, percentage: 2.7 },
    { category: 'Other', amount: 400, percentage: 2.2 },
  ]

  const burnHistory = [
    { month: 'Jan', burn: 16200, revenue: 18000, netBurn: -1800 },
    { month: 'Feb', burn: 16800, revenue: 19500, netBurn: -2700 },
    { month: 'Mar', burn: 17400, revenue: 21000, netBurn: -3600 },
    { month: 'Apr', burn: 17900, revenue: 22800, netBurn: -4900 },
    { month: 'May', burn: 18200, revenue: 24500, netBurn: -6300 },
    { month: 'Jun', burn: 18500, revenue: 26200, netBurn: -7700 },
  ]

  const totalBurn = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const currentRevenue = 24500 // From MRR
  const netBurn = Math.max(0, totalBurn - currentRevenue)
  const runway = netBurn > 0 ? Math.floor(cashReserves / netBurn) : Infinity

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.description) {
      console.log('Adding expense:', newExpense)
      setNewExpense({ category: '', amount: '', description: '' })
      setIsAddingExpense(false)
    }
  }

  const expenseCategories = [
    'Salaries & Benefits',
    'Marketing & Advertising',
    'Software & Tools',
    'Office & Operations',
    'Legal & Professional',
    'Research & Development',
    'Travel & Entertainment',
    'Other'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Burn Rate Calculator</h1>
          <p className="text-text-secondary mt-1">Track expenses and calculate your runway</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setIsAddingExpense(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-text-secondary">Cash Reserves:</label>
            <input
              type="number"
              value={cashReserves}
              onChange={(e) => setCashReserves(parseInt(e.target.value))}
              className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatDisplay
          title="Monthly Burn Rate"
          value={`$${totalBurn.toLocaleString()}`}
          change="+3.1%"
          trend="up"
          icon={Flame}
          color="warning"
        />
        <StatDisplay
          title="Monthly Revenue"
          value={`$${currentRevenue.toLocaleString()}`}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          color="success"
        />
        <StatDisplay
          title="Net Burn"
          value={netBurn > 0 ? `-$${netBurn.toLocaleString()}` : `+$${Math.abs(netBurn).toLocaleString()}`}
          change={netBurn > 0 ? "+45.2%" : "-45.2%"}
          trend={netBurn > 0 ? "up" : "down"}
          icon={Flame}
          color={netBurn > 0 ? "danger" : "success"}
        />
        <StatDisplay
          title="Runway"
          value={runway === Infinity ? "∞" : `${runway}M`}
          change={runway === Infinity ? "Profitable!" : "13.7%"}
          trend="up"
          icon={Calendar}
          color={runway > 12 ? "success" : runway > 6 ? "warning" : "danger"}
        />
      </div>

      {/* Expense Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Monthly Expense Breakdown</h3>
        <div className="space-y-4">
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-primary rounded-full opacity-80" />
                <span className="font-medium text-text-primary">{expense.category}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-text-primary">${expense.amount.toLocaleString()}</p>
                <p className="text-sm text-text-secondary">{expense.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-text-primary">Total Monthly Burn</span>
            <span className="text-xl font-bold text-text-primary">${totalBurn.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Burn Rate Trend</h3>
          <Chart 
            data={burnHistory} 
            type="line" 
            dataKey="burn"
            color="#dc2626"
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Revenue vs Burn</h3>
          <Chart 
            data={burnHistory} 
            type="bar" 
            dataKey="revenue"
            color="#059669"
            height={300}
          />
        </Card>
      </div>

      {/* Runway Scenarios */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Runway Scenarios</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Current Trajectory</h4>
            <p className="text-2xl font-bold text-red-700">{runway === Infinity ? "∞" : `${runway} months`}</p>
            <p className="text-sm text-red-600 mt-1">At current burn rate</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">If Burn +20%</h4>
            <p className="text-2xl font-bold text-yellow-700">
              {Math.floor(cashReserves / (totalBurn * 1.2))} months
            </p>
            <p className="text-sm text-yellow-600 mt-1">Higher expense scenario</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">If Burn -20%</h4>
            <p className="text-2xl font-bold text-green-700">
              {netBurn > 0 ? Math.floor(cashReserves / (totalBurn * 0.8)) : "∞"} months
            </p>
            <p className="text-sm text-green-600 mt-1">Cost optimization scenario</p>
          </div>
        </div>
      </Card>

      {/* Cash Flow Projection */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">6-Month Cash Flow History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Month</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Revenue</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Burn</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Net Cash Flow</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Runway (Months)</th>
              </tr>
            </thead>
            <tbody>
              {burnHistory.map((month, index) => {
                const netFlow = month.revenue - month.burn
                const monthlyRunway = netFlow < 0 ? Math.floor(cashReserves / Math.abs(netFlow)) : Infinity
                return (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-4 font-medium text-text-primary">{month.month}</td>
                    <td className="text-right py-4 text-success">${month.revenue.toLocaleString()}</td>
                    <td className="text-right py-4 text-danger">${month.burn.toLocaleString()}</td>
                    <td className="text-right py-4">
                      <span className={`font-medium ${netFlow >= 0 ? 'text-success' : 'text-danger'}`}>
                        {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-right py-4 text-text-primary">
                      {monthlyRunway === Infinity ? "∞" : monthlyRunway}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Expense Modal */}
      {isAddingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Add Monthly Expense</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Monthly Amount ($)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Senior Developer Salary"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsAddingExpense(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Add Expense
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default BurnRate