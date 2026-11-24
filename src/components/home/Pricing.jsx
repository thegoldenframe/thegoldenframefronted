import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCheck, FiX, FiArrowRight } from 'react-icons/fi'
import SectionTitle from '../common/SectionTitle'
import { membershipPlans } from '../../data/pricingData'

const PricingCard = ({ plan, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -8 }}
    className={`relative overflow-hidden flex flex-col transition-all duration-300 ${
      plan.highlighted
        ? 'bg-gold shadow-gold-lg'
        : 'glass-card gold-border hover:shadow-[0_20px_50px_rgba(214,132,84,0.12)]'
    }`}
  >
    {/* Badge */}
    {plan.badge && (
      <div className={`absolute top-4 right-4 px-3 py-1 text-[9px] tracking-widest uppercase font-body font-semibold ${
        plan.highlighted ? 'bg-black/20 text-black' : 'bg-gold text-black'
      }`}>
        {plan.badge}
      </div>
    )}

    <div className="p-5 sm:p-8 flex flex-col flex-1">
      {/* Name + desc */}
      <h3 className={`font-heading text-3xl font-semibold mb-1 ${plan.highlighted ? 'text-black' : 'text-ivory'}`}>
        {plan.name}
      </h3>
      <p className={`font-body text-xs mb-6 ${plan.highlighted ? 'text-black/65' : 'text-gray'}`}>
        {plan.description}
      </p>

      {/* Price */}
      <div className={`flex items-end gap-1 pb-7 mb-7 border-b ${plan.highlighted ? 'border-black/20' : 'border-gold/10'}`}>
        <span className={`font-body text-sm mb-2 ${plan.highlighted ? 'text-black/60' : 'text-gold'}`}>₹</span>
        <span className={`font-heading text-6xl font-bold leading-none ${plan.highlighted ? 'text-black' : 'text-ivory'}`}>
          {plan.price}
        </span>
        <span className={`font-body text-xs mb-2 ${plan.highlighted ? 'text-black/60' : 'text-gray'}`}>/mo</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className={`flex items-start gap-3 font-body text-xs leading-relaxed ${plan.highlighted ? 'text-black' : 'text-gray'}`}>
            <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlighted ? 'bg-black/15' : 'border border-gold/35'}`}>
              <FiCheck className={`text-[10px] ${plan.highlighted ? 'text-black' : 'text-gold'}`} />
            </div>
            {f}
          </li>
        ))}
        {plan.excluded.map((f, i) => (
          <li key={i} className={`flex items-start gap-3 font-body text-xs opacity-35 ${plan.highlighted ? 'text-black' : 'text-gray'}`}>
            <FiX className="text-[10px] flex-shrink-0 mt-0.5" />{f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        to="/pricing"
        className={`mt-auto flex items-center justify-center gap-2 py-3.5 text-[11px] font-body font-medium tracking-widest uppercase transition-all duration-300 ${
          plan.highlighted
            ? 'bg-black text-gold hover:bg-black/80'
            : 'border border-gold text-gold hover:bg-gold hover:text-black hover:shadow-gold'
        }`}
      >
        Choose Plan <FiArrowRight />
      </Link>
    </div>
  </motion.div>
)

const Pricing = () => (
  <section className="section-padding bg-black relative overflow-hidden">
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/[0.04] blur-[130px] pointer-events-none" />

    <div className="container-luxury relative z-10">
      <SectionTitle
        subtitle="Membership"
        title="Choose Your Plan"
        description="Join the most exclusive billiards lounge in Silvassa. Select the membership that best suits your lifestyle and ambitions."
        className="mb-16"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {membershipPlans.map((plan, i) => (
          <PricingCard key={plan.id} plan={plan} index={i} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-gray/40 font-body text-xs mt-8 tracking-wider"
      >
        All memberships include member events access and priority booking. Prices exclude GST.
      </motion.p>
    </div>
  </section>
)

export default Pricing
