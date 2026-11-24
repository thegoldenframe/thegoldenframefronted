import React from 'react'
import { motion } from 'framer-motion'
import { galleryCategories } from '../../data/galleryData'

const GalleryFilter = ({ active, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-wrap justify-center gap-3"
    >
      {galleryCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative px-5 py-2 text-xs font-body tracking-widest uppercase transition-all duration-300 overflow-hidden group ${
            active === cat
              ? 'bg-gold text-black shadow-gold'
              : 'border border-gold/20 text-gray hover:border-gold/60 hover:text-gold'
          }`}
        >
          {/* Animated underline for inactive */}
          {active !== cat && (
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
          )}
          {cat}
        </button>
      ))}
    </motion.div>
  )
}

export default GalleryFilter
