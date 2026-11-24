import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import About from '../components/home/About'
import LiveStatus from '../components/home/LiveStatus'
import Experiences from '../components/home/Experiences'
import Services from '../components/home/Services'
// import Pricing from '../components/home/Pricing'
import Gallery from '../components/home/Gallery'
import Testimonials from '../components/home/Testimonials'
import Booking from '../components/home/Booking'
import CTA from '../components/home/CTA'
import Partners from '../components/home/Partners'

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <LiveStatus />
      <Partners />
      <About />
      <Experiences />
      <Services />
      <Gallery />
      {/* <Pricing /> */}
      <Testimonials />
      <Booking />
      <CTA />
    </motion.main>
  )
}

export default Home
