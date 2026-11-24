import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import SectionTitle from '../components/common/SectionTitle'
import ContactForm from '../components/contact/ContactForm'
import ContactInfo from '../components/contact/ContactInfo'
import { PHONE, EMAIL, ADDRESS } from '../utils/constants'
import { staggerContainer, staggerItem } from '../utils/animations'

const HERO_BG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80'

const contactCards = [
  { icon: FiPhone, label: 'Call Us', value: PHONE, href: `tel:${PHONE}`},
  { icon: FiMail, label: 'Email Us', value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: FiMapPin, label: 'Visit Us', value: '4th Floor, Sahajanand Integrity, Kilvani Rd, Park City ', href: '#', sub: 'Silvassa, India 396230' },
]

const ContactPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero */}
      <section className="relative pt-20 h-[35vh] min-h-[280px] flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${HERO_BG})`, filter: 'brightness(0.22)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        <div className="absolute top-24 left-8 w-14 h-14 border-l-2 border-t-2 border-gold/30" />
        <div className="absolute top-24 right-8 w-14 h-14 border-r-2 border-t-2 border-gold/30" />
        <div className="relative z-10 text-center px-4 pt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 h-px bg-gold/50" />
            <span className="subtitle-luxury">Get In Touch</span>
            <div className="w-10 h-px bg-gold/50" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }} className="heading-luxury text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] text-ivory">
            Contact <span className="gold-shimmer">Us</span>
          </motion.h1>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-8 bg-surface border-b border-gold/10">
        <div className="container-luxury">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {contactCards.map(({ icon: Icon, label, value, href, sub }, i) => (
              <motion.a
                key={i}
                href={href}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="glass-card gold-border p-7 flex items-start gap-4 group cursor-pointer transition-all duration-300 hover:shadow-gold"
              >
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <Icon className="text-gold text-base group-hover:text-black transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-xs font-body tracking-widest uppercase text-gold/70 mb-1">{label}</p>
                  <p className="text-ivory font-body text-sm font-medium leading-snug mb-1">{value}</p>
                  <p className="text-gray/55 font-body text-xs">{sub}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-10 md:py-12 lg:py-14 bg-black">
        <div className="container-luxury">
          <SectionTitle subtitle="Send a Message" title="Write to Us" align="center" />
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-6">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="flex flex-col"
            >
              <ContactForm />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="flex flex-col h-full"
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>
    </motion.main>
  )
}

export default ContactPage
