import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/common/SectionTitle'
import GalleryGrid from '../components/gallery/GalleryGrid'
import GalleryFilter from '../components/gallery/GalleryFilter'
import Lightbox from '../components/gallery/Lightbox'
import { galleryData } from '../data/galleryData'

const HERO_BG = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80'

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxImg, setLightboxImg] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filtered =
    activeCategory === 'All'
      ? galleryData
      : galleryData.filter((img) => img.category === activeCategory)

  const openLightbox = (img, idx) => {
    setLightboxImg(img)
    setLightboxIndex(idx)
  }
  const closeLightbox = () => setLightboxImg(null)
  const prevImage = () => {
    const newIdx = (lightboxIndex - 1 + filtered.length) % filtered.length
    setLightboxIndex(newIdx)
    setLightboxImg(filtered[newIdx])
  }
  const nextImage = () => {
    const newIdx = (lightboxIndex + 1) % filtered.length
    setLightboxIndex(newIdx)
    setLightboxImg(filtered[newIdx])
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero */}
      <section className="relative pt-24 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${HERO_BG})`, filter: 'brightness(0.25)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        <div className="absolute top-28 left-8 w-14 h-14 border-l-2 border-t-2 border-gold/30" />
        <div className="absolute top-28 right-8 w-14 h-14 border-r-2 border-t-2 border-gold/30" />
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-4 mb-5">
            <div className="w-10 h-px bg-gold/50" />
            <span className="subtitle-luxury">Visual Journey</span>
            <div className="w-10 h-px bg-gold/50" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }} className="heading-luxury text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] text-ivory">
            Our <span className="gold-shimmer">Gallery</span>
          </motion.h1>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-black pt-6 pb-14 sm:pb-20 md:pb-28 lg:pb-36">
        <div className="container-luxury">
          <SectionTitle subtitle="Browse Our Collection" title="Club Highlights" className="mb-10" />
          
          {/* Filter */}
          <div className="mb-10">
            <GalleryFilter active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Count */}
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray/40 text-xs font-body tracking-widest text-center mb-8"
          >
            Showing {filtered.length} {filtered.length === 1 ? 'image' : 'images'}
            {activeCategory !== 'All' && ` in "${activeCategory}"`}
          </motion.p>

          {/* Grid */}
          <GalleryGrid items={filtered} onOpen={openLightbox} />

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray font-body text-sm">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        image={lightboxImg}
        index={lightboxIndex}
        total={filtered.length}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </motion.main>
  )
}

export default GalleryPage
