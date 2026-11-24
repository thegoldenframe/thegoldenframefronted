import React from 'react'
import { motion } from 'framer-motion'

const milestones = [
  {
    year: '2020',
    title: 'Grand Opening',
    desc: 'The Golden Frame opens its doors in Silvassa, Silvassa with 4 premium tables and a founding membership of 150 players.',
    side: 'left',
  },
  {
    year: '2021',
    title: 'VIP Expansion',
    desc: 'We introduce our first exclusive VIP lounge space and upgrade to tournament-grade Aramith ball sets.',
    side: 'right',
  },
  {
    year: '2022',
    title: 'Championship Host',
    desc: 'Hosted the first Silvassa Open Pool Tournament, attracting top players from Gujarat and neighboring states.',
    side: 'left',
  },
  {
    year: '2023',
    title: 'Coaching Academy',
    desc: 'Launched professional coaching modules, helping players improve their cue control and tactical play.',
    side: 'right',
  },
  {
    year: '2024',
    title: 'Full Renovation',
    desc: 'Complete club renovation, installing professional-grade lighting, Strachan 6811 cloths, and introducing a café lounge.',
    side: 'left',
  },
  {
    year: '2026',
    title: 'Elite Venue Status',
    desc: 'Recognized as Silvassa\'s premier cue sports lounge, host to weekly tournaments with a growing community.',
    side: 'right',
  },
]

const Timeline = () => {
  return (
    <div className="relative">
      {/* Vertical line — centre on md+, left on mobile */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

      <div className="space-y-10 md:space-y-0">
        {milestones.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`relative flex items-start gap-4 pl-10 md:pl-0 md:flex-row md:items-center md:gap-0 md:mb-16
              ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Mobile dot */}
            <div className="absolute left-0 top-6 md:hidden flex-shrink-0 z-10">
              <div className="w-8 h-8 bg-gold/10 border border-gold/40 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-gold rounded-full" />
              </div>
            </div>

            {/* Card */}
            <div className={`flex-1 w-full md:w-auto ${item.side === 'left' ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
              <div className="glass-card gold-border p-5 sm:p-6 md:p-8 group hover:shadow-gold transition-all duration-300">
                <span className="font-heading text-4xl sm:text-5xl font-bold text-gold/20 group-hover:text-gold/40 transition-colors duration-300 block leading-none mb-1">
                  {item.year}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl text-ivory mb-2 group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>

            {/* Desktop centre dot */}
            <div className="relative z-10 flex-shrink-0 hidden md:flex items-center justify-center">
              <div className="w-5 h-5 bg-gold rounded-full shadow-gold" />
              <div className="absolute w-10 h-10 border border-gold/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            </div>

            {/* Desktop spacer */}
            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
