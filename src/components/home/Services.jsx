import React from 'react'
import { motion } from 'framer-motion'
import { GiPoolTriangle } from 'react-icons/gi'
import { MdMeetingRoom, MdSportsTennis } from 'react-icons/md'
import { FaTrophy, FaUtensils } from 'react-icons/fa'
import SectionTitle from '../common/SectionTitle'
import { servicesData } from '../../data/servicesData'

const iconMap = {
  GiPoolTriangle,
  MdMeetingRoom,
  FaTrophy,
  MdSportsTennis,
  FaUtensils,
}

const ServiceCard = ({ service, index }) => {
  const Icon = iconMap[service.icon] || GiPoolTriangle
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      className="group relative glass-card gold-border p-5 sm:p-8 overflow-hidden cursor-default transition-shadow duration-400 hover:shadow-[0_24px_60px_rgba(214,132,84,0.14)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-gold to-gold-soft group-hover:w-full transition-all duration-500 pointer-events-none" />
      <span className="absolute bottom-3 right-4 font-heading text-[5rem] font-bold leading-none text-gold/[0.06] group-hover:text-gold/[0.1] transition-colors duration-500 select-none pointer-events-none">
        0{index + 1}
      </span>
      <div className="relative w-14 h-14 mb-7 flex-shrink-0">
        <div className="absolute inset-0 border border-gold/25 rotate-45 group-hover:border-gold/60 group-hover:shadow-gold transition-all duration-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="text-gold text-xl group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      <h3 className="font-heading text-2xl font-semibold text-ivory mb-3 group-hover:text-gold transition-colors duration-300 relative z-10">
        {service.title}
      </h3>
      <p className="text-gray font-body text-sm leading-relaxed mb-5 relative z-10">
        {service.description}
      </p>
      <ul className="space-y-2 relative z-10">
        {service.features.map((feat, i) => (
          <li key={i} className="flex items-center gap-2.5 text-xs font-body text-gray/65">
            <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
            {feat}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

const Services = () => (
  <section className="section-padding bg-surface relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.018]"
      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D68454 1px, transparent 0)', backgroundSize: '48px 48px' }}
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gold/[0.04] blur-[160px] pointer-events-none" />
    <div className="container-luxury relative z-10">
      <SectionTitle subtitle="What We Offer" title="Premium Services"
        description="Every experience at The Golden Frame is crafted for those who demand the extraordinary — from championship play to intimate VIP suites."
        className="mb-16"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </div>
    </div>
  </section>
)
export default Services
