import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiArrowRight } from 'react-icons/fi'
import PageWrapper from '../components/common/PageWrapper'
import SectionTitle from '../components/common/SectionTitle'
import { faqData } from '../data/customerData'

// Clean membership plans — bar discount references replaced with F&B discount
const PLANS = [
  {
    id: 'silver', name: 'Silver', price: '1,500', period: 'month', badge: null, highlighted: false,
    tagline: 'For casual players seeking premium access',
    features: [
      { text: '10 hours table time per month',   included: true },
      { text: 'Standard table priority booking', included: true },
      { text: 'F&B discount (10%)',              included: true },
      { text: 'Access to weekly events',         included: true },
      { text: 'Locker storage',                  included: true },
      { text: 'VIP room access',                 included: false },
      { text: 'Private coaching sessions',       included: false },
      { text: 'Tournament priority entry',       included: false },
    ],
    color: 'border-gray/20 hover:border-gray/40',
    accentText: 'text-gray/70',
    accentBg: 'bg-gray/10',
  },
  {
    id: 'gold', name: 'Gold', price: '3,500', period: 'month', badge: 'Most Popular', highlighted: true,
    tagline: 'The definitive experience for serious enthusiasts',
    features: [
      { text: '30 hours table time per month',   included: true },
      { text: 'Priority booking — all tables',   included: true },
      { text: 'F&B discount (20%)',              included: true },
      { text: 'Tournament priority entry',       included: true },
      { text: '2 coaching sessions / month',     included: true },
      { text: 'VIP lounge access',               included: true },
      { text: 'Guest privileges (2/month)',      included: true },
      { text: 'Annual gala invitation',          included: false },
    ],
    color: 'border-gold/40 hover:border-gold/70',
    accentText: 'text-gold',
    accentBg: 'bg-gold/10',
  },
  {
    id: 'platinum', name: 'Platinum', price: '6,000', period: 'month', badge: 'Premium', highlighted: false,
    tagline: 'Unlimited luxury for the true connoisseur',
    features: [
      { text: 'Unlimited table time',             included: true },
      { text: 'Dedicated table reservation',      included: true },
      { text: 'F&B discount (30%)',               included: true },
      { text: 'Unlimited tournament entry',       included: true },
      { text: '4 coaching sessions / month',      included: true },
      { text: 'VIP room access (2 hrs/month)',    included: true },
      { text: 'Guest privileges (4/month)',       included: true },
      { text: 'Annual gala dinner invitation',    included: true },
    ],
    color: 'border-purple-400/30 hover:border-purple-400/60',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
  },
]

const PERKS = [
  { icon: '🎱', title: 'Guaranteed Table Access', desc: 'Members always get priority over walk-in bookings during peak hours.' },
  { icon: '🎓', title: 'Professional Coaching', desc: 'Improve your technique with sessions from our in-house certified coaches.' },
  { icon: '🏆', title: 'Tournament Access', desc: 'Enter our exclusive monthly tournaments — some open to members only.' },
  { icon: '🍽️', title: 'F&B Discounts', desc: 'Enjoy up to 30% off on our full food and beverage menu.' },
]

