import React from 'react'
import SnookerHero from './SnookerHero'

const Hero = () => {
  const params = new URLSearchParams(window.location.search)
  const modelUrl = params.get('model') || params.get('modelUrl') || null
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden" id="hero-section">
      <SnookerHero modelUrl={modelUrl} />
    </section>
  )
}

export default Hero
