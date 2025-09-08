import React from 'react'

const Card = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'bg-surface rounded-lg border border-gray-100'
  const variantClasses = {
    default: 'shadow-card',
    elevated: 'shadow-lg'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

export default Card