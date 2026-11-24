import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import FormInput from '../components/auth/FormInput'
import Button from '../components/common/Button'
import { motion } from 'framer-motion'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true); setApiError('')
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally { setLoading(false) }
  }

  const set = (k) => (ev) => { setForm(f => ({ ...f, [k]: ev.target.value })); setErrors(e => ({ ...e, [k]: '' })) }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Golden Frame account"
      footer={<>Don't have an account?{' '}<Link to="/register" className="text-gold hover:text-gold-soft transition-colors">Create one free</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput label="Email Address" type="email" placeholder="your@email.com" icon={FiMail}
          value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />

        <div className="space-y-1.5">
          <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/70">Password</label>
          <div className="relative">
            <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
            <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')} autoComplete="current-password"
              className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500/60' : 'border-gold/15 hover:border-gold/30 focus:border-gold/60'} text-ivory placeholder-gray/30 font-body text-sm py-3.5 pl-10 pr-10 outline-none transition-all duration-300`}
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold transition-colors">
              {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
          {errors.password && <p className="font-body text-[10px] text-red-400/80">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-gold w-3.5 h-3.5" />
            <span className="font-body text-[10px] text-gray/60 tracking-wide">Remember me</span>
          </label>
          <Link to="/forgot-password" className="font-body text-[10px] text-gold/70 hover:text-gold tracking-wide transition-colors">
            Forgot Password?
          </Link>
        </div>

        {apiError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/8 border border-red-500/20 px-4 py-3"
          >
            <p className="font-body text-xs text-red-400/90">{apiError}</p>
          </motion.div>
        )}

        <Button type="submit" variant="gold" className="w-full justify-center mt-2" disabled={loading}>
          {loading ? 'Signing In…' : 'Sign In'}
        </Button>

        <div className="relative flex items-center gap-4 py-1">
          <div className="flex-1 h-px bg-gold/10" />
          <span className="font-body text-[10px] text-gray/40 tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-gold/10" />
        </div>

        <Link to="/booking">
          <button type="button" className="w-full border border-gold/20 py-3.5 text-gold font-body text-xs tracking-widest uppercase hover:border-gold/40 hover:bg-gold/5 transition-all duration-300">
            Book Without Account
          </button>
        </Link>
      </form>
    </AuthLayout>
  )
}
export default LoginPage
