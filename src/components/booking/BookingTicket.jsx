import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle } from 'react-icons/fi'

const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }
const hash = (str) => { let h = 7; for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h }

const Qr = ({ code }) => {
  const cells = useMemo(() => {
    const r = rng(hash(code)), n = 21, out = []
    const finder = (x, y) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (finder(x, y)) {
        const lx = x % 14 > 6 ? x - 14 : x, ly = y > 13 ? y - 14 : y
        const on = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4)
        if (on) out.push([x, y])
      } else if (r() > 0.5) out.push([x, y])
    }
    return out
  }, [code])
  return (
    <svg viewBox="0 0 21 21" className="w-28 h-28 bg-white p-1.5" shapeRendering="crispEdges" aria-label="Booking QR code (demo)">
      {cells.map(([x, y]) => <rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill="#0b0b0b" />)}
    </svg>
  )
}

const Confetti = () => {
  const parts = useMemo(() => { const r = rng(42); return Array.from({ length: 28 }, (_, i) => ({ i, x: (r() - 0.5) * 520, y: -120 - r() * 220, rot: r() * 720, c: ['#D68454', '#F2B080', '#38bdf8', '#34d399', '#f472b6'][i % 5], d: 0.9 + r() * 0.8 })) }, [])
  return (
    <div className="pointer-events-none absolute left-1/2 top-24 w-0 h-0">
      {parts.map(p => (
        <motion.span key={p.i} className="absolute w-2 h-3" style={{ background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: p.x, y: [0, p.y, 260], opacity: [1, 1, 0], rotate: p.rot }} transition={{ duration: p.d + 0.8, ease: 'easeOut' }} />
      ))}
    </div>
  )
}

const BookingTicket = ({ id, table, date, time, duration, guests, total, discountCode, isAuth }) => {
  const code = id || 'GF0000'
  const rows = [['Table', table], ['Date', date], ['Time', `${time} · ${duration} hr${duration !== 1 ? 's' : ''}`], ['Guests', guests]]
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
      <Confetti />
      <motion.div initial={{ opacity: 0, y: 60, rotateX: -25 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', damping: 18, stiffness: 120 }}
        style={{ transformPerspective: 900 }} className="max-w-sm w-full">
        <div className="bg-surface border border-gold/25 shadow-gold-lg relative">
          <div className="p-7 text-center bg-gradient-to-b from-gold/10 to-transparent">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} className="w-14 h-14 mx-auto border border-gold/50 flex items-center justify-center mb-4">
              <FiCheckCircle className="text-gold text-3xl" />
            </motion.div>
            <h2 className="font-heading text-3xl text-ivory">Booking Confirmed</h2>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mt-1">The Golden Frame</p>
          </div>
          <div className="relative h-0 border-t border-dashed border-gold/30">
            <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-black border border-gold/25" /><span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-black border border-gold/25" />
          </div>
          <div className="p-7">
            <div className="space-y-2.5 mb-6">
              {rows.map(([l, v], i) => (
                <motion.div key={l} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }} className="flex justify-between font-body text-xs">
                  <span className="text-gray/50">{l}</span><span className="text-ivory text-right">{v}</span>
                </motion.div>
              ))}
              {discountCode && <div className="flex justify-between font-body text-xs"><span className="text-gray/50">Offer</span><span className="text-emerald-400">{discountCode}</span></div>}
              <div className="flex justify-between pt-2 border-t border-gold/10"><span className="font-body text-xs text-gray/70">Total (pay at venue)</span><span className="font-heading text-2xl text-gold">₹{total}</span></div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Qr code={code} />
              <div className="text-left"><p className="font-body text-[9px] uppercase tracking-widest text-gray/40">Booking ID</p><p className="font-heading text-2xl text-gold">#{code}</p><p className="font-body text-[10px] text-gray/40 mt-1">Show at reception</p></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          <Link to="/cafe" className="btn-gold py-3 text-xs">Pre-order Food & Drinks</Link>
          {isAuth && <Link to="/account/bookings" className="btn-outline-gold py-3 text-xs">View My Bookings</Link>}
          <Link to="/" className="text-center font-body text-[10px] tracking-widest uppercase text-gray/50 hover:text-gold py-2">Back to Home</Link>
        </div>
      </motion.div>
    </div>
  )
}
export default BookingTicket
