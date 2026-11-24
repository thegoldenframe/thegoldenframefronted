import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCheck, FiArrowRight } from 'react-icons/fi'
import SectionTitle from '../common/SectionTitle'

const highlights = [
  'Tournament-grade 12ft snooker tables',
  'Strachan 6811 professional cloth',
  'Championship-level Aramith balls',
  'Expert WPBSA-certified coaches',
  'Private members VIP lounge',
  'Corporate events & private hire',
]

const About = () => (
  <section className="section-padding bg-black relative overflow-hidden">
    {/* Glow */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/[0.04] blur-[130px] pointer-events-none" />

    <div className="container-luxury">
      <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">

        {/* ── Image collage ── */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Main image */}
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1580212206149-dd50d7d61fc3?w=800&q=80"
              alt="Premium snooker table at The Golden Frame"
              className="w-full aspect-[4/5] object-cover hover:scale-[1.03] transition-transform duration-700"
              loading="lazy"
            />
            {/* Shadow frame */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border border-gold/15 -z-10" />
          </div>

          {/* Floating secondary image - hidden on mobile to prevent overflow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="hidden sm:block absolute -bottom-8 -right-4 w-36 sm:w-40 h-36 sm:h-40 overflow-hidden border-4 border-black shadow-gold-lg z-10"
          >
            <img
              src="https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&q=80"
              alt="Premium VIP lounge"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Gold badge - repositioned for mobile */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -8 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="absolute top-4 left-2 sm:-left-5 w-16 sm:w-20 h-16 sm:h-20 bg-gold flex flex-col items-center justify-center shadow-gold z-10"
          >
            <span className="font-heading text-2xl font-bold text-black leading-none">6+</span>
            <span className="font-body text-[8px] tracking-wide uppercase text-black/70 text-center mt-0.5 leading-tight">Years<br/>Excellence</span>
          </motion.div>
        </motion.div>

        {/* ── Text content ── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionTitle
            subtitle="Our Story"
            title="A Legacy of Refined Play"
            align="left"
          />

          <p className="text-gray font-body text-sm leading-relaxed mt-2 mb-3">
            Since 2020, The Golden Frame has redefined the billiards experience in Silvassa. Born from a passion for the sport and an uncompromising vision of luxury, we created a sanctuary where every detail speaks to excellence.
          </p>
          <p className="text-gray font-body text-sm leading-relaxed mb-8">
            From hand-selected tournament-grade tables to our curated refreshment lounge and exclusive VIP suites — we offer the finest billiards environment in the region.
          </p>

          {/* Highlights grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-9">
            {highlights.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="flex items-center gap-3 text-sm font-body text-gray"
              >
                <div className="w-5 h-5 border border-gold/35 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-gold text-[11px]" />
                </div>
                {item}
              </motion.li>
            ))}
          </ul>

          <Link
            to="/about"
            className="btn-outline-gold text-[11px] inline-flex items-center gap-2"
          >
            Discover Our Story
            <FiArrowRight />
          </Link>
        </motion.div>

      </div>
    </div>
  </section>
)

export default About
