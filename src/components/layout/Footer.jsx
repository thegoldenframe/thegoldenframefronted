import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { CUSTOMER_NAV_LINKS as NAV_LINKS, PHONE, EMAIL, ADDRESS, WORKING_HOURS } from '../../utils/constants'
import logo from '../../assets/logo.jpg'

const socials = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebookF, href: '#', label: 'Facebook'  },
  { icon: FaXTwitter,  href: '#', label: 'Twitter'   },
  { icon: FaYoutube,   href: '#', label: 'YouTube'   },
]

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  const handleSub = e => {
    e.preventDefault()
    if (email) { setSubbed(true); setEmail('') }
  }

  return (
    <footer className="relative bg-surface border-t border-gold/10 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Dot grid bg */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D68454 1px, transparent 0)', backgroundSize: '44px 44px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-10 py-12 sm:py-16 lg:py-20">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-5 group">
              <img src={logo} alt="The Golden Frame" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-gray/65 font-body text-xs leading-relaxed mb-6">
              Silvassa's premier billiards & pool destination. Where tradition meets luxury in an atmosphere of unparalleled refinement.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 border border-gold/20 flex items-center justify-center text-gray hover:text-gold hover:border-gold transition-all duration-300"
                >
                  <Icon className="text-xs" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.35em] uppercase text-gold mb-5">Navigation</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:block sm:space-y-2.5">
              {NAV_LINKS.map(link => (
                <li key={link.path} className="min-w-0">
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray/65 hover:text-ivory font-body text-xs tracking-wide transition-colors duration-300 group"
                  >
                    <span className="w-3 h-px bg-gold/30 group-hover:w-5 group-hover:bg-gold transition-all duration-300 flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.35em] uppercase text-gold mb-5">Opening Hours</h4>
            <ul className="space-y-3">
              {WORKING_HOURS.map((item, i) => (
                <li key={i} className="border-b border-gold/[0.08] pb-3 last:border-0 last:pb-0">
                  <p className="text-ivory/75 font-body text-[11px] tracking-wide">{item.day}</p>
                  <p className="text-gold font-body text-xs mt-0.5">{item.hours}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.35em] uppercase text-gold mb-5">Contact</h4>
            <ul className="space-y-3 mb-6">
              {[
                { icon: FiPhone, text: PHONE, href: `tel:${PHONE}` },
                { icon: FiMail,  text: EMAIL, href: `mailto:${EMAIL}` },
                { icon: FiMapPin,text: ADDRESS, href: '#' },
              ].map(({ icon: Icon, text, href }, i) => (
                <li key={i}>
                  <a href={href} className="flex items-start gap-3 text-gray/65 hover:text-ivory transition-colors duration-300 group">
                    <Icon className="text-gold text-sm flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-body text-xs leading-relaxed">{text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <p className="text-gray/45 font-body text-[10px] tracking-wider mb-2 uppercase">Newsletter</p>
            {subbed ? (
              <p className="text-gold font-body text-xs flex items-center gap-2">
                <FiArrowRight /> Subscribed! Thank you.
              </p>
            ) : (
              <form onSubmit={handleSub} className="flex w-full max-w-full">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 min-w-0 w-full bg-black/50 border border-gold/15 px-3 py-2 text-ivory text-[11px] font-body outline-none focus:border-gold/50 transition-colors duration-300 placeholder:text-gray/30"
                />
                <button type="submit" className="btn-gold px-4 py-2 text-xs flex-shrink-0">→</button>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gold/[0.08] py-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-center sm:text-left">
          <p className="text-gray/35 text-[11px] font-body tracking-wide">
            © {new Date().getFullYear()} The Golden Frame Devloped by the Urvin Patel. All rights reserved.
          </p>
          <div className="flex items-center flex-wrap justify-center gap-x-5 gap-y-2">
            <a href="#" className="text-gray/35 hover:text-gold text-[11px] font-body tracking-wide transition-colors duration-300 whitespace-nowrap">Privacy Policy</a>
            <a href="#" className="text-gray/35 hover:text-gold text-[11px] font-body tracking-wide transition-colors duration-300 whitespace-nowrap">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
