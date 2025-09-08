import React from 'react'

function Card({ children, className = '', elevated = false }) {
  const baseClasses = 'bg-surface rounded-lg border border-gray-200 p-6'
  const elevatedClasses = elevated ? 'shadow-card' : ''
  
  return (
    <div className={`${baseClasses} ${elevatedClasses} ${className}`}>
      {children}
    </div>
  )
}

export default Card