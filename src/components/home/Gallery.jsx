import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZoomIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SectionTitle from '../common/SectionTitle'
import Lightbox from '../gallery/Lightbox'
import { galleryData, galleryCategories } from '../../data/galleryData'

const PREVIEW = galleryData.slice(0, 9)

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxImg, setLightboxImg]       = useState(null)
  const [lightboxIndex, setLightboxIndex]   = useState(0)

  const filtered = activeCategory === 'All'
    ? PREVIEW
    : galleryData.filter(i => i.category === activeCategory).slice(0, 9)

  const open  = (img, idx) => { setLightboxImg(img); setLightboxIndex(idx) }
  const close = ()          => setLightboxImg(null)
  const prev  = ()          => {
    const n = (lightboxIndex - 1 + filtered.length) % filtered.length
    setLightboxIndex(n); setLightboxImg(filtered[n])
  }
  const next  = ()          => {
    const n = (lightboxIndex + 1) % filtered.length
    setLightboxIndex(n); setLightboxImg(filtered[n])
  }

  return (
    <section className="section-padding bg-surface relative overflow-hidden">
      <div className="container-luxury">
        <SectionTitle
          subtitle="Visual Journey"
          title="Inside The Golden Frame"
          description="A glimpse into the world of luxury billiards — where every corner tells a story."
          className="mb-12"
        />

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {galleryCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-[11px] font-body tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold text-black shadow-gold'
                  : 'border border-gold/20 text-gray hover:border-gold/50 hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <motion.div layout className="columns-2 md:columns-3 gap-3">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{    opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="break-inside-avoid mb-3 relative group cursor-pointer overflow-hidden"
                onClick={() => open(img, i)}
              >
                <div className={`relative overflow-hidden ${
                  img.size === 'large'  ? 'aspect-[3/4]' :
                  img.size === 'medium' ? 'aspect-square'  : 'aspect-[4/3]'
                }`}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-400 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 text-center px-2">
                      <div className="w-10 h-10 border border-gold flex items-center justify-center">
                        <FiZoomIn className="text-gold" />
                      </div>
                      <p className="text-ivory text-[11px] font-body">{img.alt}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 transition-colors duration-400 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/gallery" className="btn-outline-gold text-[11px]">
            View Full Gallery
          </Link>
        </motion.div>
      </div>

      <Lightbox
        image={lightboxImg}
        index={lightboxIndex}
        total={filtered.length}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}

export default Gallery
