import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiUsers, FiXCircle, FiRefreshCw, FiAlertCircle } from 'react-icons/fi'
import { bookingService } from '../../services/api'
import AccountLayout from '../../components/customer/AccountLayout'

// ── shared status badge ────────────────────────────────────────────────────────
const STATUS = {
  pending:   { label: 'Pending',   cls: 'text-amber-400  border-amber-400/30  bg-amber-500/8'  },
  confirmed: { label: 'Confirmed', cls: 'text-blue-400   border-blue-400/30   bg-blue-500/8'   },
  seated:    { label: 'Seated',    cls: 'text-purple-400 border-purple-400/30 bg-purple-500/8' },
  completed: { label: 'Completed', cls: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/8' },
  cancelled: { label: 'Cancelled', cls: 'text-red-400    border-red-400/30    bg-red-500/8'    },
  no_show:   { label: 'No Show',   cls: 'text-gray/60   border-gray/20       bg-white/5'      },
}

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending
  return (
    <span className={`inline-flex px-2.5 py-1 border font-body text-[9px] tracking-widest uppercase font-medium ${s.cls}`}>
      {s.label}
    </span>
  )
}

// ── single booking card ────────────────────────────────────────────────────────
const BookingCard = ({ booking, onCancel, cancelling }) => {
  const canCancel = ['pending', 'confirmed'].includes(booking.status)
  const date = new Date(booking.date || booking.reservationDate || booking.createdAt)
  const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-surface border border-gold/10 hover:border-gold/20 transition-all duration-300 p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* ID + status */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="font-mono text-[10px] text-gold/60 tracking-wider">
              #{booking.reservationId || booking._id?.slice(-8).toUpperCase()}
            </span>
            <StatusBadge status={booking.status} />
          </div>

          {/* Table name */}
          <h3 className="font-heading text-lg text-ivory mb-3">
            {booking.table?.name || booking.tableId || 'Table Booking'}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-[11px] text-gray/55">
            <span className="flex items-center gap-1.5"><FiCalendar size={11} className="text-gold/50" />{dateStr}</span>
            {(booking.time || booking.reservationTime) && (
              <span className="flex items-center gap-1.5"><FiClock size={11} className="text-gold/50" />{booking.time || booking.reservationTime}</span>
            )}
            {booking.duration && (
              <span className="flex items-center gap-1.5"><FiClock size={11} className="text-gold/50" />{booking.duration / 60}hr</span>
            )}
            {booking.guests && (
              <span className="flex items-center gap-1.5"><FiUsers size={11} className="text-gold/50" />{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
            )}
          </div>

          {booking.notes && (
            <p className="font-body text-[11px] text-gray/40 mt-2 italic">"{booking.notes}"</p>
          )}
        </div>

        {/* Right: price + cancel */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
          {booking.estimatedPrice > 0 && (
            <p className="font-heading text-xl text-gold">₹{booking.estimatedPrice}</p>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(booking._id)}
              disabled={cancelling === booking._id}
              className="flex items-center gap-1.5 font-body text-[10px] tracking-wider uppercase text-red-400/60 hover:text-red-400 disabled:opacity-40 transition-colors border border-red-500/10 hover:border-red-500/30 px-3 py-2"
            >
              {cancelling === booking._id
                ? <FiRefreshCw size={11} className="animate-spin" />
                : <FiXCircle size={11} />
              }
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── empty state ────────────────────────────────────────────────────────────────
const Empty = ({ label }) => (
  <div className="bg-surface border border-gold/8 p-12 text-center">
    <span className="text-4xl block mb-4">📅</span>
    <p className="font-heading text-lg text-ivory/70 mb-2">{label}</p>
    <p className="font-body text-xs text-gray/40 mb-6">Ready for your next game?</p>
    <Link to="/booking" className="btn-gold px-8 py-3 text-xs">Book a Table</Link>
  </div>
)

// ── skeleton loader ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-surface border border-gold/8 p-5 animate-pulse space-y-3">
    <div className="flex gap-3">
      <div className="h-4 w-24 bg-white/8 rounded" />
      <div className="h-4 w-16 bg-white/5 rounded" />
    </div>
    <div className="h-5 w-48 bg-white/8 rounded" />
    <div className="h-3 w-64 bg-white/5 rounded" />
  </div>
)

// ── main component ─────────────────────────────────────────────────────────────
const MyBookingsPage = ({ historyMode = false }) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const params = historyMode
        ? { status: 'completed,cancelled,no_show' }
        : { status: 'pending,confirmed,seated' }
      const res = await bookingService.getMyBookings(params)
      const data = res.data?.bookings || res.data?.data?.bookings || res.data?.data || []
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load bookings. Please try again.')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [historyMode])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    setCancelling(id)
    try {
      await bookingService.cancel(id)
      setBookings(b => b.map(bk => bk._id === id ? { ...bk, status: 'cancelled' } : bk))
    } catch (err) {
      alert(err?.response?.data?.message || 'Cancellation failed.')
    } finally { setCancelling(null) }
  }

  const STATUS_FILTERS = historyMode
    ? [{ v: 'all', l: 'All' }, { v: 'completed', l: 'Completed' }, { v: 'cancelled', l: 'Cancelled' }, { v: 'no_show', l: 'No Show' }]
    : [{ v: 'all', l: 'All Active' }, { v: 'pending', l: 'Pending' }, { v: 'confirmed', l: 'Confirmed' }, { v: 'seated', l: 'Seated' }]

  const visible = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter)

  return (
    <AccountLayout title={historyMode ? 'Booking History' : 'My Bookings'}>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f.v} onClick={() => setStatusFilter(f.v)}
            className={`px-4 py-2 border font-body text-[10px] tracking-widest uppercase transition-all duration-200 ${
              statusFilter === f.v
                ? 'bg-gold text-black border-gold'
                : 'border-gold/15 text-gray/55 hover:border-gold/30 hover:text-ivory'
            }`}
          >
            {f.l}
          </button>
        ))}
        <button onClick={load} className="ml-auto p-2 border border-gold/15 text-gold/50 hover:text-gold hover:border-gold/30 transition-colors">
          <FiRefreshCw size={13} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 px-4 py-3 mb-4 font-body text-xs text-red-400">
          <FiAlertCircle size={13} /> {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : visible.length === 0 ? (
        <Empty label={historyMode ? 'No booking history yet' : 'No active bookings'} />
      ) : (
        <div className="space-y-3">
          {visible.map(b => (
            <BookingCard key={b._id} booking={b} onCancel={handleCancel} cancelling={cancelling} />
          ))}
        </div>
      )}

      {/* Quick link */}
      {!historyMode && !loading && (
        <div className="mt-6 pt-5 border-t border-gold/8 flex items-center justify-between">
          <p className="font-body text-[10px] text-gray/35">Want to see past bookings?</p>
          <Link to="/account/history" className="font-body text-[10px] text-gold/60 hover:text-gold tracking-widest uppercase transition-colors">
            View History →
          </Link>
        </div>
      )}
    </AccountLayout>
  )
}
export default MyBookingsPage
