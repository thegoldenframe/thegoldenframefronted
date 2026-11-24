import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/common/PageWrapper'
import SectionTitle from '../components/common/SectionTitle'
import { menuCategories, menuItems } from '../data/customerData'

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [vegOnly, setVegOnly] = useState(false)

  const filtered = menuItems.filter(item => {
    const catMatch = activeCategory === 'all' || item.category === activeCategory
    const vegMatch = !vegOnly || item.veg
    return catMatch && vegMatch
  })

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-36 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,132,84,0.05)_0%,transparent_65%)]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative max-w-3xl mx-auto">
          <span className="subtitle-luxury inline-flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-gold" />Food & Beverages<span className="w-6 h-px bg-gold" />
          </span>
          <h1 className="heading-luxury text-5xl md:text-6xl text-ivory mb-5">
            Dine While <span className="text-gold">You Play</span>
          </h1>
        </motion.div>
      </section>

      {/* Filters */}
      <div className="px-4 max-w-5xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 font-body text-[10px] tracking-widest uppercase border transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-gold text-black border-gold'
                  : 'border-gold/20 text-gray/70 hover:border-gold/40 hover:text-ivory'
              }`}
            >
              All Items
            </button>
            {menuCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 font-body text-[10px] tracking-widest uppercase border transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-gold text-black border-gold'
                    : 'border-gold/20 text-gray/70 hover:border-gold/40 hover:text-ivory'
                }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Veg toggle */}
          <button
            onClick={() => setVegOnly(v => !v)}
            className={`flex items-center gap-2.5 px-4 py-2.5 border font-body text-[10px] tracking-widest uppercase transition-all duration-300 ${
              vegOnly
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-gold/20 text-gray/60 hover:border-gold/30'
            }`}
          >
            <span className={`w-3.5 h-3.5 border-2 flex items-center justify-center flex-shrink-0 ${vegOnly ? 'border-emerald-500' : 'border-gray/40'}`}>
              {vegOnly && <span className="w-1.5 h-1.5 bg-emerald-500 block" />}
            </span>
            Veg Only
          </button>
        </div>

        {/* Result count */}
        <p className="font-body text-[10px] text-gray/40 tracking-wide mt-4">
          Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' && ` in ${menuCategories.find(c => c.id === activeCategory)?.label}`}
          {vegOnly && ' · Vegetarian only'}
        </p>
      </div>

      {/* Menu grid */}
      <section className="pb-24 px-4 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-4xl mb-4">🍽️</p>
              <p className="font-body text-sm text-gray/50">No items match your filters.</p>
              <button onClick={() => { setActiveCategory('all'); setVegOnly(false) }} className="mt-4 font-body text-xs text-gold/70 hover:text-gold underline transition-colors">
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group bg-surface border border-gold/8 hover:border-gold/25 p-5 flex items-start justify-between gap-4 transition-all duration-300 hover:bg-white/[0.02]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {/* Veg/Non-veg indicator */}
                      <span className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center ${item.veg ? 'border-emerald-500' : 'border-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </span>
                      <h3 className="font-heading text-base text-ivory leading-tight">{item.name}</h3>
                      {item.popular && (
                        <span className="px-1.5 py-0.5 bg-gold/10 border border-gold/20 text-gold font-body text-[8px] tracking-widest uppercase flex-shrink-0">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="font-body text-[11px] text-gray/50 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-heading text-lg text-gold">₹{item.price}</p>
                    <p className="font-body text-[9px] text-gray/35 tracking-wide">per serving</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageWrapper>
  )
}
export default MenuPage
