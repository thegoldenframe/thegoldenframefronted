import React from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable section heading with subtitle eyebrow, gold divider, and optional description.
 * @param {string}  subtitle   - Small uppercase label above the heading
 * @param {string}  title      - Main heading text (supports JSX / spans for partial colouring)
 * @param {string}  description - Optional paragraph below divider
 * @param {'center'|'left'|'right'} align
 * @param {string}  className  - Extra class names on the wrapper
 * @param {boolean} compact    - If true, removes internal margins for tight layouts
 */
const SectionTitle = ({ subtitle, title, description, align = 'center', className = '', compact = false }) => {
  const alignClass = {
    center: 'text-center items-center',
    left:   'text-left  items-start',
    right:  'text-right items-end',
  }[align] ?? 'text-center items-center'

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>

      {/* Subtitle eyebrow */}
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-3 subtitle-luxury ${compact ? 'mb-0' : 'mb-3'}`}
        >
          <span className="w-6 h-px bg-gold" />
          {subtitle}
          <span className="w-6 h-px bg-gold" />
        </motion.span>
      )}

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={`heading-luxury text-4xl md:text-5xl lg:text-6xl text-ivory ${compact ? 'mb-0' : ''}`}
      >
        {title}
      </motion.h2>

      {/* Gold divider */}
      {!compact && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className={`divider-gold my-4 ${align === 'center' ? 'mx-auto' : ''}`}
          style={{ transformOrigin: align === 'right' ? 'right' : 'left' }}
        />
      )}

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className={`font-body text-sm leading-relaxed text-gray max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {description}
        </motion.p>
      )}

    </div>
  )
}

export default SectionTitle
