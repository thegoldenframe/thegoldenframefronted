import React from 'react'
const Skeleton3D = () => (
  <div className="h-full w-full min-h-[240px] flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-white/[0.02] via-gold/10 to-white/[0.02] bg-[length:200%_100%] animate-shimmer">
    <span className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    <span className="font-body text-[9px] tracking-[0.3em] uppercase text-gold/60">Loading 3D</span>
  </div>
)
export default Skeleton3D
