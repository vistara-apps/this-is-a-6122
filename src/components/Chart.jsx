import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function Chart({ type = 'line', data, config = {}, className = '' }) {
  const colors = ['hsl(220, 89%, 46%)', 'hsl(120, 80%, 40%)', 'hsl(36, 80%, 40%)', 'hsl(0, 80%, 50%)']

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey || 'name'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={config.yKey || 'value'} fill={colors[0]} />
          </BarChart>
        )
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={config.valueKey || 'value'}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
      
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey || 'name'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={config.yKey || 'value'} 
              stroke={colors[0]} 
              strokeWidth={2}
            />
          </LineChart>
        )
    }
  }

  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}

export default Chart