import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiCheckCircle, FiRefreshCw, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { notifService } from '../../services/api'
import AccountLayout from '../../components/customer/AccountLayout'

const TYPE_ICON = {
  booking_reminder:  '📅',
  membership_expiry: '👑',
  table_time_ending: '⏰',
  low_inventory:     '📦',
  general:           '🔔',
  offer:             '🎁',
}

const SkeletonNotif = () => (
  <div className="flex gap-4 p-4 bg-surface border border-gold/8 animate-pulse">
    <div className="w-9 h-9 bg-white/8 rounded flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-40 bg-white/8 rounded" />
      <div className="h-2 w-56 bg-white/5 rounded" />
    </div>
  </div>
)

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [markingAll, setMarkingAll] = useState(false)

  const load = async () => {
    setLoading(true); setError('')
    try {
      const res = await notifService.getAll()
      const data = res.data?.notifications || res.data?.data?.notifications || res.data?.data || []
      setNotifications(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load notifications.')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    try {
      await notifService.markRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch { /* silent */ }
  }

  const markAllRead = async () => {
    setMarkingAll(true)
    try {
      await notifService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch { /* silent */ }
    finally { setMarkingAll(false) }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <AccountLayout title="Notifications">

      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-gold/15 border border-gold/25 px-2.5 py-1 font-body text-[9px] tracking-widest uppercase text-gold">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} disabled={markingAll}
              className="flex items-center gap-1.5 font-body text-[10px] tracking-wider uppercase text-gold/60 hover:text-gold disabled:opacity-40 transition-colors border border-gold/15 hover:border-gold/30 px-3 py-2"
            >
              {markingAll ? <FiRefreshCw size={10} className="animate-spin" /> : <FiCheck size={10} />}
              Mark all read
            </button>
          )}
          <button onClick={load} className="p-2 border border-gold/15 text-gold/50 hover:text-gold hover:border-gold/30 transition-colors">
            <FiRefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 px-4 py-3 mb-4 font-body text-xs text-red-400">
          <FiAlertCircle size={13} /> {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <SkeletonNotif key={i} />)}</div>
      ) : notifications.length === 0 ? (
        <div className="bg-surface border border-gold/8 p-14 text-center">
          <FiBell className="mx-auto text-4xl text-gold/20 mb-4" />
          <p className="font-heading text-lg text-ivory/60 mb-2">All caught up</p>
          <p className="font-body text-xs text-gray/40">You have no notifications at this time.</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-4 p-4 border transition-all duration-300 cursor-pointer group ${
                  n.isRead
                    ? 'bg-surface border-gold/8 hover:border-gold/18'
                    : 'bg-gold/[0.035] border-gold/18 hover:border-gold/30'
                }`}
                onClick={() => !n.isRead && markRead(n._id)}
              >
                {/* Icon */}
                <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 text-lg border ${n.isRead ? 'border-gold/10 bg-white/[0.02]' : 'border-gold/20 bg-gold/8'}`}>
                  {TYPE_ICON[n.type] || '🔔'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className={`font-body text-xs leading-snug ${n.isRead ? 'text-gray/65' : 'text-ivory/90 font-medium'}`}>
                      <span className="font-semibold">{n.title}</span>
                      {n.message && n.message !== n.title && (
                        <span className="block text-gray/50 font-normal mt-0.5">{n.message}</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-body text-[9px] text-gray/35 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </AccountLayout>
  )
}
export default NotificationsPage
