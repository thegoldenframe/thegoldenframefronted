import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = ({ children, title, subtitle, footer }) => (
  <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
    {/* Background texture */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,132,84,0.04)_0%,transparent_70%)]" />
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTIsMTc1LDU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

    <div className="relative w-full max-w-md">
      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Link to="/" className="inline-flex flex-col items-center gap-2 group">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border border-gold/40 rotate-45 group-hover:border-gold transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading font-bold text-gold text-lg">G</span>
            </div>
          </div>
          <p className="font-heading text-xl font-bold text-ivory tracking-widest mt-1">
             THE GOLDEN <span className="text-gold">FRAME</span>
          </p>
          <p className="text-gray/40 text-[9px] tracking-[0.3em] uppercase font-body -mt-1">Snooker & Pool Lounge</p>
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="bg-surface border border-gold/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-7">
          <h1 className="font-heading text-2xl text-ivory font-semibold mb-1">{title}</h1>
          {subtitle && <p className="font-body text-xs text-gray/60 tracking-wide mt-2">{subtitle}</p>}
          <div className="divider-gold mx-auto mt-4" />
        </div>
        {children}
      </motion.div>

      {/* Footer */}
      {footer && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center font-body text-xs text-gray/50 mt-5 tracking-wide"
        >
          {footer}
        </motion.p>
      )}
    </div>
  </div>
)
export default AuthLayout
