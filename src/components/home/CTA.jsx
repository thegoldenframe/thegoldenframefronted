import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const CTA = () => (
  <section className="relative py-20 sm:py-28 md:py-36 overflow-hidden">
    {/* BG image */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1920&q=80')`,
        filter: 'brightness(0.22)',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/85" />

    {/* Glow orbs */}
    <div className="absolute top-1/2 left-1/4  -translate-y-1/2 w-80 h-80 bg-gold/[0.08] rounded-full blur-[120px]" />
    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-gold/[0.08] rounded-full blur-[120px]" />

    {/* Top/bottom rule */}
    <div className="absolute top-10 left-10 right-10 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
    <div className="absolute bottom-10 left-10 right-10 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

    <div className="relative z-10 container-luxury text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-3 mb-6"
      >
        <div className="w-8 h-px bg-gold/60" />
        <span className="subtitle-luxury">Limited Memberships Available</span>
        <div className="w-8 h-px bg-gold/60" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-ivory mb-6 leading-tight"
      >
        Join the <span className="gold-shimmer">Elite</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-gray font-body text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed"
      >
        Become part of Silvassa's most exclusive billiards community.
        Unlimited access, VIP privileges, and a world of luxury awaits.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4"
      >
        <Link to="/pricing" className="btn-gold text-[11px] sm:text-xs px-8 sm:px-10 py-3 sm:py-4 glow-pulse w-full xs:w-auto text-center">
          View Memberships
        </Link>
        <Link to="/contact" className="btn-outline-gold text-[11px] sm:text-xs px-8 sm:px-10 py-3 sm:py-4 inline-flex items-center justify-center gap-2 w-full xs:w-auto">
          Contact Us <FiArrowRight />
        </Link>
      </motion.div>
    </div>
  </section>
)

export default CTA
