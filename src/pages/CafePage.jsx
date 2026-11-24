import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/common/PageWrapper'
import SectionTitle from '../components/common/SectionTitle'
import { FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { menuCategories, menuItems } from '../data/customerData'
import { createPortal } from 'react-dom'
import FoodImage from '../components/cafe/FoodImage'
import { foodKind } from '../utils/foodMeta'
const FoodPreview3D = React.lazy(() => import('../components/cafe/FoodPreview3D'))


const CafePage = () => {
  const [preview, setPreview] = React.useState(null)   // { item, left, top, pinned }
  const canHover = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches
  const openPreview = (item, el, pinned = false) => {
    const r = el.getBoundingClientRect()
    if (pinned) return setPreview(v => (v && v.item.id === item.id ? null : { item, pinned: true }))
    setPreview({ item, left: Math.min(Math.max(r.left + 8, 8), window.innerWidth - 216), top: Math.max(r.top - 196, 84), pinned: false })
  }
  const closePreview = () => setPreview(v => (v && v.pinned ? v : null))
  const { items: cart, add, dec, count, total, setOpen } = useCart()
  const qtyOf = id => cart.find(c => c.id === id)?.qty || 0
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
            <span className="w-6 h-px bg-gold" />The Golden Cafe<span className="w-6 h-px bg-gold" />
          </span>
          <h1 className="heading-luxury text-5xl md:text-6xl text-ivory mb-5">
            Dine While <span className="text-gold">You Play</span>
          </h1>
          <p className="font-body text-sm text-gray/60 max-w-xl mx-auto leading-relaxed mb-6">Order from your phone and we'll serve it right at your table or gaming station.</p>
          {count > 0 && (
            <button onClick={() => setOpen(true)} className="btn-gold text-xs py-3"><FiShoppingBag /> View Order · {count} item{count > 1 ? 's' : ''} · ₹{total}</button>
          )}
        </motion.div>
      </section>

      {/* Filters */}
      <div className="px-4 max-w-5xl mx-auto mb-10 sticky top-20 z-30 py-3 bg-black/85 backdrop-blur-md">
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
                  onMouseEnter={e => canHover && openPreview(item, e.currentTarget)} onMouseLeave={() => canHover && closePreview()}
                  className="group bg-surface border border-gold/8 hover:border-gold/25 p-5 flex items-start justify-between gap-4 hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/[0.02]"
                >
                  <FoodImage item={item} onClick={e => { if (!canHover) { e.stopPropagation(); openPreview(item, e.currentTarget, true) } }} />
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
                  <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                    <p className="font-heading text-lg text-gold">₹{item.price}</p>
                    {qtyOf(item.id) === 0 ? (
                      <button onClick={() => add(item)} className="flex items-center gap-1 px-3 py-1.5 border border-gold/40 text-gold font-body text-[10px] tracking-widest uppercase hover:bg-gold hover:text-black transition-all"><FiPlus size={11} /> Add</button>
                    ) : (
                      <div className="flex items-center gap-2 border border-gold/40 px-1 py-1">
                        <button onClick={() => dec(item.id)} className="w-6 h-6 flex items-center justify-center text-gold hover:bg-gold/10" aria-label="Remove one"><FiMinus size={11} /></button>
                        <span className="font-body text-xs text-ivory w-4 text-center">{qtyOf(item.id)}</span>
                        <button onClick={() => add(item)} className="w-6 h-6 flex items-center justify-center text-gold hover:bg-gold/10" aria-label="Add one"><FiPlus size={11} /></button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    {preview && createPortal(
        preview.pinned ? (
          <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setPreview(null)}>
            <div className="relative w-64 h-72 bg-surface border border-gold/30">
              <React.Suspense fallback={null}><FoodPreview3D kind={foodKind(preview.item)} name={preview.item.name} /></React.Suspense>
              <p className="absolute bottom-3 inset-x-0 text-center font-heading text-lg text-ivory">{preview.item.name}</p>
            </div>
          </div>
        ) : (
          <div className="fixed z-[80] pointer-events-none w-[208px] h-[188px] bg-surface/90 backdrop-blur-xl border border-gold/30 shadow-gold-lg" style={{ left: preview.left, top: preview.top }}>
            <React.Suspense fallback={null}><FoodPreview3D kind={foodKind(preview.item)} name={preview.item.name} /></React.Suspense>
            <span className="absolute bottom-1.5 inset-x-0 text-center font-body text-[8px] tracking-[0.25em] uppercase text-gold">{preview.item.name}</span>
          </div>
        ), document.body)}
    </PageWrapper>
  )
}
export default CafePage
