import React from 'react'
import { motion } from 'framer-motion'
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { staggerContainer, staggerItem } from '../../utils/animations'

const team = [
  {
    name: 'Rajdev Singh',
    role: 'Founder & Director',
    img: 'https://i.pravatar.cc/400?img=52',
    bio: 'Former competitive snooker player with over 15 years of experience promoting cue sports in the region.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Nikita Patel',
    role: 'Club Manager',
    img: 'https://i.pravatar.cc/400?img=49',
    bio: 'Experienced manager with a decade of luxury venue management and events coordination.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Vikram Rathore',
    role: 'Head Coach',
    img: 'https://i.pravatar.cc/400?img=57',
    bio: 'Certified cue sports trainer and national-level tournament veteran. Mentored over 100 players.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    name: 'Pooja Sharma',
    role: 'Events Director',
    img: 'https://i.pravatar.cc/400?img=44',
    bio: 'Specialist in bespoke corporate events, tournaments, and private entertainment experiences.',
    socials: { instagram: '#', linkedin: '#' },
  },
]

const TeamSection = () => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {team.map((member, i) => (
        <motion.div
          key={i}
          variants={staggerItem}
          whileHover={{ y: -8 }}
          className="group text-center"
        >
          {/* Image */}
          <div className="relative overflow-hidden mb-5">
            <img
              src={member.img}
              alt={member.name}
              className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            {/* Overlay with socials */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-400 flex items-center justify-center gap-3">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                <a
                  href={member.socials.instagram}
                  className="w-9 h-9 border border-gold/50 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300"
                >
                  <FaInstagram className="text-sm" />
                </a>
                <a
                  href={member.socials.linkedin}
                  className="w-9 h-9 border border-gold/50 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
              </div>
            </div>
            {/* Gold bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>

          <h3 className="font-heading text-xl text-ivory group-hover:text-gold transition-colors duration-300 mb-1">
            {member.name}
          </h3>
          <p className="text-gold text-xs font-body tracking-[0.25em] uppercase mb-3">{member.role}</p>
          <p className="text-gray text-xs font-body leading-relaxed px-2">{member.bio}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default TeamSection
