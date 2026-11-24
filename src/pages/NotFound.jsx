import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black flex items-center justify-center px-4 pt-24"
    >
      <div className="text-center">
        {/* Decorative lines */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-px bg-gold/40" />
          <span className="text-gold/60 text-xs font-body tracking-[0.4em] uppercase">Error</span>
          <div className="w-16 h-px bg-gold/40" />
        </div>

        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-heading text-[12rem] md:text-[18rem] font-bold leading-none gold-shimmer"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-heading text-3xl md:text-5xl text-ivory mb-4 -mt-8"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray font-body text-base max-w-md mx-auto mb-10"
        >
          The page you are looking for seems to have taken a wrong shot. Let us guide you back to the main table.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/" className="btn-gold text-sm px-10 py-4">
            Back to Home
          </Link>
          <Link to="/contact" className="btn-outline-gold text-sm px-10 py-4">
            Contact Us
          </Link>
        </motion.div>
      </div>
    </motion.main>
  )
}

export default NotFound
