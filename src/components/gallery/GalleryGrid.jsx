import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZoomIn } from 'react-icons/fi'

const GalleryGrid = ({ items, onOpen }) => {
  return (
    <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-3">
      <AnimatePresence>
        {items.map((img, i) => (
          <motion.div
            key={img.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="break-inside-avoid mb-3 relative group cursor-pointer overflow-hidden"
            onClick={() => onOpen(img, i)}
          >
            <div
              className={`relative overflow-hidden ${
                img.size === 'large'
                  ? 'aspect-[3/4]'
                  : img.size === 'medium'
                  ? 'aspect-square'
                  : 'aspect-[4/3]'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-400 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-2 text-center px-3">
                  <div className="w-10 h-10 border border-gold flex items-center justify-center">
                    <FiZoomIn className="text-gold text-base" />
                  </div>
                  <p className="text-ivory text-xs font-body leading-tight">{img.alt}</p>
                  <span className="text-gold/70 text-[10px] tracking-widest uppercase">{img.category}</span>
                </div>
              </div>

              {/* Gold frame on hover */}
              <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/35 transition-colors duration-400 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default GalleryGrid
