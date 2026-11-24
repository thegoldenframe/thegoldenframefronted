import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FiCalendar, FiPhone } from 'react-icons/fi'
import { FaCoffee } from 'react-icons/fa'
import { SiPlaystation } from 'react-icons/si'
import { PHONE } from '../../utils/constants'

const Item = ({ to, href, icon: Icon, label, primary }) => {
  const cls = ({ isActive } = {}) => `flex-1 flex flex-col items-center gap-1 py-2.5 font-body text-[9px] tracking-widest uppercase transition-colors ${primary ? 'text-gold' : isActive ? 'text-gold' : 'text-gray/70'}`
  const inner = <><Icon className={primary ? 'text-xl' : 'text-lg'} />{label}</>
  return href ? <a href={href} className={cls()}>{inner}</a> : <NavLink to={to} className={cls}>{inner}</NavLink>
}

const MobileBar = () => {
  const { pathname } = useLocation()
  if (pathname.startsWith('/booking')) return null
  return (
    <>
      <div className="h-16 lg:hidden" />
      <nav className="fixed bottom-0 inset-x-0 z-[55] lg:hidden bg-black/90 backdrop-blur-xl border-t border-gold/15 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Quick actions">
        <Item to="/booking" icon={FiCalendar} label="Book" primary />
        <Item to="/playstation" icon={SiPlaystation} label="PS5" />
        <Item to="/cafe" icon={FaCoffee} label="Cafe" />
        <Item href={`tel:${PHONE.replace(/\s/g, '')}`} icon={FiPhone} label="Call" />
      </nav>
    </>
  )
}
export default MobileBar
