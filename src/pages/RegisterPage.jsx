import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import FormInput from '../components/auth/FormInput'
import Button from '../components/common/Button'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Mobile number is required.'
    else if (phoneDigits.length !== 10) e.phone = 'Enter a valid 10-digit mobile number'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true); setApiError('')
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      navigate('/')
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const set = (k) => (ev) => { setForm(f => ({ ...f, [k]: ev.target.value })); setErrors(e => ({ ...e, [k]: '' })) }

  return (
    <AuthLayout title="Create Account" subtitle="Join The Golden Frame community"
      footer={<>Already have an account?{' '}<Link to="/login" className="text-gold hover:text-gold-soft transition-colors">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Full Name" placeholder="Your full name" icon={FiUser}
          value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <FormInput label="Email Address" type="email" placeholder="your@email.com" icon={FiMail}
          value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <FormInput label="Mobile Number" type="tel" placeholder="+91 99000 00000" icon={FiPhone}
          value={form.phone} onChange={set('phone')} error={errors.phone} />

        <div className="space-y-1.5">
          <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/70">Password</label>
          <div className="relative">
            <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
            <input type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={set('password')}
              className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500/60' : 'border-gold/15 hover:border-gold/30 focus:border-gold/60'} text-ivory placeholder-gray/30 font-body text-sm py-3.5 pl-10 pr-10 outline-none transition-all`}
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold transition-colors">
              {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
          {errors.password && <p className="font-body text-[10px] text-red-400/80">{errors.password}</p>}
        </div>

        <FormInput label="Confirm Password" type="password" placeholder="Repeat password" icon={FiLock}
          value={form.confirm} onChange={set('confirm')} error={errors.confirm} />

        <div className="flex items-start gap-2 mt-1">
          <input type="checkbox" required className="accent-gold w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span className="font-body text-[10px] text-gray/50 leading-relaxed">
            I agree to the{' '}
            <Link to="/contact" className="text-gold/70 hover:text-gold underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/contact" className="text-gold/70 hover:text-gold underline">Privacy Policy</Link>
          </span>
        </div>

        {apiError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/8 border border-red-500/20 px-4 py-3"
          >
            <p className="font-body text-xs text-red-400/90">{apiError}</p>
          </motion.div>
        )}

        <Button type="submit" variant="gold" className="w-full justify-center mt-2" disabled={loading}>
          {loading ? 'Creating Account…' : 'Create Account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
export default RegisterPage
