import React from 'react'
import { motion } from 'framer-motion'
import { GiPoolTriangle } from 'react-icons/gi'
import { MdMeetingRoom } from "react-icons/md"
import { FaUtensils } from "react-icons/fa"
import { FaTrophy } from 'react-icons/fa'

const experiences = [
  {
    icon: GiPoolTriangle,
    title: 'Championship Play',
    desc: 'Compete on the same 12ft Strachan-clothed tables used in professional tournaments. Every detail matches competition standards.',
  },
  {
    icon: FaUtensils,
    title: 'Food & Beverages',
    desc: 'A curated menu of fresh snacks, hearty meals, and refreshing beverages — served to your table so you never have to pause the game.'
  },
  {
    icon: MdMeetingRoom,
    title: 'Private Events',
    desc: 'Host unforgettable birthdays, corporate evenings, and celebrations in our VIP suites with dedicated butler service.',
  },
  {
    icon: FaTrophy,
    title: 'Elite Coaching',
    desc: 'Elevate your game with one-on-one coaching from WPBSA-certified professionals. Tailored programmes for all skill levels.',
  },
]

const ExperienceSection = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {experiences.map(({ icon: Icon, title, desc }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.12 }}
          whileHover={{ y: -6 }}
          className="group relative glass-card gold-border p-6 overflow-hidden text-center"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon */}
          <div className="relative w-14 h-14 mx-auto mb-5">
            <div className="absolute inset-0 border border-gold/20 rotate-45 group-hover:border-gold/60 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="text-gold text-xl group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

          <h3 className="font-heading text-xl text-ivory mb-3 group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray font-body text-sm leading-relaxed">{desc}</p>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      ))}
    </div>
  )
}

export default ExperienceSection
