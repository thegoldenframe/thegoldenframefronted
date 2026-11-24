import React from 'react'
import { motion } from 'framer-motion'

const PageWrapper = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className={`min-h-screen bg-bg ${className}`}
  >
    {children}
  </motion.div>
)
export default PageWrapper
