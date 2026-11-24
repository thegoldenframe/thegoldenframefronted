import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GiPoolTriangle } from 'react-icons/gi'
import { MdMeetingRoom, MdSportsTennis } from 'react-icons/md'
import { FaTrophy, FaUtensils, FaWifi } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'
import SectionTitle from '../components/common/SectionTitle'
import PageWrapper from '../components/common/PageWrapper'

const SERVICES = [
  { icon: GiPoolTriangle, title: 'Snooker Tables', tag: 'Championship Play', desc: 'Full-size 12ft tables dressed in Strachan 6811 cloth, calibrated to tournament specification. Professional lighting rigs above each table ensure perfect visibility from every angle.', features: ['12ft full-size tables', 'Tournament-grade cloth', 'Professional overhead lighting', 'Cue & accessory rental'], color: 'green', link: '/tables' },
  { icon: GiPoolTriangle, title: 'Pool Tables', tag: 'Social & Competitive', desc: 'American and English pool tables for casual games and competitive play. Multiple table sizes accommodate beginners, social groups, and seasoned league players.', features: ['American & English pool', 'Multiple table sizes', 'League play available', 'Ball & cue sets included'], color: 'blue', link: '/tables' },
  { icon: MdMeetingRoom, title: 'VIP Private Suites', tag: 'Exclusive Access', desc: 'Dedicated private rooms for corporate events, celebrations, and intimate gatherings. Full privacy, climate control, and a dedicated host. Advance booking required.', features: ['Private room booking', 'Dedicated host service', 'Custom F&B catering', 'AV system available'], color: 'gold', link: '/booking' },
  { icon: FaTrophy, title: 'Tournaments', tag: 'Compete & Win', desc: 'Join our prestigious weekly and monthly tournaments. Championship-grade environment with a ranked leaderboard, cash prizes, and trophies for top competitors.', features: ['Weekly competitions', 'Cash prize pool', 'Official rankings', 'Open to all skill levels'], color: 'amber', link: '/contact' },
  { icon: MdSportsTennis, title: 'Coaching', tag: 'Improve Your Game', desc: 'One-on-one and group sessions with our resident professional coaches. Programmes designed for all skill levels — from first-timers to players preparing for competition.', features: ['1-on-1 coaching', 'Group workshops', 'Beginner to advanced', 'Video analysis available'], color: 'purple', link: '/contact' },
  { icon: FaUtensils, title: 'Food & Beverages', tag: 'Dine In Style', desc: 'A curated menu of snacks, meals, and refreshing non-alcoholic beverages. Order from your table without interrupting your game. Full dining available in our lounge area.', features: ['Snacks & full meals', 'Artisanal beverages', 'Table-side ordering', 'Vegetarian options'], color: 'rose', link: '/menu' },
]

const colorMap = {
  green:  { border: 'border-emerald-500/20 hover:border-emerald-500/40', icon: 'bg-emerald-500/10 text-emerald-400', tag: 'text-emerald-400/60' },
  blue:   { border: 'border-blue-500/20 hover:border-blue-500/40',       icon: 'bg-blue-500/10 text-blue-400',       tag: 'text-blue-400/60' },
  gold:   { border: 'border-gold/20 hover:border-gold/50',                icon: 'bg-gold/10 text-gold',               tag: 'text-gold/60' },
  amber:  { border: 'border-amber-500/20 hover:border-amber-500/40',     icon: 'bg-amber-500/10 text-amber-400',     tag: 'text-amber-400/60' },
  purple: { border: 'border-purple-500/20 hover:border-purple-500/40',   icon: 'bg-purple-500/10 text-purple-400',   tag: 'text-purple-400/60' },
  rose:   { border: 'border-rose-500/20 hover:border-rose-500/40',       icon: 'bg-rose-500/10 text-rose-400',       tag: 'text-rose-400/60' },
}

const ServicesPage = () => (
  <PageWrapper>
    {/* Hero */}
    <section className="pt-36 pb-20 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,132,84,0.05)_0%,transparent_65%)]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative max-w-3xl mx-auto">
        <span className="subtitle-luxury inline-flex items-center gap-3 mb-5"><span className="w-6 h-px bg-gold" />Our Services<span className="w-6 h-px bg-gold" /></span>
        <h1 className="heading-luxury text-5xl md:text-6xl lg:text-7xl text-ivory mb-6">
          World-Class<br /><span className="text-gold">Facilities</span>
        </h1>
        <p className="font-body text-sm text-gray/70 max-w-xl mx-auto leading-relaxed">
          From tournament-grade tables to private suites — everything you need for the ultimate billiards experience, all under one roof.
        </p>
      </motion.div>
    </section>

    {/* Services grid */}
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s, i) => {
          const c = colorMap[s.color]
          return (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`group bg-surface border ${c.border} p-7 flex flex-col transition-all duration-400 hover:bg-white/[0.03]`}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-11 h-11 ${c.icon} flex items-center justify-center flex-shrink-0 text-xl`}>
                  <s.icon />
                </div>
                <div>
                  <p className={`font-body text-[9px] tracking-[0.25em] uppercase ${c.tag} mb-1`}>{s.tag}</p>
                  <h3 className="font-heading text-xl text-ivory">{s.title}</h3>
                </div>
              </div>
              <p className="font-body text-xs text-gray/60 leading-relaxed mb-5">{s.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {s.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 font-body text-xs text-gray/70">
                    <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link to={s.link} className={`inline-flex items-center gap-2 font-body text-[10px] tracking-widest uppercase ${c.tag} hover:opacity-100 transition-opacity group-hover:gap-3 duration-300`}>
                Learn More <FiArrowRight size={11} />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>

    {/* CTA strip */}
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <SectionTitle subtitle="Ready to play?" title={<>Experience The<br /><span className="text-gold">Golden Frame</span></>} />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/booking" className="btn-gold px-10 py-4 text-xs">Book a Table</Link>
          <Link to="/contact" className="border border-gold/30 text-gold px-10 py-4 font-body text-xs tracking-widest uppercase hover:border-gold/60 hover:bg-gold/5 transition-all duration-300">Get in Touch</Link>
        </div>
      </div>
    </section>
  </PageWrapper>
)
export default ServicesPage
