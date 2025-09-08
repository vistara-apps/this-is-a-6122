import React from 'react'

function StatDisplay({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  variant = 'primary',
  icon: Icon 
}) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-success'
      case 'negative': return 'text-danger'
      default: return 'text-text-secondary'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary': return 'bg-gray-50'
      case 'tertiary': return 'bg-blue-50'
      default: return 'bg-surface'
    }
  }

  return (
    <div className={`p-6 rounded-lg border border-gray-200 ${getVariantClasses()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {change && (
            <p className={`text-sm ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-text-secondary" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatDisplay