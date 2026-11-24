import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'
import useScroll from '../../hooks/useScroll'

const ScrollToTop = () => {
  const { scrollY } = useScroll()

  return (
    <AnimatePresence>
      {scrollY > 500 && (
        <motion.button
          key="scroll-top-btn"
          initial={{ opacity: 0, scale: 0.5, y: 16 }}
          animate={{ opacity: 1, scale: 1,   y: 0 }}
          exit={{    opacity: 0, scale: 0.5, y: 16 }}
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{  scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-7 right-7 z-50 w-11 h-11
                     border border-gold/35 bg-black/80 backdrop-blur-md
                     flex items-center justify-center text-gold
                     hover:bg-gold hover:text-black hover:border-gold
                     transition-colors duration-300 shadow-gold"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="text-base" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
