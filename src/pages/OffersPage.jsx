import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCopy, FiCheck, FiArrowRight, FiClock } from 'react-icons/fi'
import { offersData } from '../data/customerData'
import PageWrapper from '../components/common/PageWrapper'
import SectionTitle from '../components/common/SectionTitle'

const CopyCode = ({ code }) => {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handle}
      className="flex items-center gap-2 bg-black/30 border border-gold/20 px-3 py-2 hover:border-gold/50 transition-all duration-300 group"
    >
      <span className="font-mono text-xs text-gold tracking-widest">{code}</span>
      {copied
        ? <FiCheck size={12} className="text-emerald-400 flex-shrink-0" />
        : <FiCopy size={12} className="text-gold/50 group-hover:text-gold flex-shrink-0 transition-colors" />
      }
    </button>
  )
}

const OffersPage = () => (
  <PageWrapper>
    {/* Hero */}
    <section className="pt-36 pb-16 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,132,84,0.06)_0%,transparent_65%)]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }} className="relative max-w-3xl mx-auto"
      >
        <span className="subtitle-luxury inline-flex items-center gap-3 mb-5">
          <span className="w-6 h-px bg-gold" />Offers & Promotions<span className="w-6 h-px bg-gold" />
        </span>
        <h1 className="heading-luxury text-5xl md:text-6xl text-ivory mb-5">
          Exclusive <span className="text-gold">Deals</span>
        </h1>
        <p className="font-body text-sm text-gray/60 max-w-xl mx-auto leading-relaxed">
          Take advantage of our current promotions and save on your next visit.
          Copy a promo code and use it when booking — it's that simple.
        </p>
      </motion.div>
    </section>

    {/* Offers grid */}
    <section className="pb-24 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offersData.map((offer, i) => (
          <motion.div key={offer.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.07 }}
            className={`group relative bg-gradient-to-br ${offer.color} border border-gold/10 hover:border-gold/30 p-6 flex flex-col transition-all duration-400 overflow-hidden`}
          >
            {/* Background icon watermark */}
            <span className="absolute -right-3 -top-3 text-7xl opacity-[0.07] select-none pointer-events-none">
              {offer.icon}
            </span>

            {/* Tag */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 px-2.5 py-1 font-body text-[9px] tracking-widest uppercase text-gold">
                {offer.icon} {offer.tag}
              </span>
              {offer.validTill !== 'Ongoing' && (
                <span className="flex items-center gap-1 font-body text-[9px] text-gray/40">
                  <FiClock size={9} /> Till {offer.validTill}
                </span>
              )}
            </div>

            {/* Content */}
            <h3 className="font-heading text-xl text-ivory mb-1">{offer.title}</h3>
            <p className="font-body text-sm text-gold mb-3">{offer.subtitle}</p>
            <p className="font-body text-xs text-gray/55 leading-relaxed flex-1 mb-5">{offer.desc}</p>

            {/* Promo code */}
            <div className="space-y-2">
              <p className="font-body text-[9px] text-gray/40 tracking-widest uppercase">Use promo code</p>
              <div className="flex items-center gap-2">
                <CopyCode code={offer.code} />
              </div>
            </div>

            {/* CTA */}
            <Link to="/booking"
              className="mt-5 inline-flex items-center gap-2 font-body text-[10px] tracking-widest uppercase text-gold/70 hover:text-gold transition-colors group-hover:gap-3 duration-300"
            >
              Book Now <FiArrowRight size={11} />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Banner */}
    <section className="py-16 px-4 border-t border-gold/8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface border border-gold/15 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="subtitle-luxury mb-2">Never Miss a Deal</p>
            <h2 className="font-heading text-3xl text-ivory mb-3">
              Get Offers <span className="text-gold">Directly</span>
            </h2>
            <p className="font-body text-xs text-gray/55 max-w-sm leading-relaxed">
              Register for a free account to receive exclusive member-only offers,
              birthday rewards, and early access to new promotions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link to="/register" className="btn-gold px-8 py-3.5 text-xs text-center">
              Create Free Account
            </Link>
            <Link to="/contact" className="border border-gold/25 text-gold px-8 py-3.5 font-body text-xs tracking-widest uppercase hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 text-center">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  </PageWrapper>
)
export default OffersPage
