import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Demo-only: simulated live availability
const AREAS = [
  { label: 'Pool Tables', total: 4, color: 'bg-blue-400' },
  { label: 'Snooker Tables', total: 4, color: 'bg-emerald-400' },
  { label: 'PS5 Stations', total: 3, color: 'bg-sky-400' },
  { label: 'Cafe Wait', total: 0, color: 'bg-amber-400' },
]
const seed = (n) => Math.abs(Math.sin(n * 9301 + 49297) * 233280) % 1

const LiveStatus = () => {
  const [tick, setTick] = useState(() => Math.floor(Date.now() / 8000))
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 8000); return () => clearInterval(t) }, [])

  return (
    <section className="px-4 -mt-6 relative z-10">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 border border-gold/15">
        {AREAS.map((a, i) => {
          const free = a.total ? Math.floor(seed(tick + i) * (a.total + 1)) : null
          const wait = a.total ? null : 5 + Math.floor(seed(tick + i) * 12)
          return (
            <motion.div key={a.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-surface p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="relative flex w-2 h-2"><span className={`absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping ${a.color}`} /><span className={`relative inline-flex w-2 h-2 rounded-full ${a.color}`} /></span>
                <span className="font-body text-[9px] tracking-[0.25em] uppercase text-gray/60">Live</span>
              </div>
              <p className="font-heading text-3xl text-gold leading-none mb-1">{a.total ? `${free}/${a.total}` : `~${wait}m`}</p>
              <p className="font-body text-[10px] tracking-wide text-gray/50">{a.total ? `${a.label} free` : a.label}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
export default LiveStatus