const Faq = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gold/10 hover:border-gold/20 transition-colors duration-300">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-body text-sm text-ivory/90">{q}</span>
        <span className={`flex-shrink-0 text-gold transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-4 font-body text-xs text-gray/60 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  )
}

const MembershipPage = () => (
  <PageWrapper>
    {/* Hero */}
    <section className="pt-36 pb-16 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,132,84,0.05)_0%,transparent_65%)]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative max-w-3xl mx-auto">
        <span className="subtitle-luxury inline-flex items-center gap-3 mb-5">
          <span className="w-6 h-px bg-gold" />Membership Plans<span className="w-6 h-px bg-gold" />
        </span>
        <h1 className="heading-luxury text-5xl md:text-6xl text-ivory mb-5">
          Unlock Exclusive <span className="text-gold">Benefits</span>
        </h1>
        <p className="font-body text-sm text-gray/60 max-w-xl mx-auto leading-relaxed">
          Join The Golden Frame as a member and enjoy priority booking, discounts, coaching sessions, and access to exclusive events — every month.
        </p>
      </motion.div>
    </section>

    {/* Perks */}
    <section className="py-12 px-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PERKS.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="text-center p-5 border border-gold/8 bg-surface"
          >
            <span className="text-3xl block mb-3">{p.icon}</span>
            <h3 className="font-heading text-sm text-ivory mb-2">{p.title}</h3>
            <p className="font-body text-[10px] text-gray/50 leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Plans */}
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Choose Your Plan" title={<>Membership <span className="text-gold">Tiers</span></>} className="mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative bg-surface border ${plan.color} p-7 flex flex-col transition-all duration-400 ${plan.highlighted ? 'shadow-[0_0_40px_rgba(214,132,84,0.12)]' : ''}`}
          >
            {plan.badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 ${plan.accentBg} border ${plan.highlighted ? 'border-gold/40' : 'border-purple-500/30'}`}>
                <span className={`font-body text-[9px] tracking-widest uppercase font-medium ${plan.accentText}`}>{plan.badge}</span>
              </div>
            )}

            <div className="mb-6">
              <p className={`font-body text-[10px] tracking-[0.25em] uppercase ${plan.accentText} mb-2`}>{plan.name}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-body text-[11px] text-gray/50">₹</span>
                <span className={`font-heading text-4xl ${plan.accentText}`}>{plan.price}</span>
                <span className="font-body text-xs text-gray/40">/{plan.period}</span>
              </div>
              <p className="font-body text-[11px] text-gray/50 mt-2 leading-relaxed">{plan.tagline}</p>
            </div>

            <div className="divider-gold mb-6 w-12" style={{ transform: 'none' }} />

            <ul className="space-y-2.5 flex-1 mb-7">
              {plan.features.map(f => (
                <li key={f.text} className={`flex items-start gap-2.5 font-body text-xs ${f.included ? 'text-gray/75' : 'text-gray/30'}`}>
                  {f.included
                    ? <FiCheck size={12} className={`${plan.accentText} flex-shrink-0 mt-0.5`} />
                    : <FiX size={12} className="text-gray/30 flex-shrink-0 mt-0.5" />
                  }
                  {f.text}
                </li>
              ))}
            </ul>

            <Link to="/contact"
              className={`text-center py-3.5 font-body text-[10px] tracking-widest uppercase transition-all duration-300 border flex items-center justify-center gap-2 ${
                plan.highlighted
                  ? 'bg-gold text-black border-gold hover:shadow-gold'
                  : `border-current ${plan.accentText} hover:bg-white/[0.04]`
              }`}
            >
              Get Started <FiArrowRight size={11} />
            </Link>
          </motion.div>
        ))}
      </div>
      <p className="text-center font-body text-[10px] text-gray/35 mt-8">
        Membership plans are monthly. Cancel anytime. Contact us to enrol or for custom corporate packages.
      </p>
    </section>

    {/* FAQ */}
    <section className="py-16 px-4 max-w-3xl mx-auto">
      <SectionTitle subtitle="Questions?" title={<>Frequently <span className="text-gold">Asked</span></>} className="mb-10" />
      <div className="space-y-2">
        {faqData.map(item => <Faq key={item.q} {...item} />)}
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-4 border-t border-gold/8 text-center">
      <h2 className="font-heading text-3xl md:text-4xl text-ivory mb-4">Still have questions?</h2>
      <p className="font-body text-sm text-gray/55 max-w-md mx-auto mb-8 leading-relaxed">Our team is happy to help you choose the right membership plan. Get in touch today.</p>
      <Link to="/contact" className="btn-gold px-10 py-4 text-xs">Contact Us</Link>
    </section>
  </PageWrapper>
)
export default MembershipPage
