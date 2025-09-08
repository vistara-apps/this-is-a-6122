import React from 'react'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 text-text-primary hover:bg-gray-200 border border-gray-300'
      case 'destructive':
        return 'bg-danger text-white hover:bg-red-600'
      case 'outline':
        return 'border border-primary text-primary hover:bg-primary hover:text-white'
      default:
        return 'bg-primary text-white hover:bg-blue-600'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  return (
    <button
      className={`
        font-medium rounded-md transition-colors duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button