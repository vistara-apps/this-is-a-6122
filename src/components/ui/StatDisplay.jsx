import React from 'react'
import Card from './Card'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatDisplay = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color = 'primary',
  variant = 'default' 
}) => {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger'
  }

  const trendIcon = trend === 'up' ? TrendingUp : TrendingDown
  const trendColor = trend === 'up' ? 'text-success' : 'text-danger'
  const TrendIcon = trendIcon

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendIcon className={`h-4 w-4 ${trendColor} mr-1`} />
              <span className={`text-sm font-medium ${trendColor}`}>{change}</span>
              <span className="text-xs text-text-secondary ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50`}>
          <Icon className={`h-6 w-6 ${colorClasses[color]}`} />
        </div>
      </div>
    </Card>
  )
}

export default StatDisplay