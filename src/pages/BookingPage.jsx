import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiClock, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { bookingService } from '../services/api'
import PageWrapper from '../components/common/PageWrapper'
import { tablePricing } from '../data/pricingData'
import FloorPlan from '../components/booking/FloorPlan'
import BookingTicket from '../components/booking/BookingTicket'
import { psStations } from '../data/playstationData'

const TABLE_OPTIONS = [
  { id: 'standard-pool',  label: 'Standard Pool Table',    type: 'pool',    peakRate: 250,  offPeakRate: 180 },
  { id: 'american-pool',  label: 'American Pool Table',    type: 'pool',    peakRate: 300,  offPeakRate: 220 },
  { id: 'snooker-10',     label: 'Snooker Table 10ft',     type: 'snooker', peakRate: 350,  offPeakRate: 250 },
  { id: 'snooker-12',     label: 'Snooker Table 12ft',     type: 'snooker', peakRate: 450,  offPeakRate: 350 },
  { id: 'vip-suite',      label: 'VIP Suite (1 table)',     type: 'vip',     peakRate: 1000, offPeakRate: 800 },
  { id: 'grand-suite',    label: 'Grand Suite (2 tables)', type: 'vip',     peakRate: 1800, offPeakRate: 1500 },
  ...psStations.map(p => ({ id: p.id, label: p.label, type: 'playstation', peakRate: p.peakRate, offPeakRate: p.offPeakRate })),
]

const TIME_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
  '19:00','19:30','20:00','20:30','21:00','21:30',
]

// Demo-only: deterministic fake "already booked" slots
const isBooked = (tableId, date, slot) => {
  if (!tableId || !date) return false
  let h = 0
  for (const c of `${tableId}${date}${slot}`) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 5 === 0
}

const ADDONS = [
  { id: 'a1', label: '☕ Cold Coffee ×2', price: 198 },
  { id: 'a2', label: '🍟 Loaded Fries', price: 179 },
  { id: 'a3', label: '🍕 Margherita Pizza', price: 329 },
  { id: 'a4', label: '🍫 Brownie Blast', price: 149 },
]
// Demo offer codes: pct = % off table price, freeHours = hours free
const OFFER_CODES = {
  MORNING30: { pct: 30, label: '30% off' }, STUDENT20: { pct: 20, label: '20% off' }, GROUP5: { pct: 10, label: '10% off' },
  CORP2026: { pct: 15, label: '15% off' }, WELCOME1HR: { freeHours: 1, label: '1 hour free' }, BDAYGF: { freeHours: 1, label: '1 hour free' },
}

const DURATIONS = [1, 1.5, 2, 2.5, 3, 4]

const typeColor = {
  pool:    'text-blue-400   border-blue-500/30   bg-blue-500/5',
  snooker: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
  vip:     'text-gold        border-gold/30        bg-gold/5',
  playstation: 'text-sky-400 border-sky-500/30 bg-sky-500/5',
}

const isPeakHour = (time) => {
  const [h] = time.split(':').map(Number)
  return h >= 18
}

const calcPrice = (tableId, time, duration) => {
  const table = TABLE_OPTIONS.find(t => t.id === tableId)
  if (!table) return 0
  const rate = isPeakHour(time) ? table.peakRate : table.offPeakRate
  return Math.round(rate * duration)
}

const STEPS = ['Select Table', 'Date & Time', 'Review & Confirm']

