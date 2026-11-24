import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { authService } from '../services/api'
import AuthLayout from '../components/auth/AuthLayout'
import FormInput from '../components/auth/FormInput'
import Button from '../components/common/Button'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!email) { setError('Please enter your email address'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return }
    setLoading(true); setError('')
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email and we'll send a reset link"
      footer={<Link to="/login" className="inline-flex items-center gap-2 text-gold/70 hover:text-gold transition-colors text-[11px] tracking-wide"><FiArrowLeft size={12} /> Back to Sign In</Link>}
    >
      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
          <div className="w-16 h-16 mx-auto border border-gold/30 flex items-center justify-center">
            <FiCheckCircle className="text-gold text-3xl" />
          </div>
          <p className="font-body text-xs text-gray/70 leading-relaxed max-w-sm mx-auto">
            We've sent a password reset link to <span className="text-ivory font-medium">{email}</span>. Check your inbox and follow the instructions.
          </p>
          <p className="font-body text-[10px] text-gray/40 pt-2">Didn't receive it? Check your spam folder or{' '}
            <button type="button" onClick={() => setSent(false)} className="text-gold/70 hover:text-gold underline transition-colors">try again</button>
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput label="Email Address" type="email" placeholder="your@email.com" icon={FiMail}
            value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} error={error} autoComplete="email" />
          <Button type="submit" variant="gold" className="w-full justify-center" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
export default ForgotPasswordPage
