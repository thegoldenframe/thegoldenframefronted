import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        // Accelerate near the end
        const step = prev > 80 ? 3 : prev > 60 ? 2 : 1.5
        return Math.min(prev + step, 100)
      })
    }, 28)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Dot-grid bg */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D68454 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* Diamond spinner */}
      <motion.div
        className="relative mb-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-14 h-14 border-2 border-gold/25 border-t-gold rotate-45" />
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-px bg-gold/50" />
          <span className="text-gold/60 text-[10px] tracking-[0.5em] uppercase font-body">Est. 2020</span>
          <div className="w-8 h-px bg-gold/50" />
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-ivory tracking-widest leading-none uppercase">
          THE GOLDEN <span className="text-gold">FRAME</span>
        </h1>
        <p className="text-gray/50 text-[10px] tracking-[0.4em] uppercase mt-3 font-body">
          Premium Snooker & Pool Lounge
        </p>
      </motion.div>

      {/* Progress track */}
      <div className="w-44 h-px bg-gray/15 relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold to-gold-soft"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
      <p className="text-gray/30 text-[10px] tracking-[0.3em] mt-3 font-body tabular-nums">
        {String(progress).padStart(3, '0')}%
      </p>
    </motion.div>
  )
}

export default Loader
