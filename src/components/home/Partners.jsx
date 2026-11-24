import React from 'react'
import { motion } from 'framer-motion'

const partners = [
  { name: 'World Snooker Tour', abbr: 'WST' },
  { name: 'Strachan Cloth',     abbr: 'SCL' },
  { name: 'Aramith',            abbr: 'ARM' },
  { name: 'Riley Leisure',      abbr: 'RLY' },
  { name: 'BCE Snooker',        abbr: 'BCE' },
  { name: 'Peradon Cues',       abbr: 'PRD' },
]

const Partners = () => (
  <section className="py-14 bg-surface border-y border-gold/10 relative overflow-hidden">
    {/* subtle line */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

    <div className="container-luxury">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-[10px] font-body tracking-[0.45em] uppercase text-gold/50 mb-8"
      >
        Trusted Partners & Official Suppliers
      </motion.p>

      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
        {partners.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.05 }}
            className="group px-6 py-3 border border-gold/10 hover:border-gold/35 transition-all duration-300 cursor-pointer"
          >
            <span className="font-heading text-lg font-medium text-gray/35 group-hover:text-gold/65 transition-colors duration-300 tracking-wider whitespace-nowrap">
              {p.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default Partners
