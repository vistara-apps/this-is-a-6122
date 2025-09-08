import React, { useState } from 'react'
import Card from './ui/Card'
import StatDisplay from './ui/StatDisplay'
import Chart from './ui/Chart'
import { TrendingUp, Calculator, Target } from 'lucide-react'

const MRR = () => {
  const [projectionInputs, setProjectionInputs] = useState({
    currentMRR: 24500,
    growthRate: 15,
    churnRate: 5.2,
    avgRevenuePer: 125
  })

  const [timeframe, setTimeframe] = useState(12)

  const mrrHistory = [
    { month: 'Jan', mrr: 18000, newMRR: 3200, churnedMRR: 800, expansionMRR: 400 },
    { month: 'Feb', mrr: 19500, newMRR: 3800, churnedMRR: 950, expansionMRR: 650 },
    { month: 'Mar', mrr: 21000, newMRR: 4200, churnedMRR: 1100, expansionMRR: 900 },
    { month: 'Apr', mrr: 22800, newMRR: 4600, churnedMRR: 1200, expansionMRR: 1400 },
    { month: 'May', mrr: 24500, newMRR: 5100, churnedMRR: 1300, expansionMRR: 1700 },
    { month: 'Jun', mrr: 26200, newMRR: 5400, churnedMRR: 1400, expansionMRR: 1800 },
  ]

  // Calculate projections based on inputs
  const generateProjections = () => {
    const projections = []
    let currentMRR = projectionInputs.currentMRR
    
    for (let i = 1; i <= timeframe; i++) {
      const growthAmount = currentMRR * (projectionInputs.growthRate / 100)
      const churnAmount = currentMRR * (projectionInputs.churnRate / 100)
      currentMRR = currentMRR + growthAmount - churnAmount
      
      projections.push({
        month: `Month ${i}`,
        projected: Math.round(currentMRR),
        optimistic: Math.round(currentMRR * 1.2),
        conservative: Math.round(currentMRR * 0.8)
      })
    }
    
    return projections
  }

  const projectionData = generateProjections()
  const monthlyGrowth = ((mrrHistory[mrrHistory.length - 1].mrr - mrrHistory[0].mrr) / mrrHistory[0].mrr) * 100
  const projectedYearEnd = projectionData[11]?.projected || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">MRR Projections</h1>
          <p className="text-text-secondary mt-1">Forecast your Monthly Recurring Revenue growth</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={24}>24 Months</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatDisplay
          title="Current MRR"
          value={`$${projectionInputs.currentMRR.toLocaleString()}`}
          change={`+${monthlyGrowth.toFixed(1)}%`}
          trend="up"
          icon={TrendingUp}
          color="success"
        />
        <StatDisplay
          title="Projected Year-End MRR"
          value={`$${projectedYearEnd.toLocaleString()}`}
          change="+125.8%"
          trend="up"
          icon={Target}
          color="primary"
        />
        <StatDisplay
          title="Annual Run Rate"
          value={`$${(projectionInputs.currentMRR * 12).toLocaleString()}`}
          change="+45.2%"
          trend="up"
          icon={Calculator}
          color="success"
        />
      </div>

      {/* Projection Inputs */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Projection Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Current MRR ($)</label>
            <input
              type="number"
              value={projectionInputs.currentMRR}
              onChange={(e) => setProjectionInputs({...projectionInputs, currentMRR: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Monthly Growth Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={projectionInputs.growthRate}
              onChange={(e) => setProjectionInputs({...projectionInputs, growthRate: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Monthly Churn Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={projectionInputs.churnRate}
              onChange={(e) => setProjectionInputs({...projectionInputs, churnRate: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Avg Revenue Per User ($)</label>
            <input
              type="number"
              value={projectionInputs.avgRevenuePer}
              onChange={(e) => setProjectionInputs({...projectionInputs, avgRevenuePer: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Historical MRR Growth</h3>
          <Chart 
            data={mrrHistory} 
            type="line" 
            dataKey="mrr"
            color="#2563eb"
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">MRR Projection Scenarios</h3>
          <Chart 
            data={projectionData.slice(0, 12)} 
            type="line" 
            dataKey="projected"
            color="#059669"
            height={300}
          />
        </Card>
      </div>

      {/* MRR Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">MRR Breakdown (Last 6 Months)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Month</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Total MRR</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">New MRR</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Expansion MRR</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Churned MRR</th>
                <th className="text-right py-3 text-sm font-medium text-text-secondary">Net New</th>
              </tr>
            </thead>
            <tbody>
              {mrrHistory.map((month, index) => {
                const netNew = month.newMRR + month.expansionMRR - month.churnedMRR
                return (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-4 font-medium text-text-primary">{month.month}</td>
                    <td className="text-right py-4 font-bold text-text-primary">${month.mrr.toLocaleString()}</td>
                    <td className="text-right py-4 text-success">+${month.newMRR.toLocaleString()}</td>
                    <td className="text-right py-4 text-primary">+${month.expansionMRR.toLocaleString()}</td>
                    <td className="text-right py-4 text-danger">-${month.churnedMRR.toLocaleString()}</td>
                    <td className="text-right py-4">
                      <span className={`font-medium ${netNew >= 0 ? 'text-success' : 'text-danger'}`}>
                        {netNew >= 0 ? '+' : ''}${netNew.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Scenario Analysis */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Scenario Analysis ({timeframe} Months)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Optimistic Scenario</h4>
            <p className="text-2xl font-bold text-green-700">${projectionData[timeframe-1]?.optimistic.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+20% from baseline projection</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Baseline Scenario</h4>
            <p className="text-2xl font-bold text-blue-700">${projectionData[timeframe-1]?.projected.toLocaleString()}</p>
            <p className="text-sm text-blue-600 mt-1">Based on current trends</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Conservative Scenario</h4>
            <p className="text-2xl font-bold text-red-700">${projectionData[timeframe-1]?.conservative.toLocaleString()}</p>
            <p className="text-sm text-red-600 mt-1">-20% from baseline projection</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MRR