import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { num: 12, suffix: '+', label: 'Premium Tables', icon: '🎱' },
  { num: 1500, suffix: '+', label: 'Happy Members', icon: '👥' },
  { num: 3, suffix: '', label: 'VIP Suites', icon: '⭐' },
  { num: 4, suffix: '+', label: 'Expert Coaches', icon: '🏆' },
]

const CounterNumber = ({ num, suffix, label, icon }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const steps = 60
          const increment = num / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= num) {
              setCount(num)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [num])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="w-16 h-16 border border-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:border-gold/60 group-hover:shadow-gold transition-all duration-300">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-gold">
        {count.toLocaleString()}{suffix}
      </p>
      <div className="w-8 h-px bg-gold/40 mx-auto my-3" />
      <p className="text-gray font-body text-sm tracking-wider uppercase">{label}</p>
    </motion.div>
  )
}

const StatsCounter = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
      {stats.map((stat, i) => (
        <CounterNumber key={i} {...stat} />
      ))}
    </div>
  )
}

export default StatsCounter
