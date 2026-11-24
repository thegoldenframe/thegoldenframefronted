import React, { useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiUsers, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { GiPoolTriangle } from 'react-icons/gi'
import Skeleton3D from '../components/three/Skeleton3D'
import SectionTitle from '../components/common/SectionTitle'
import PageWrapper from '../components/common/PageWrapper'
import { tablePricing } from '../data/pricingData'

const TableViewer3D = lazy(() => import('../components/three/TableViewer3D'))

const SHOWCASE = [
  { id: 'pool', label: 'Pool', kind: 'pool', felt: '#1c5fa8', size: [2.6, 1.4], book: 'american-pool', specs: [['Size', '8 ft American'], ['Cloth', 'Pro-grade blue felt'], ['Balls', 'Aramith tournament'], ['Players', '2–4']] },
  { id: 'snooker', label: 'Snooker', kind: 'snooker', felt: '#1a6b3c', size: [3.6, 1.8], book: 'snooker-12', specs: [['Size', '10 ft & 12 ft'], ['Cloth', 'Strachan 6811'], ['Lighting', 'Overhead spot rig'], ['Players', '2']] },
]

const TABLE_DATA = [
  {
    id: 'standard-pool', type: 'pool', name: 'Standard Pool Table', img: 'https://images.unsplash.com/photo-1592947071083-e9f8832a7aad?w=800&q=80',
    peak: '₹250/hr', offPeak: '₹180/hr', weekend: '₹300/hr',
    desc: 'Ideal for casual play and beginners. Full-size American pool table with quality cloth and professional-grade balls.',
    features: ['8ft American pool', 'Aramith balls', 'House cues available', 'Seating for 6'], capacity: 2, minDuration: 1,
  },
  {
    id: 'american-pool', type: 'pool', name: 'American Pool Table', img: 'https://images.unsplash.com/photo-1628164803982-6a6f0fa8e9cc?w=800&q=80',
    peak: '₹300/hr', offPeak: '₹220/hr', weekend: '₹350/hr',
    desc: 'Premium American-style pool table with fast cloth and precision levelling. Perfect for competitive practice.',
    features: ['Pro-grade cloth', 'Precision levelled', 'Tournament balls', 'Personal cue rack'], capacity: 2, minDuration: 1,
  },
  {
    id: 'snooker-10', type: 'snooker', name: 'Snooker Table 10ft', img: 'https://images.unsplash.com/photo-1614690951822-0e1ca07da9ad?w=800&q=80',
    peak: '₹350/hr', offPeak: '₹250/hr', weekend: '₹400/hr',
    desc: 'Full-size snooker table with Strachan 6811 cloth. Meticulously maintained to the highest standards for serious players.',
    features: ['Strachan 6811 cloth', 'Professional lighting', 'Complete ball set', 'Score markers'], capacity: 2, minDuration: 1,
  },
  {
    id: 'snooker-12', type: 'snooker', name: 'Snooker Table 12ft', img: 'https://images.unsplash.com/photo-1614690951822-0e1ca07da9ad?w=800&q=80',
    peak: '₹450/hr', offPeak: '₹350/hr', weekend: '₹500/hr',
    desc: 'Championship-grade 12ft snooker table — the same specification used in professional tournaments worldwide.',
    features: ['Full 12ft table', 'Championship cloth', 'Overhead spot lighting', 'Rest & spider set'], capacity: 2, minDuration: 1,
  },
  {
    id: 'vip-suite', type: 'vip', name: 'VIP Suite', img: 'https://images.unsplash.com/photo-1574068468892-4f11c54d7c2b?w=800&q=80',
    peak: '₹1,000/hr', offPeak: '₹800/hr', weekend: '₹1,200/hr',
    desc: 'A completely private room with one table, lounge seating, a dedicated F&B host, and climate control. The ultimate experience.',
    features: ['Private room', 'Lounge seating', 'Dedicated F&B host', 'Climate controlled', 'AV system'], capacity: 8, minDuration: 2,
  },
  {
    id: 'grand-suite', type: 'vip', name: 'Grand Suite', img: 'https://images.unsplash.com/photo-1574068468892-4f11c54d7c2b?w=800&q=80',
    peak: '₹1,800/hr', offPeak: '₹1,500/hr', weekend: '₹2,200/hr',
    desc: 'Our flagship room — two full-size tables, a private bar, premium lounge, and butler service. Ideal for group events and celebrations.',
    features: ['2 full-size tables', 'Private bar setup', 'Butler service', 'Custom catering', 'Event decoration'], capacity: 16, minDuration: 2,
  },
]

const FILTERS = [
  { id: 'all', label: 'All Tables' },
  { id: 'pool', label: 'Pool' },
  { id: 'snooker', label: 'Snooker' },
  { id: 'vip', label: 'VIP Suites' },
]

const typeColor = { pool: 'text-blue-400 bg-blue-500/10', snooker: 'text-emerald-400 bg-emerald-500/10', vip: 'text-gold bg-gold/10' }

const TablesPage = () => {
  const [filter, setFilter] = useState('all')
  const [show, setShow] = useState(SHOWCASE[1])
  const visible = filter === 'all' ? TABLE_DATA : TABLE_DATA.filter(t => t.type === filter)

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-36 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,132,84,0.05)_0%,transparent_60%)]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative max-w-3xl mx-auto">
          <span className="subtitle-luxury inline-flex items-center gap-3 mb-5"><span className="w-6 h-px bg-gold" />Our Tables<span className="w-6 h-px bg-gold" /></span>
          <h1 className="heading-luxury text-5xl md:text-6xl text-ivory mb-5">
            Choose Your <span className="text-gold">Table</span>
          </h1>
          <p className="font-body text-sm text-gray/60 max-w-xl mx-auto leading-relaxed">
            From casual pool to championship snooker — every table at The Golden Frame is maintained to the highest standard.
          </p>
        </motion.div>
      </section>

      {/* 3D showcase */}
      <section className="px-4 pb-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-6 items-stretch border border-gold/10 bg-surface">
          <div className="lg:col-span-3 h-[320px] sm:h-[420px] lg:h-[480px]">
            <Suspense fallback={<Skeleton3D />}>
              <TableViewer3D key={show.id} kind={show.kind} felt={show.felt} size={show.size} className="h-full" />
            </Suspense>
          </div>
          <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
            <p className="subtitle-luxury mb-3">Interactive 3D</p>
            <div className="flex gap-2 mb-6">
              {SHOWCASE.map(t => (
                <button key={t.id} onClick={() => setShow(t)} className={`px-5 py-2 font-body text-xs tracking-widest uppercase border transition-all ${show.id === t.id ? 'bg-gold text-black border-gold' : 'border-gold/20 text-gray/70 hover:border-gold/40'}`}>{t.label}</button>
              ))}
            </div>
            <dl className="space-y-3 mb-8">
              {show.specs.map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gold/8 pb-2"><dt className="font-body text-[11px] text-gray/50 uppercase tracking-wider">{k}</dt><dd className="font-body text-xs text-ivory">{v}</dd></div>
              ))}
            </dl>
            <Link to={`/booking?table=${show.book}`} className="btn-gold text-xs py-3.5 text-center">Book {show.label} Table</Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex items-center justify-center gap-2 px-4 mb-12 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-5 py-2 font-body text-xs tracking-widest uppercase transition-all duration-300 border ${
              filter === f.id ? 'bg-gold text-black border-gold' : 'border-gold/20 text-gray/70 hover:border-gold/40 hover:text-ivory'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table cards */}
      <section className="pb-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((table, i) => (
            <motion.div key={table.id}
              layout initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-surface border border-gold/10 hover:border-gold/30 overflow-hidden transition-all duration-400 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img src={table.img} alt={table.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                <span className={`absolute top-3 left-3 px-2.5 py-1 font-body text-[9px] tracking-widest uppercase font-medium ${typeColor[table.type]}`}>
                  {table.type === 'vip' ? 'VIP Suite' : table.type === 'pool' ? 'Pool' : 'Snooker'}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading text-xl text-ivory mb-2">{table.name}</h3>
                <p className="font-body text-xs text-gray/55 leading-relaxed mb-4">{table.desc}</p>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-white/[0.025] border border-gold/8">
                  {[['Off-Peak', table.offPeak], ['Peak', table.peak], ['Weekend', table.weekend]].map(([label, price]) => (
                    <div key={label} className="text-center">
                      <p className="font-body text-[9px] text-gray/40 tracking-wide uppercase mb-0.5">{label}</p>
                      <p className="font-heading text-sm text-gold">{price}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-5 flex-1">
                  {table.features.slice(0, 4).map(f => (
                    <li key={f} className="flex items-center gap-2 font-body text-[11px] text-gray/60">
                      <FiCheckCircle size={10} className="text-gold flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-5 text-gray/40 font-body text-[10px]">
                  <span className="flex items-center gap-1.5"><FiUsers size={10} /> Up to {table.capacity} players</span>
                  <span className="flex items-center gap-1.5"><FiClock size={10} /> Min. {table.minDuration}hr</span>
                </div>

                <Link to={`/booking?table=${table.id}`} className="btn-gold text-[10px] py-3 text-center w-full block tracking-widest">
                  Book This Table
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing table */}
      <section className="py-16 px-4 border-t border-gold/8">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="Transparent Pricing" title={<>Hourly <span className="text-gold">Rates</span></>} className="mb-12" />
          <div className="overflow-x-auto">
            <table className="w-full border border-gold/10">
              <thead>
                <tr className="bg-gold/8">
                  {['Table Type', 'Peak Hours\n(6PM–11PM)', 'Off-Peak\n(10AM–6PM)', 'Weekend'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-body text-[10px] tracking-[0.2em] uppercase text-gold/80 border-b border-gold/10 whitespace-pre-line">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tablePricing.map((row, i) => (
                  <tr key={row.type} className={`border-b border-gold/8 ${i % 2 ? 'bg-white/[0.015]' : ''}`}>
                    <td className="px-5 py-4 font-body text-xs text-ivory">{row.type}</td>
                    <td className="px-5 py-4 font-heading text-sm text-gold">{row.peak}</td>
                    <td className="px-5 py-4 font-heading text-sm text-gray/70">{row.offPeak}</td>
                    <td className="px-5 py-4 font-heading text-sm text-amber-400">{row.weekend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-[10px] text-gray/40 mt-4 leading-relaxed text-center">
            * Prices include all equipment. Advance online booking recommended. Walk-in subject to availability.
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}
export default TablesPage
