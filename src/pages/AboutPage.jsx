import React from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/common/SectionTitle'
import ClubStory from '../components/about/ClubStory'
import StatsCounter from '../components/about/StatsCounter'
import Timeline from '../components/about/Timeline'
import TeamSection from '../components/about/TeamSection'
import ExperienceSection from '../components/about/ExperienceSection'
import { Link } from 'react-router-dom'

const HERO_BG = 'https://images.unsplash.com/photo-1580212206149-dd50d7d61fc3?w=1920&q=80'
const LUXURY_BG = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80'

const AboutPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Banner */}
      <section className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${HERO_BG})`, filter: 'brightness(0.28)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
        <div className="absolute top-28 left-8 w-14 h-14 border-l-2 border-t-2 border-gold/30" />
        <div className="absolute top-28 right-8 w-14 h-14 border-r-2 border-t-2 border-gold/30" />
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-4 mb-5">
            <div className="w-10 h-px bg-gold/50" />
            <span className="subtitle-luxury">Our Story</span>
            <div className="w-10 h-px bg-gold/50" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }} className="heading-luxury text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] text-ivory uppercase">
            About <span className="gold-shimmer"> The Golden Frame</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="text-gray font-body text-sm max-w-sm sm:max-w-md mx-auto mt-4 px-2">
            Six years of redefining what a billiards lounge can be.
          </motion.p>
        </div>
      </section>

      {/* Club Story */}
      <section className="section-padding bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[140px] pointer-events-none" />
        <div className="container-luxury relative z-10"><ClubStory /></div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-surface border-y border-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D68454 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="container-luxury relative z-10"><StatsCounter /></div>
      </section>

      {/* Experience */}
      <section className="section-padding bg-black">
        <div className="container-luxury">
          <SectionTitle subtitle="The Golden Frame Experience" title="A Cut Above" description="Every visit is crafted to exceed expectations. Here is what sets us apart from every other venue in Silvassa." className="mb-14" />
          <ExperienceSection />
        </div>
      </section>

      {/* Quote Banner */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${LUXURY_BG})`, filter: 'brightness(0.2)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
        <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="relative z-10 container-luxury text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="subtitle-luxury mb-5">Our Philosophy</motion.p>
          <motion.blockquote initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="font-heading text-3xl md:text-5xl text-ivory font-medium max-w-4xl mx-auto leading-tight">
            "Excellence is not an act. <span className="gold-shimmer">It is a habit</span> — and it is embedded in every corner of The Golden Frame."
          </motion.blockquote>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-gold/60 font-body text-sm tracking-widest mt-8">— Rajdev Singh, Founder</motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-black">
        <div className="container-luxury">
          <SectionTitle subtitle="Our Journey" title="Six Years of Excellence" description="From a single vision to Silvassa's most prestigious billiards lounge — the story of The Golden Frame." className="mb-16" />
          <Timeline />
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-surface">
        <div className="container-luxury">
          <SectionTitle subtitle="The People" title="Meet Our Team" description="The passionate professionals who make every visit to The Golden Frame an extraordinary experience." className="mb-14" />
          <TeamSection />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="container-luxury text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-luxury text-3xl sm:text-4xl md:text-6xl text-ivory mb-4">
            Ready to <span className="gold-shimmer">Experience</span> The Golden Frame?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="text-gray font-body text-base max-w-lg mx-auto mb-8">
            Book a table, explore membership options, or simply visit us — we'd love to welcome you.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-gold text-sm px-10 py-4">Book a Table</Link>
            <Link to="/pricing" className="btn-outline-gold text-sm px-10 py-4">View Memberships</Link>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}

export default AboutPage
