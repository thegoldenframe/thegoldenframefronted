import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Lightbox = ({ image, index, total, onClose, onPrev, onNext }) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-11 h-11 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300 z-10"
            aria-label="Close"
          >
            <FiX className="text-lg" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300 z-10"
            aria-label="Previous"
          >
            <FiChevronLeft className="text-lg" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300 z-10"
            aria-label="Next"
          >
            <FiChevronRight className="text-lg" />
          </button>

          {/* Image */}
          <motion.div
            key={image.id}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="relative max-w-5xl w-full px-16 max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.src?.replace('w=600', 'w=1400')}
              alt={image.alt}
              className="w-full max-h-[80vh] object-contain"
            />

            {/* Caption */}
            <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-between px-2">
              <div>
                <p className="text-ivory font-body text-sm">{image.alt}</p>
                <p className="text-gold/60 text-xs font-body tracking-widest uppercase">{image.category}</p>
              </div>
              <span className="text-gray/50 text-xs font-body">{index + 1} / {total}</span>
            </div>
          </motion.div>

          {/* Keyboard hint */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray/30 text-xs font-body tracking-widest">
            ← → to navigate · ESC to close
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Lightbox
