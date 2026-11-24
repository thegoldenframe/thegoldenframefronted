import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiCalendar, FiBell, FiLogOut, FiArrowLeft } from 'react-icons/fi'
import { MdHistory } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import PageWrapper from '../common/PageWrapper'

const NAV = [
  { to: '/account/profile',       icon: FiUser,     label: 'My Profile' },
  { to: '/account/bookings',      icon: FiCalendar, label: 'My Bookings' },
  { to: '/account/history',       icon: MdHistory,  label: 'Booking History' },
  { to: '/account/notifications', icon: FiBell,     label: 'Notifications' },
]

const AccountLayout = ({ children, title }) => {
  const { user, logout } = useAuth()

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Back link */}
          <Link to="/"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-widest uppercase text-gray/50 hover:text-gold transition-colors mb-8"
          >
            <FiArrowLeft size={11} /> Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-64 flex-shrink-0"
            >
              {/* User card */}
              <div className="bg-surface border border-gold/10 p-5 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 border border-gold/30 flex items-center justify-center bg-gold/8 flex-shrink-0">
                    <span className="font-heading text-gold font-bold text-lg">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-sm text-ivory truncate">{user?.name}</p>
                    <p className="font-body text-[10px] text-gray/45 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="bg-surface border border-gold/10 divide-y divide-gold/6">
                {NAV.map(item => (
                  <NavLink key={item.to} to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-3.5 font-body text-xs tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'text-gold bg-gold/6 border-l-2 border-l-gold pl-[18px]'
                          : 'text-gray/60 hover:text-ivory hover:bg-white/[0.025]'
                      }`
                    }
                  >
                    <item.icon size={14} className="flex-shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 font-body text-xs tracking-wide text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                >
                  <FiLogOut size={14} className="flex-shrink-0" /> Sign Out
                </button>
              </nav>
            </motion.aside>

            {/* Main content */}
            <motion.main
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              {title && (
                <div className="mb-6">
                  <h1 className="font-heading text-2xl text-ivory">{title}</h1>
                  <div className="w-10 h-px bg-gold mt-2" />
                </div>
              )}
              {children}
            </motion.main>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
export default AccountLayout
