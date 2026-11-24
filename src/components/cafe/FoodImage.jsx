import React, { useState } from 'react'
import { EMOJI, TONE, photoUrl } from '../../utils/foodMeta'

/* Real photo when /images/menu/<slug>.jpg exists, otherwise the illustrated tile. */
const FoodImage = ({ item, className = '', onClick }) => {
  const [failed, setFailed] = useState(false)
  return (
    <div onClick={onClick}
      className={`relative w-16 h-16 flex-shrink-0 overflow-hidden border border-gold/15 bg-gradient-to-br ${TONE[item.category] || ''} to-transparent flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 ${className}`}>
      {!failed
        ? <img src={photoUrl(item)} alt={item.name} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 w-full h-full object-cover" />
        : <span aria-hidden="true">{EMOJI[item.name] || '🍽️'}</span>}
      <span className="absolute bottom-0 right-0 px-1 bg-black/60 text-[7px] tracking-widest text-gold leading-4 opacity-0 group-hover:opacity-100 transition-opacity">3D</span>
    </div>
  )
}
export default FoodImage
