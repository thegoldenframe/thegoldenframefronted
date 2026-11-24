import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX } from 'react-icons/fi'
import SectionTitle from '../components/common/SectionTitle'
import { membershipPlans, tablePricing } from '../data/pricingData'
import { staggerContainer, staggerItem } from '../utils/animations'
import { Link } from 'react-router-dom'

const HERO_BG = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80'

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const getAdjustedPrice = (price) => {
    if (billingPeriod === 'annual') {
      return Math.floor(parseInt(price) * 10)
    }
    return price
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})`, filter: 'brightness(0.25)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="subtitle-luxury mb-4 block">
            Membership & Pricing
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="heading-luxury text-5xl sm:text-6xl md:text-8xl text-ivory">
            Simple <span className="gold-shimmer">Pricing</span>
          </motion.h1>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-body text-gray tracking-widest">
          <span>Home</span><span className="text-gold">→</span><span className="text-gold">Pricing</span>
        </div>
      </section>

      {/* Membership plans */}
      <section className="section-padding bg-black">
        <div className="container-luxury">
          <SectionTitle subtitle="Memberships" title="Choose Your Plan" description="All memberships include access to our member events, priority booking, and exclusive privileges." className="mb-10" />

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-body text-sm ${billingPeriod === 'monthly' ? 'text-ivory' : 'text-gray'}`}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(p => p === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-surface border border-gold/30 transition-colors duration-300"
            >
              <div className={`absolute top-1 w-5 h-5 bg-gold transition-all duration-300 ${billingPeriod === 'annual' ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`font-body text-sm ${billingPeriod === 'annual' ? 'text-ivory' : 'text-gray'}`}>
              Annual <span className="text-gold text-xs">(Save 17%)</span>
            </span>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {membershipPlans.map(plan => (
              <motion.div
                key={plan.id}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className={`relative overflow-hidden transition-all duration-300 ${plan.highlighted ? 'bg-gold text-black' : 'glass-card gold-border'}`}
              >
                {plan.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 text-[10px] tracking-widest uppercase font-body font-medium ${plan.highlighted ? 'bg-black/20 text-black' : 'bg-gold text-black'}`}>
                    {plan.badge}
                  </div>
                )}
                <div className="p-8">
                  <h3 className={`font-heading text-3xl font-semibold mb-2 ${plan.highlighted ? 'text-black' : 'text-ivory'}`}>{plan.name}</h3>
                  <p className={`font-body text-sm mb-6 ${plan.highlighted ? 'text-black/70' : 'text-gray'}`}>{plan.description}</p>
                  <div className={`flex items-end gap-1 mb-8 pb-8 border-b ${plan.highlighted ? 'border-black/20' : 'border-gold/10'}`}>
                    <span className={`font-body text-base ${plan.highlighted ? 'text-black/70' : 'text-gold'}`}>₹</span>
                    <span className={`font-heading text-6xl font-bold ${plan.highlighted ? 'text-black' : 'text-ivory'}`}>{getAdjustedPrice(plan.price)}</span>
                    <span className={`font-body text-sm mb-2 ${plan.highlighted ? 'text-black/70' : 'text-gray'}`}>/{billingPeriod === 'annual' ? 'yr' : 'mo'}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className={`flex items-center gap-3 font-body text-sm ${plan.highlighted ? 'text-black' : 'text-gray'}`}>
                        <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-black/20' : 'border border-gold/40'}`}>
                          <FiCheck className={`text-xs ${plan.highlighted ? 'text-black' : 'text-gold'}`} />
                        </div>
                        {feat}
                      </li>
                    ))}
                    {plan.excluded.map((feat, i) => (
                      <li key={i} className={`flex items-center gap-3 font-body text-sm opacity-40 ${plan.highlighted ? 'text-black' : 'text-gray'}`}>
                        <FiX className="text-xs flex-shrink-0" />{feat}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className={`block text-center py-3 text-xs font-body font-medium tracking-widest uppercase transition-all duration-300 ${plan.highlighted ? 'bg-black text-gold hover:bg-black/80' : 'btn-outline-gold'}`}>
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Table Pricing */}
      <section className="section-padding bg-surface">
        <div className="container-luxury">
          <SectionTitle subtitle="Pay As You Play" title="Table Pricing" description="Flexible pay-as-you-go pricing for all our tables and rooms. No membership required." className="mb-12" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/20">
                  <th className="text-left py-4 px-6 text-xs font-body tracking-widest uppercase text-gold">Table Type</th>
                  <th className="text-center py-4 px-6 text-xs font-body tracking-widest uppercase text-gold">Peak Hours</th>
                  <th className="text-center py-4 px-6 text-xs font-body tracking-widest uppercase text-gold">Off-Peak</th>
                  <th className="text-center py-4 px-6 text-xs font-body tracking-widest uppercase text-gold">Weekend</th>
                </tr>
              </thead>
              <tbody>
                {tablePricing.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className={`border-b border-gold/5 hover:bg-gold/5 transition-colors duration-300 ${i % 2 === 0 ? 'bg-black/30' : ''}`}
                  >
                    <td className="py-4 px-6 font-body text-sm text-ivory">{row.type}</td>
                    <td className="py-4 px-6 text-center font-body text-sm text-gold font-medium">{row.peak}</td>
                    <td className="py-4 px-6 text-center font-body text-sm text-gray">{row.offPeak}</td>
                    <td className="py-4 px-6 text-center font-body text-sm text-gray">{row.weekend}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 glass-card gold-border p-4"
          >
            <p className="text-gray text-xs font-body leading-relaxed">
              <span className="text-gold font-medium">Peak Hours:</span> Mon–Fri 6PM–Close, Sat–Sun All Day &nbsp;|&nbsp;
              <span className="text-gold font-medium">Off-Peak:</span> Mon–Fri 12PM–6PM
              <span className="block mt-1">All prices per hour per table. Minimum 1 hour booking. Prices exclude GST.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-black">
        <div className="container-luxury max-w-3xl">
          <SectionTitle subtitle="FAQs" title="Common Questions" className="mb-12" />
          <div className="space-y-4">
            {[
              { q: 'Can I book a table without a membership?', a: 'Absolutely. Walk-ins are welcome subject to availability. We recommend booking online or by phone to guarantee your preferred time.' },
              { q: 'How do I cancel my membership?', a: 'Members can cancel with 30 days notice at any time. Annual memberships are refundable on a pro-rata basis.' },
              { q: 'Are coaching sessions included in membership?', a: 'Gold memberships include 2 sessions per month and Platinum includes 4. Silver members can book at a discounted rate.' },
              { q: 'Can I bring guests?', a: 'Gold members can bring 2 guests per month, Platinum members can bring 4. Additional guest charges apply thereafter.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card gold-border p-6"
              >
                <h4 className="font-heading text-lg text-gold mb-2">{faq.q}</h4>
                <p className="text-gray font-body text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  )
}

export default PricingPage
