import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../../assets/logo.jpg'
import { FiUser, FiLogOut, FiCalendar, FiBell, FiSun, FiMoon } from 'react-icons/fi'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import useScroll from '../../hooks/useScroll'
import { CUSTOMER_NAV_LINKS } from '../../utils/constants'
import MobileMenu from './MobileMenu'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const { scrolled } = useScroll(60)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAuth } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/') }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-gold/10 shadow-[0_4px_40px_rgba(0,0,0,0.6)]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img src={logo} alt="The Golden Frame" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
              {CUSTOMER_NAV_LINKS.map(link => (
                <NavLink key={link.path} to={link.path}
                  className={({ isActive }) => `relative font-body text-[11px] tracking-[0.18em] uppercase py-2 transition-colors duration-300 group ${isActive ? 'text-gold' : 'text-gray hover:text-ivory'}`}
                >
                  {({ isActive }) => (<>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-400 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </>)}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-full border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.25 }}
                      className="block"
                    >
                      <FiSun className="text-gold text-base group-hover:text-gold-soft transition-colors" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.25 }}
                      className="block"
                    >
                      <FiMoon className="text-gold text-base group-hover:text-gold-soft transition-colors" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              {isAuth ? (
                <>
                  <Link to="/account/notifications" className="text-gray hover:text-gold transition-colors p-1"><FiBell className="text-lg" /></Link>
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(o => !o)} className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors">
                        <span className="text-gold text-xs font-bold font-heading">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                      </div>
                      <span className="font-body text-xs text-gray group-hover:text-ivory transition-colors tracking-wide">{user?.name?.split(' ')[0]}</span>
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                            className="absolute right-0 top-12 z-50 w-52 bg-surface border border-gold/15 shadow-[0_8px_40px_rgba(0,0,0,0.5)] py-2"
                          >
                            <div className="px-4 py-3 border-b border-gold/10">
                              <p className="text-ivory text-xs font-semibold font-body truncate">{user?.name}</p>
                              <p className="text-gray/60 text-[10px] font-body truncate mt-0.5">{user?.email}</p>
                            </div>
                            {[{icon:FiUser,label:'My Profile',to:'/account/profile'},{icon:FiCalendar,label:'My Bookings',to:'/account/bookings'},{icon:FiBell,label:'Notifications',to:'/account/notifications'}].map(item => (
                              <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-gray/80 hover:text-ivory hover:bg-white/5 transition-colors font-body text-xs tracking-wide"
                              >
                                <item.icon className="text-gold text-sm flex-shrink-0" />{item.label}
                              </Link>
                            ))}
                            <div className="border-t border-gold/10 mt-1 pt-1">
                              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors font-body text-xs tracking-wide">
                                <FiLogOut className="text-sm" /> Sign Out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-body text-xs tracking-widest uppercase text-gray hover:text-ivory transition-colors duration-300">Sign In</Link>
                  <Link to="/booking" className="btn-gold text-[11px] px-6 py-2.5">Book Now</Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button className="lg:hidden text-ivory hover:text-gold transition-colors duration-300 p-1" onClick={() => setMobileOpen(o => !o)}>
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><HiX className="text-2xl" /></motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><HiMenuAlt3 className="text-2xl" /></motion.span>
                )}
              </AnimatePresence>
            </button>

          </div>
        </div>
      </motion.nav>
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} navLinks={CUSTOMER_NAV_LINKS} isAuth={isAuth} user={user} onLogout={handleLogout} />
    </>
  )
}
export default Navbar
