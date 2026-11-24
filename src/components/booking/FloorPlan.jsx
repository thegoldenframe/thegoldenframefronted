import React, { useMemo } from 'react'

// [id, label, x, y, w, h, zone]
const SPOTS = [
  ['standard-pool', 'Pool 1', 30, 40, 120, 70, 'pool'],
  ['american-pool', 'Pool 2', 30, 130, 120, 70, 'pool'],
  ['snooker-10', 'Snooker 10ft', 190, 40, 150, 80, 'snooker'],
  ['snooker-12', 'Snooker 12ft', 190, 140, 150, 90, 'snooker'],
  ['vip-suite', 'VIP Suite', 390, 30, 180, 100, 'vip'],
  ['grand-suite', 'Grand Suite', 390, 150, 180, 100, 'vip'],
  ['ps-duo', 'PS5 Duo', 30, 270, 150, 70, 'ps'],
  ['ps-squad', 'PS5 Squad', 200, 270, 170, 70, 'ps'],
  ['ps-vip', 'PS5 VIP Pod', 390, 270, 180, 70, 'ps'],
]
const COLORS = { pool: '#60a5fa', snooker: '#34d399', vip: '#D68454', ps: '#38bdf8' }

// Demo-only: some tables appear "in use right now"
const busyNow = (id) => { let h = 0; for (const c of id + new Date().getHours()) h = (h * 17 + c.charCodeAt(0)) >>> 0; return h % 4 === 0 }

const FloorPlan = ({ value, onSelect }) => {
  const busy = useMemo(() => Object.fromEntries(SPOTS.map(s => [s[0], busyNow(s[0])])), [])
  return (
    <div className="border border-gold/15 bg-[#07140f] p-2 sm:p-4">
      <svg viewBox="0 0 600 370" className="w-full h-auto" role="group" aria-label="Venue floor plan">
        <defs><pattern id="fp-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#D68454" strokeOpacity="0.06" /></pattern></defs>
        <rect width="600" height="370" fill="url(#fp-grid)" />
        <rect x="8" y="8" width="584" height="354" fill="none" stroke="#D68454" strokeOpacity="0.25" strokeDasharray="6 6" />
        {[['POOL ZONE', 90, 24], ['SNOOKER HALL', 265, 24], ['VIP SUITES', 480, 18], ['PLAYSTATION LOUNGE', 300, 258]].map(([t, x, y]) => (
          <text key={t} x={x} y={y} textAnchor="middle" fontSize="9" letterSpacing="3" fill="#D68454" fillOpacity="0.55">{t}</text>
        ))}
        {SPOTS.map(([id, label, x, y, w, h, zone]) => {
          const sel = value === id, isBusy = busy[id], c = COLORS[zone]
          return (
            <g key={id} role="button" tabIndex={isBusy ? -1 : 0} aria-label={`${label}${isBusy ? ' in use' : ''}`} aria-pressed={sel}
              onClick={() => !isBusy && onSelect(id)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && !isBusy && onSelect(id)}
              style={{ cursor: isBusy ? 'not-allowed' : 'pointer', outline: 'none' }}>
              <rect x={x} y={y} width={w} height={h} rx="6" fill={isBusy ? '#13241c' : c} fillOpacity={isBusy ? 1 : sel ? 0.35 : 0.14}
                stroke={sel ? '#F2B080' : isBusy ? '#333' : c} strokeWidth={sel ? 2.5 : 1.2}>
                {sel && <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />}
              </rect>
              {zone !== 'ps' && <rect x={x + w * 0.15} y={y + h * 0.25} width={w * 0.7} height={h * 0.5} rx="4" fill={isBusy ? '#262626' : c} fillOpacity={isBusy ? 1 : 0.5} />}
              {zone === 'ps' && <rect x={x + w * 0.3} y={y + 12} width={w * 0.4} height="8" fill={isBusy ? '#262626' : c} fillOpacity="0.7" />}
              <text x={x + w / 2} y={y + h - 8} textAnchor="middle" fontSize="10" fill={isBusy ? '#666' : '#f5f5f5'}>{label}</text>
              {isBusy && <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize="9" letterSpacing="2" fill="#777">IN USE</text>}
            </g>
          )
        })}
      </svg>
      <div className="flex flex-wrap gap-4 justify-center mt-2 font-body text-[10px] text-gray/60">
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 bg-gold/40 border border-gold inline-block" />Available</span>
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 bg-[#13241c] border border-[#2a4a3c] inline-block" />In use now</span>
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 bg-gold border border-gold-soft inline-block" />Selected</span>
      </div>
    </div>
  )
}
export default FloorPlan
