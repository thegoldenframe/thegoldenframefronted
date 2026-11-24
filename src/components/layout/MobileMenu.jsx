import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiCalendar, FiBell, FiLogOut, FiSun, FiMoon } from 'react-icons/fi'
import { PHONE } from '../../utils/constants'
import { useTheme } from '../../context/ThemeContext'

const MobileMenu = ({ isOpen, onClose, navLinks = [], isAuth, user, onLogout }) => {
  const { theme, toggleTheme } = useTheme()
  return (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed top-0 right-0 z-40 h-full w-[300px] bg-surface border-l border-gold/15 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-6 border-b border-gold/10 flex items-center justify-between">
            <div>
              <p className="font-heading text-xl font-bold text-ivory"> THE GOLDEN <span className="text-gold">FRAME</span></p>
              <p className="text-gray/50 text-[9px] tracking-[0.2em] uppercase font-body mt-0.5">Snooker & Pool Lounge</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="block">
                    <FiSun className="text-gold text-sm" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="block">
                    <FiMoon className="text-gold text-sm" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
            {navLinks.map((link, i) => (
              <motion.div key={link.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <NavLink to={link.path} onClick={onClose}
                  className={({ isActive }) => `flex items-center gap-3 py-2.5 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-200 group ${isActive ? 'text-gold' : 'text-gray/80 hover:text-ivory'}`}
                >
                  <span className="w-4 h-px bg-gold/30 group-hover:w-6 group-hover:bg-gold transition-all duration-300 flex-shrink-0" />
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Auth section */}
          <div className="px-6 py-6 border-t border-gold/10 space-y-3">
            {isAuth ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-sm font-bold font-heading">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-ivory text-xs font-semibold truncate">{user?.name}</p>
                    <p className="text-gray/50 text-[10px] truncate">{user?.email}</p>
                  </div>
                </div>
                {[{icon:FiUser,label:'My Profile',to:'/account/profile'},{icon:FiCalendar,label:'My Bookings',to:'/account/bookings'},{icon:FiBell,label:'Notifications',to:'/account/notifications'}].map(item => (
                  <Link key={item.to} to={item.to} onClick={onClose}
                    className="flex items-center gap-3 py-2 text-gray/70 hover:text-ivory transition-colors font-body text-xs tracking-wide"
                  >
                    <item.icon className="text-gold text-sm" />{item.label}
                  </Link>
                ))}
                <button onClick={() => { onLogout(); onClose() }}
                  className="w-full flex items-center gap-3 py-2.5 mt-2 text-red-400/80 hover:text-red-400 transition-colors font-body text-xs tracking-wide border-t border-gold/10 pt-3"
                >
                  <FiLogOut className="text-sm" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={onClose} className="block w-full text-center py-3 border border-gold/30 text-gold font-body text-xs tracking-widest uppercase hover:border-gold hover:bg-gold/5 transition-all duration-300">
                  Sign In
                </Link>
                <Link to="/booking" onClick={onClose} className="btn-gold block w-full text-center text-xs">
                  Book a Table
                </Link>
              </>
            )}
            <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 pt-2 text-gray/50 hover:text-gray transition-colors font-body text-[10px] tracking-wider">
              📞 {PHONE}
            </a>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
  )
}
export default MobileMenu
