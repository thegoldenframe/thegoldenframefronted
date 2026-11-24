import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import SectionTitle from '../common/SectionTitle'
import { testimonialsData } from '../../data/testimonialsData'
import 'swiper/css'
import 'swiper/css/pagination'

const TestimonialCard = ({ t }) => (
  <div className="relative glass-card gold-border p-8 md:p-10 h-full flex flex-col overflow-hidden group
                  hover:shadow-[0_20px_50px_rgba(214,132,84,0.12)] transition-shadow duration-400">

    {/* Big quote icon */}
    <FaQuoteLeft className="text-gold/[0.08] text-8xl absolute -top-2 -left-2 pointer-events-none select-none group-hover:text-gold/[0.13] transition-colors duration-500" />

    {/* Top gold line on hover */}
    <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-gold to-gold-soft group-hover:w-full transition-all duration-500 pointer-events-none" />

    {/* Stars */}
    <div className="flex gap-1 mb-5 relative z-10">
      {Array(5).fill(0).map((_, i) => (
        <FaStar key={i} className={`text-xs ${i < t.rating ? 'text-gold' : 'text-gray/20'}`} />
      ))}
    </div>

    {/* Quote text */}
    <p className="text-gray font-body text-sm leading-[1.85] mb-8 flex-1 relative z-10 italic">
      "{t.text}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-4 pt-5 border-t border-gold/10 relative z-10">
      <div className="relative flex-shrink-0">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gold/25"
          loading="lazy"
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gold flex items-center justify-center rounded-full">
          <FaStar className="text-black text-[7px]" />
        </div>
      </div>
      <div>
        <h4 className="font-heading text-base font-semibold text-ivory leading-tight">{t.name}</h4>
        <p className="text-gold text-[11px] font-body tracking-widest mt-0.5">{t.role}</p>
      </div>
    </div>
  </div>
)

const Testimonials = () => (
  <section className="section-padding bg-black relative overflow-hidden">
    {/* Subtle radial glow */}
    <div className="absolute inset-0 opacity-[0.025]"
      style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #D68454 0%, transparent 70%)' }}
    />

    <div className="container-luxury relative z-10">
      <SectionTitle
        subtitle="Client Reviews"
        title="What Our Members Say"
        description="The voice of our community speaks louder than any award. Read what makes The Golden Frame Silvassa's finest billiards destination."
        className="mb-16"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={24}
          autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          breakpoints={{
            640:  { slidesPerView: 1 },
            768:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {testimonialsData.map(t => (
            <SwiperSlide key={t.id} className="h-auto self-stretch">
              <TestimonialCard t={t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  </section>
)

export default Testimonials