const BookingPage = () => {
  const [searchParams] = useSearchParams()
  const { isAuth, user } = useAuth()
  const navigate = useNavigate()

  const [view, setView] = useState('plan')
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(null)
  const [codeMsg, setCodeMsg] = useState('')
  const [addons, setAddons] = useState([])
  const [step, setStep] = useState(searchParams.get('table') ? 1 : 0)
  const [cat, setCat] = useState(() => TABLE_OPTIONS.find(t => t.id === searchParams.get('table'))?.type || 'all')
  const [tableId,   setTableId]   = useState(searchParams.get('table') || '')
  const [date,      setDate]      = useState('')
  const [time,      setTime]      = useState('')
  const [duration,  setDuration]  = useState(1)
  const [guests,    setGuests]    = useState(2)
  const [notes,     setNotes]     = useState('')
  const [guestName, setGuestName] = useState(user?.name || '')
  const [guestPhone,setGuestPhone]= useState(user?.phone || '')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [confirmed, setConfirmed] = useState(null)

  const selectedTable = TABLE_OPTIONS.find(t => t.id === tableId)
  const estimatedPrice = tableId && time ? calcPrice(tableId, time, duration) : 0
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const rate = selectedTable ? (time && isPeakHour(time) ? selectedTable.peakRate : selectedTable.offPeakRate) : 0
  const discount = applied ? Math.min(estimatedPrice, applied.pct ? Math.round(estimatedPrice * applied.pct / 100) : Math.round(rate * Math.min(applied.freeHours, duration))) : 0
  const addonsTotal = ADDONS.filter(a => addons.includes(a.id)).reduce((n, a) => n + a.price, 0)
  const finalTotal = estimatedPrice - discount + addonsTotal
  const applyCode = () => {
    const c = OFFER_CODES[code.trim().toUpperCase()]
    if (c) { setApplied({ ...c, code: code.trim().toUpperCase() }); setCodeMsg('') } else { setApplied(null); setCodeMsg('Invalid code. Try MORNING30 or STUDENT20.') }
  }

  const canProceedStep0 = !!tableId
  const canProceedStep1 = !!(date && time)

  const handleConfirm = async () => {
    if (!isAuth && (!guestName || !guestPhone)) { setError('Please enter your name and phone number.'); return }
    setLoading(true); setError('')
    try {
      const payload = {
        tableId, date, time, duration: duration * 60,
        guests, notes,
        ...(isAuth ? {} : { guestName, guestPhone }),
      }
      const res = await bookingService.create(payload)
      setConfirmed(res.data?.booking || res.data?.data || payload)
    } catch (err) {
      if (!err?.response) {
        const local = { id: 'GF' + Math.floor(1000 + Math.random() * 9000), tableId, date, time, duration: duration * 60, guests, guestName, guestPhone }
        try { localStorage.setItem('gf_last_booking', JSON.stringify(local)) } catch {}
        setConfirmed(local)
      } else setError(err.response?.data?.message || 'Booking failed. Please try again or call us.')
    } finally { setLoading(false) }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <PageWrapper>
        <BookingTicket id={confirmed.id || confirmed._id} table={selectedTable?.label} date={date} time={time} duration={duration} guests={guests}
          total={finalTotal} discountCode={applied?.code} isAuth={isAuth} />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="subtitle-luxury inline-flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-gold" />Reserve Your Table<span className="w-6 h-px bg-gold" />
            </span>
            <h1 className="heading-luxury text-4xl md:text-5xl text-ivory">
              Book a <span className="text-gold">Session</span>
            </h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 text-xs font-heading ${
                    i < step ? 'bg-gold border-gold text-black'
                    : i === step ? 'border-gold text-gold'
                    : 'border-gold/20 text-gray/40'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <p className={`font-body text-[9px] tracking-wider uppercase mt-1.5 hidden sm:block ${i === step ? 'text-gold' : 'text-gray/40'}`}>{label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mb-5 transition-colors duration-300 ${i < step ? 'bg-gold' : 'bg-gold/15'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step panels */}
          <AnimatePresence mode="wait">
            {/* ── STEP 0: Select Table ── */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-2xl text-ivory mb-4">Select a Table or Station</h2>
                <div className="flex gap-2 flex-wrap mb-5">
                  {[['all','All'],['pool','Pool'],['snooker','Snooker'],['vip','VIP'],['playstation','PlayStation']].map(([id, l]) => (
                    <button key={id} onClick={() => setCat(id)} className={`px-4 py-2 font-body text-[10px] tracking-widest uppercase border transition-all ${cat === id ? 'bg-gold text-black border-gold' : 'border-gold/20 text-gray/70 hover:border-gold/40'}`}>{l}</button>
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  {[['plan', 'Floor Plan'], ['list', 'List']].map(([id, l]) => (
                    <button key={id} onClick={() => setView(id)} className={`px-4 py-1.5 font-body text-[10px] tracking-widest uppercase border transition-all ${view === id ? 'border-gold text-gold bg-gold/10' : 'border-gold/15 text-gray/60 hover:border-gold/30'}`}>{l}</button>
                  ))}
                </div>
                {view === 'plan' && <div className="mb-6"><FloorPlan value={tableId} onSelect={setTableId} />{selectedTable && <p className="font-body text-xs text-gold mt-3 text-center">Selected: {selectedTable.label}</p>}</div>}
                <div className={`${view === 'plan' ? 'hidden' : 'grid'} grid-cols-1 sm:grid-cols-2 gap-3 mb-8`}>
                  {TABLE_OPTIONS.filter(t => cat === 'all' || t.type === cat).map(table => (
                    <button key={table.id} onClick={() => setTableId(table.id)}
                      className={`text-left p-4 border transition-all duration-300 ${
                        tableId === table.id
                          ? 'border-gold bg-gold/8 shadow-[0_0_20px_rgba(214,132,84,0.1)]'
                          : 'border-gold/12 bg-surface hover:border-gold/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className={`font-body text-[9px] tracking-widest uppercase ${typeColor[table.type]} px-1.5 py-0.5 border`}>{table.type}</span>
                          <p className="font-heading text-base text-ivory mt-2">{table.label}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-heading text-sm text-gold">from ₹{table.offPeakRate}</p>
                          <p className="font-body text-[9px] text-gray/40">/hr</p>
                        </div>
                      </div>
                      {tableId === table.id && <div className="mt-2 flex items-center gap-1.5 font-body text-[10px] text-gold"><FiCheckCircle size={10} /> Selected</div>}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} disabled={!canProceedStep0}
                  className="btn-gold w-full py-4 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue — Choose Date & Time
                </button>
              </motion.div>
            )}

            {/* ── STEP 1: Date & Time ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-2xl text-ivory mb-6">Choose Date & Time</h2>

                <div className="space-y-6 mb-8">
                  {/* Date */}
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/60 mb-3 flex items-center gap-2"><FiCalendar size={11} /> Booking Date</label>
                    <input type="date" value={date} min={today} max={maxDateStr} onChange={e => { setDate(e.target.value); setTime('') }}
                      className="w-full bg-white/[0.03] border border-gold/15 hover:border-gold/30 focus:border-gold/50 text-ivory font-body text-sm py-3.5 px-4 outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Time slots */}
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/60 mb-3 flex items-center gap-2"><FiClock size={11} /> Start Time</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                      {TIME_SLOTS.map(slot => {
                        const booked = isBooked(tableId, date, slot)
                        return (
                          <button key={slot} onClick={() => !booked && setTime(slot)} disabled={booked} title={booked ? 'Already booked' : ''}
                            className={`py-2.5 font-body text-[10px] border transition-all duration-200 ${
                              booked ? 'border-gold/5 text-gray/25 line-through cursor-not-allowed bg-white/[0.02]'
                              : time === slot ? 'bg-gold text-black border-gold scale-105' : 'border-gold/12 text-gray/60 hover:border-gold/30 hover:text-ivory'
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                    {time && (
                      <p className={`font-body text-[10px] mt-2 ${isPeakHour(time) ? 'text-amber-400/70' : 'text-emerald-400/70'}`}>
                        {isPeakHour(time) ? '⚡ Peak hours apply (6PM–11PM)' : '✓ Off-peak rate applies (10AM–6PM)'}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/60 mb-3 flex items-center gap-2"><FiClock size={11} /> Duration</label>
                    <div className="flex gap-2 flex-wrap">
                      {DURATIONS.map(d => (
                        <button key={d} onClick={() => setDuration(d)}
                          className={`px-5 py-2.5 border font-body text-xs transition-all duration-200 ${
                            duration === d ? 'bg-gold text-black border-gold' : 'border-gold/15 text-gray/60 hover:border-gold/30 hover:text-ivory'
                          }`}
                        >
                          {d}hr{d !== 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/60 mb-3 flex items-center gap-2"><FiUsers size={11} /> Number of Guests</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-9 h-9 border border-gold/20 text-gold hover:border-gold hover:bg-gold/5 transition-all font-heading text-lg flex items-center justify-center">−</button>
                      <span className="font-heading text-2xl text-ivory w-8 text-center">{guests}</span>
                      <button onClick={() => setGuests(g => Math.min(16, g + 1))} className="w-9 h-9 border border-gold/20 text-gold hover:border-gold hover:bg-gold/5 transition-all font-heading text-lg flex items-center justify-center">+</button>
                    </div>
                  </div>

                  {/* Price preview */}
                  {tableId && time && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-gold/5 border border-gold/20 p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-body text-[10px] text-gray/60 uppercase tracking-widest">Estimated Total</p>
                        <p className="font-body text-[10px] text-gray/40 mt-0.5">{selectedTable?.label} · {duration}hr{duration !== 1 ? 's' : ''} · {isPeakHour(time) ? 'Peak' : 'Off-peak'}</p>
                      </div>
                      <p className="font-heading text-3xl text-gold">₹{estimatedPrice}</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-6 py-4 border border-gold/20 text-gold font-body text-xs tracking-widest uppercase hover:border-gold/40 transition-all">← Back</button>
                  <button onClick={() => setStep(2)} disabled={!canProceedStep1}
                    className="flex-1 btn-gold py-4 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue — Review Booking
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Review & Confirm ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-2xl text-ivory mb-6">Review & Confirm</h2>

                {/* Summary */}
                <div className="bg-surface border border-gold/12 p-6 mb-6 space-y-3">
                  <p className="font-body text-[10px] tracking-widest uppercase text-gold/70 mb-4">Booking Summary</p>
                  {[
                    ['Table',    selectedTable?.label || '—'],
                    ['Date',     date || '—'],
                    ['Time',     time ? `${time} (${isPeakHour(time) ? 'Peak' : 'Off-peak'})` : '—'],
                    ['Duration', `${duration} hour${duration !== 1 ? 's' : ''}`],
                    ['Guests',   guests],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between border-b border-gold/6 pb-3 last:border-0 last:pb-0">
                      <span className="font-body text-[11px] text-gray/50">{label}</span>
                      <span className="font-body text-xs text-ivory">{val}</span>
                    </div>
                  ))}
                  {discount > 0 && <div className="flex items-center justify-between font-body text-xs"><span className="text-emerald-400">Offer {applied.code} ({applied.label})</span><span className="text-emerald-400">−₹{discount}</span></div>}
                  {addonsTotal > 0 && <div className="flex items-center justify-between font-body text-xs"><span className="text-gray/60">Cafe add-ons</span><span className="text-ivory">+₹{addonsTotal}</span></div>}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-body text-xs text-gray/70">Estimated Total</span>
                    <motion.span key={finalTotal} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="font-heading text-2xl text-gold">₹{finalTotal}</motion.span>
                  </div>
                  <p className="font-body text-[9px] text-gray/35">* Final amount due at venue. Online booking is confirmation only.</p>
                </div>

                {/* Offer code */}
                <div className="mb-6">
                  <p className="font-body text-[10px] text-gray/60 uppercase tracking-widest mb-2">Offer Code</p>
                  <div className="flex gap-2">
                    <input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. MORNING30" className="flex-1 bg-white/[0.03] border border-gold/15 focus:border-gold/50 text-ivory placeholder-gray/30 font-body text-sm py-3 px-4 outline-none uppercase" />
                    <button onClick={applyCode} className="px-5 border border-gold/40 text-gold font-body text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-all">Apply</button>
                  </div>
                  {applied && <p className="font-body text-[11px] text-emerald-400 mt-2">✓ {applied.code} applied — {applied.label}</p>}
                  {codeMsg && <p className="font-body text-[11px] text-red-400/90 mt-2">{codeMsg}</p>}
                </div>

                {/* Cafe add-ons */}
                <div className="mb-6">
                  <p className="font-body text-[10px] text-gray/60 uppercase tracking-widest mb-2">Add Food & Drinks (ready when you arrive)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ADDONS.map(a => { const on = addons.includes(a.id); return (
                      <button key={a.id} onClick={() => setAddons(v => on ? v.filter(x => x !== a.id) : [...v, a.id])}
                        className={`flex items-center justify-between px-4 py-3 border font-body text-xs transition-all ${on ? 'border-gold bg-gold/10 text-ivory' : 'border-gold/12 text-gray/70 hover:border-gold/30'}`}>
                        <span>{a.label}</span><span className="text-gold">{on ? '✓' : '+'} ₹{a.price}</span>
                      </button>) })}
                  </div>
                </div>

                {/* Guest details if not logged in */}
                {!isAuth && (
                  <div className="mb-6 space-y-4">
                    <p className="font-body text-[10px] text-gray/60 uppercase tracking-widest">Your Contact Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/60">Full Name *</label>
                        <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Your name"
                          className="w-full bg-white/[0.03] border border-gold/15 hover:border-gold/30 focus:border-gold/50 text-ivory placeholder-gray/30 font-body text-sm py-3.5 px-4 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/60">Phone Number *</label>
                        <input value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91 99000 00000" type="tel"
                          className="w-full bg-white/[0.03] border border-gold/15 hover:border-gold/30 focus:border-gold/50 text-ivory placeholder-gray/30 font-body text-sm py-3.5 px-4 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <p className="font-body text-[10px] text-gray/40">
                      <Link to="/login" className="text-gold/70 hover:text-gold underline">Sign in</Link> to track and manage your bookings easily.
                    </p>
                  </div>
                )}

                {/* Special requests */}
                <div className="mb-6 space-y-1.5">
                  <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/60">Special Requests (optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any special requirements, accessibility needs, or preferences…"
                    className="w-full bg-white/[0.03] border border-gold/15 hover:border-gold/30 focus:border-gold/50 text-ivory placeholder-gray/30 font-body text-sm py-3.5 px-4 outline-none transition-all resize-none"
                  />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 px-4 py-3 mb-5"
                  >
                    <FiAlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={14} />
                    <p className="font-body text-xs text-red-400/90">{error}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-4 border border-gold/20 text-gold font-body text-xs tracking-widest uppercase hover:border-gold/40 transition-all">← Back</button>
                  <button onClick={handleConfirm} disabled={loading}
                    className="flex-1 btn-gold py-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Confirming…' : `Confirm Booking — ₹${finalTotal}`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  )
}
export default BookingPage
