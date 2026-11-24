import React from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../common/SectionTitle'

const ClubStory = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <SectionTitle subtitle="Who We Are" title="Born from Passion" align="left" />

        <p className="text-gray font-body text-base leading-relaxed mb-4 mt-4">
          The Golden Frame was born from a single belief: that billiards deserved a venue worthy of its prestige. Founded in 2020 by local cue sports enthusiast Rajdev Singh, we set out to create Silvassa's definitive billiards experience.
        </p>
        <p className="text-gray font-body text-base leading-relaxed mb-4">
          Every element — from our hand-selected Strachan 6811 cloth to our curated refreshment lounge — is chosen with obsessive care. We don't just offer tables; we offer an escape into a world where excellence is the baseline.
        </p>
        <p className="text-gray font-body text-base leading-relaxed">
          Today, The Golden Frame is home to over 1,500 members, 12 premium tables, and a team of passionate professionals who live and breathe the sport. We are proud to be recognised as Silvassa's finest billiards establishment.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="grid grid-cols-2 gap-2 sm:gap-3"
      >
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1614690951822-0e1ca07da9ad?w=500&q=80"
            alt="Club interior"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&q=80"
              alt="Bar"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"
              alt="Lounge"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ClubStory
