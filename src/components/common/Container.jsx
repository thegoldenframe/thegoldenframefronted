import React from 'react'

const Container = ({ children, className = '', size = 'default' }) => {
  const sizes = {
    default: 'max-w-7xl',
    sm: 'max-w-4xl',
    lg: 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  return (
    <div className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export default Container
