import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Button = ({
  children,
  variant = 'gold',
  href,
  to,
  onClick,
  className = '',
  icon,
  size = 'md',
  ...props
}) => {
  const sizes = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-sm',
  }

  const baseClass = `relative inline-flex items-center gap-2 font-body font-medium tracking-widest uppercase overflow-hidden transition-all duration-300 ${sizes[size]} ${className}`

  const variants = {
    gold: 'bg-gold-gradient bg-[length:200%_auto] text-black hover:bg-right-center hover:shadow-gold',
    outline: 'border border-gold text-gold hover:text-black hover:bg-gold hover:shadow-gold',
    white: 'bg-ivory text-black hover:shadow-lg',
    ghost: 'text-gold hover:text-gold-soft',
  }

  const content = (
    <>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </>
  )

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    className: `${baseClass} ${variants[variant]}`,
    onClick,
    ...props,
  }

  if (to) return <motion.div {...motionProps}><Link to={to} className="flex items-center gap-2">{content}</Link></motion.div>
  if (href) return <motion.a href={href} {...motionProps}>{content}</motion.a>
  return <motion.button {...motionProps}>{content}</motion.button>
}

export default Button
