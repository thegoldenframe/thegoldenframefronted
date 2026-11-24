import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiMessageSquare, FiCheck } from 'react-icons/fi'
import SectionTitle from '../common/SectionTitle'

const tableTypes = ['Standard Pool', 'American Pool', 'Snooker 10ft', 'Snooker 12ft', 'VIP Suite', 'Grand Suite', 'PS5 Duo Station', 'PS5 Squad Lounge', 'PS5 VIP Pod']

const Field = ({ label, icon: Icon, type = 'text', placeholder, required, options, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-body tracking-widest uppercase text-gold/70 mb-2">
      {label}{required && <span className="text-gold ml-1">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/30 text-sm pointer-events-none" />}
      {options ? (
        <select
          value={value} onChange={onChange}
          className={`w-full bg-black/60 border border-gold/20 text-ivory font-body text-xs py-3 pr-4 outline-none focus:border-gold/55 transition-colors duration-300 ${Icon ? 'pl-10' : 'pl-4'}`}
          style={{ backgroundImage: 'none' }}
        >
          <option value="" className="bg-black">{placeholder}</option>
          {options.map(o => <option key={o} value={o} className="bg-black">{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value} onChange={onChange} placeholder={placeholder} rows={4}
          className="w-full bg-black/60 border border-gold/20 text-ivory font-body text-xs px-4 py-3 outline-none focus:border-gold/55 transition-colors duration-300 resize-none placeholder:text-gray/25"
        />
      ) : (
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          className={`w-full bg-black/60 border border-gold/20 text-ivory font-body text-xs py-3 pr-4 outline-none focus:border-gold/55 transition-colors duration-300 placeholder:text-gray/25 ${Icon ? 'pl-10' : 'pl-4'}`}
        />
      )}
    </div>
  </div>
)

const Booking = () => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', date:'', time:'', tableType:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true); setTimeout(() => setSubmitted(false), 6000) }, 1200)
  }

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Layered bg */}
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#0f0e09]" />

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionTitle subtitle="Reservations" title="Book Your Table" align="left"
              description="Reserve in advance and enjoy a seamless, premium experience. Private bookings and corporate events welcome."
            />

            <ul className="mt-10 space-y-6">
              {[
                { icon: FiCalendar, title: 'Flexible Booking',      desc: 'Same-day and advance reservations available 7 days a week.' },
                { icon: FiClock,    title: 'Open Daily',             desc: 'Enjoy billiards and pool 7 days a week from 10:00 AM to 11:00 PM.' },
                { icon: FiPhone,    title: 'Instant Confirmation',   desc: 'Confirmation sent within minutes directly to your inbox or phone.' },
              ].map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="text-gold text-sm" />
                  </div>
                  <div>
                    <h4 className="text-ivory font-body text-sm font-medium mb-1">{title}</h4>
                    <p className="text-gray font-body text-xs leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-card gold-border p-5 sm:p-8">
              <h3 className="font-heading text-2xl text-ivory mb-6">Make a Reservation</h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-14"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 14 }}
                    className="w-16 h-16 border-2 border-gold flex items-center justify-center mx-auto mb-5"
                  >
                    <FiCheck className="text-gold text-2xl" />
                  </motion.div>
                  <h4 className="font-heading text-2xl text-gold mb-2">Booking Confirmed!</h4>
                  <p className="text-gray font-body text-sm">We'll contact you shortly to confirm your reservation details.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name"  icon={FiUser}  placeholder="John Smith"         required value={form.name}  onChange={set('name')} />
                    <Field label="Email"      icon={FiMail}  type="email" placeholder="your@email.com" required value={form.email} onChange={set('email')} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Phone"      icon={FiPhone} type="tel"  placeholder="+91 99000 00000" value={form.phone} onChange={set('phone')} />
                    <Field label="Table Type" options={tableTypes} placeholder="Select table" required value={form.tableType} onChange={set('tableType')} />
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                    <Field label="Date" icon={FiCalendar} type="date" required value={form.date} onChange={set('date')} />
                    <Field label="Time" icon={FiClock}    type="time" required value={form.time} onChange={set('time')} />
                  </div>
                  <Field label="Special Requests" icon={FiMessageSquare} type="textarea"
                    placeholder="Any special requirements, occasions, or catering requests..."
                    value={form.message} onChange={set('message')}
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{  scale: loading ? 1 : 0.985 }}
                    className="w-full btn-gold py-4 text-xs justify-center flex items-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                        />
                        Processing…
                      </>
                    ) : 'Confirm Reservation'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Booking
