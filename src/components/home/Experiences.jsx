import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GiPoolTriangle } from 'react-icons/gi'
import { SiPlaystation } from 'react-icons/si'
import { FaCoffee } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'
import SectionTitle from '../common/SectionTitle'

const ITEMS = [
  { icon: GiPoolTriangle, title: 'Pool & Snooker', text: 'Tournament-grade tables, interactive 3D previews and instant booking.', to: '/tables', cta: 'Explore Tables', tone: 'text-emerald-400 bg-emerald-500/10', glow: 'rgba(16,185,129,0.18)' },
  { icon: SiPlaystation, title: 'PlayStation', text: 'PS5 stations on 4K displays — solo, duo or full squad lounges.', to: '/playstation', cta: 'See Setups', tone: 'text-sky-400 bg-sky-500/10', glow: 'rgba(56,189,248,0.18)' },
  { icon: FaCoffee, title: 'The Cafe', text: 'Snacks, meals and fresh drinks ordered from your phone, served at your table.', to: '/cafe', cta: 'Order Now', tone: 'text-amber-400 bg-amber-500/10', glow: 'rgba(245,158,11,0.18)' },
]

const Experiences = () => (
  <section className="section-padding px-4 relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <SectionTitle subtitle="Under One Roof" title={<>Play. Game. <span className="text-gold">Dine.</span></>} className="mb-14" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ITEMS.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
            whileHover={{ y: -8, rotateX: 2 }} style={{ background: `radial-gradient(circle at 50% 0%, ${it.glow}, transparent 65%)`, transformPerspective: 800 }}
            className="bg-surface border border-gold/10 hover:border-gold/35 p-8 flex flex-col transition-colors">
            <div className={`w-14 h-14 ${it.tone} flex items-center justify-center text-3xl mb-6`}><it.icon /></div>
            <h3 className="font-heading text-2xl text-ivory mb-3">{it.title}</h3>
            <p className="font-body text-xs text-gray/60 leading-relaxed mb-6 flex-1">{it.text}</p>
            <Link to={it.to} className="inline-flex items-center gap-2 font-body text-[10px] tracking-widest uppercase text-gold hover:gap-3 transition-all">{it.cta} <FiArrowRight size={12} /></Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)
export default Experiences
