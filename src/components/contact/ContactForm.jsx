import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiUser, FiMail, FiPhone } from 'react-icons/fi'

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
    }, 1200)
  }

  const inputClass =
    'w-full bg-black/50 border border-gold/20 text-ivory font-body text-sm px-4 py-3 outline-none focus:border-gold/60 transition-colors duration-300 placeholder:text-gray/30'

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card gold-border p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-20 h-20 border-2 border-gold flex items-center justify-center mx-auto mb-5"
        >
          <FiSend className="text-gold text-2xl" />
        </motion.div>
        <h4 className="font-heading text-3xl text-gold mb-2">Message Sent!</h4>
        <p className="text-gray font-body text-sm leading-relaxed max-w-xs mx-auto">
          Thank you for reaching out. A member of our team will respond within 2 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="glass-card gold-border p-5 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body tracking-widest uppercase text-gold/70 mb-2">
              Full Name <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/30 text-sm" />
              <input
                type="text"
                value={form.name}
                onChange={handle('name')}
                placeholder="John Smith"
                required
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-body tracking-widest uppercase text-gold/70 mb-2">
              Email <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/30 text-sm" />
              <input
                type="email"
                value={form.email}
                onChange={handle('email')}
                placeholder="your@email.com"
                required
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>

        {/* Row 2 - Phone */}
        <div>
          <label className="block text-xs font-body tracking-widest uppercase text-gold/70 mb-2">Phone</label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/30 text-sm" />
            <input
              type="tel"
              value={form.phone}
              onChange={handle('phone')}
              placeholder="+91 99000 00000"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-body tracking-widest uppercase text-gold/70 mb-2">
            Message <span className="text-gold">*</span>
          </label>
          <textarea
            value={form.message}
            onChange={handle('message')}
            placeholder="Tell us how we can help you..."
            rows={5}
            required
            className={`${inputClass} resize-none`}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full btn-gold py-4 text-sm justify-center flex items-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full"
              />
              Sending...
            </>
          ) : (
            <>
              <FiSend />
              Send Message
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}

export default ContactForm
