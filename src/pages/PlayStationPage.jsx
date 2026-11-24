import React, { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiMonitor, FiCheckCircle } from 'react-icons/fi'
import { SiPlaystation } from 'react-icons/si'
import PageWrapper from '../components/common/PageWrapper'
import Skeleton3D from '../components/three/Skeleton3D'
import SectionTitle from '../components/common/SectionTitle'
import { psStations, psGames } from '../data/playstationData'

const PlayStation3D = lazy(() => import('../components/three/PlayStation3D'))

const PlayStationPage = () => (
  <PageWrapper>
    <section className="pt-32 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(56,189,248,0.10)_0%,transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(214,132,84,0.07)_0%,transparent_55%)]" />
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center lg:text-left">
          <span className="subtitle-luxury inline-flex items-center gap-3 mb-5"><span className="w-6 h-px bg-gold" />PlayStation Lounge</span>
          <h1 className="heading-luxury text-5xl md:text-6xl text-ivory mb-5">Next-Gen <span className="text-gold">Gaming</span></h1>
          <p className="font-body text-sm text-gray/60 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
            PS5 stations with 4K displays, DualSense controllers and surround sound. Play solo, face a friend or bring the whole squad — with the cafe a tap away.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link to="/booking?table=ps-duo" className="btn-gold text-xs py-3.5">Book a Station</Link>
            <Link to="/cafe" className="btn-outline-gold text-xs py-3.5">Order Snacks</Link>
          </div>
        </motion.div>
        <div className="h-[320px] sm:h-[420px] lg:h-[500px] border border-gold/10 bg-black/40">
          <Suspense fallback={<Skeleton3D />}>
            <PlayStation3D className="h-full" />
          </Suspense>
        </div>
      </div>
    </section>

    <section className="py-16 px-4 max-w-7xl mx-auto">
      <SectionTitle subtitle="Gaming Setups" title={<>Pick Your <span className="text-gold">Station</span></>} className="mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {psStations.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -6 }} className="bg-surface border border-gold/10 hover:border-sky-400/40 p-7 flex flex-col transition-colors">
            <div className="w-12 h-12 bg-sky-500/10 text-sky-400 flex items-center justify-center text-2xl mb-5"><SiPlaystation /></div>
            <h3 className="font-heading text-2xl text-ivory mb-2">{s.label}</h3>
            <p className="font-body text-xs text-gray/55 leading-relaxed mb-4">{s.desc}</p>
            <div className="flex gap-4 text-gray/50 font-body text-[10px] mb-4">
              <span className="flex items-center gap-1.5"><FiMonitor size={11} />{s.screen}</span>
              <span className="flex items-center gap-1.5"><FiUsers size={11} />Up to {s.players}</span>
            </div>
            <ul className="space-y-1.5 mb-5 flex-1">
              {s.features.map(f => <li key={f} className="flex items-center gap-2 font-body text-[11px] text-gray/60"><FiCheckCircle size={10} className="text-gold" />{f}</li>)}
            </ul>
            <div className="flex items-end justify-between mb-4 p-3 bg-white/[0.025] border border-gold/8">
              <div><p className="font-body text-[9px] uppercase tracking-wide text-gray/40">Off-peak</p><p className="font-heading text-lg text-gold">₹{s.offPeakRate}/hr</p></div>
              <div className="text-right"><p className="font-body text-[9px] uppercase tracking-wide text-gray/40">Peak</p><p className="font-heading text-lg text-gold">₹{s.peakRate}/hr</p></div>
            </div>
            <Link to={`/booking?table=${s.id}`} className="btn-gold text-[10px] py-3 w-full tracking-widest">Book This Station</Link>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="py-16 px-4 border-t border-gold/8">
      <div className="max-w-6xl mx-auto">
        <SectionTitle subtitle="Game Library" title={<>Play What You <span className="text-gold">Love</span></>} className="mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {psGames.map((g, i) => (
            <motion.div key={g.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }} className="relative overflow-hidden border border-gold/10 p-5 h-28 flex flex-col justify-end"
              style={{ background: `linear-gradient(145deg, ${g.color}33, transparent 70%)` }}>
              <p className="font-heading text-lg text-ivory leading-tight">{g.name}</p>
              <p className="font-body text-[10px] text-gray/50 tracking-wide">{g.genre} · {g.players} players</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageWrapper>
)
export default PlayStationPage
