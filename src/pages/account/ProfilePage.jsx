import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiLock, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/api'
import AccountLayout from '../../components/customer/AccountLayout'
import FormInput from '../../components/auth/FormInput'
import { FiUser, FiMail, FiPhone } from 'react-icons/fi'

const Section = ({ title, children }) => (
  <div className="bg-surface border border-gold/10 p-6 mb-4">
    <h2 className="font-heading text-base text-ivory mb-1">{title}</h2>
    <div className="w-8 h-px bg-gold mb-5" />
    {children}
  </div>
)

const Alert = ({ type, msg }) => {
  if (!msg) return null
  const styles = type === 'success'
    ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
    : 'bg-red-500/8 border-red-500/20 text-red-400'
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 border px-4 py-3 font-body text-xs mb-4 ${styles}`}
    >
      {type === 'success' && <FiCheckCircle size={13} />}
      {msg}
    </motion.div>
  )
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth()

  // Profile form
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  // Password form
  const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' })
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
  }, [user])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!profile.name.trim()) { setProfileMsg({ type: 'error', text: 'Name is required.' }); return }
    setProfileLoading(true); setProfileMsg({ type: '', text: '' })
    try {
      const res = await authService.updateProfile(profile)
      const updated = res.data?.user || res.data?.data?.user || profile
      updateUser(updated)
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to update profile.' })
    } finally { setProfileLoading(false) }
  }

  const handlePwdSave = async (e) => {
    e.preventDefault()
    if (!pwd.current) { setPwdMsg({ type: 'error', text: 'Enter your current password.' }); return }
    if (pwd.newPwd.length < 8) { setPwdMsg({ type: 'error', text: 'New password must be at least 8 characters.' }); return }
    if (pwd.newPwd !== pwd.confirm) { setPwdMsg({ type: 'error', text: 'New passwords do not match.' }); return }
    setPwdLoading(true); setPwdMsg({ type: '', text: '' })
    try {
      await authService.changePassword(pwd.current, pwd.newPwd)
      setPwdMsg({ type: 'success', text: 'Password changed successfully!' })
      setPwd({ current: '', newPwd: '', confirm: '' })
    } catch (err) {
      setPwdMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to change password.' })
    } finally { setPwdLoading(false) }
  }

  const setP = (k) => (e) => setProfile(f => ({ ...f, [k]: e.target.value }))
  const setW = (k) => (e) => setPwd(f => ({ ...f, [k]: e.target.value }))

  return (
    <AccountLayout title="My Profile">

      {/* Profile info */}
      <Section title="Personal Information">
        <Alert type={profileMsg.type} msg={profileMsg.text} />
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Full Name" icon={FiUser} value={profile.name} onChange={setP('name')} placeholder="Your full name" />
            <FormInput label="Email Address" icon={FiMail} type="email" value={profile.email} onChange={setP('email')} placeholder="your@email.com" />
          </div>
          <FormInput label="Phone Number" icon={FiPhone} type="tel" value={profile.phone} onChange={setP('phone')} placeholder="+91 99000 00000" />

          {/* Member since */}
          {user?.createdAt && (
            <p className="font-body text-[10px] text-gray/35 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
            </p>
          )}

          <button type="submit" disabled={profileLoading}
            className="btn-gold flex items-center gap-2 px-7 py-3 text-xs disabled:opacity-50"
          >
            <FiSave size={13} />
            {profileLoading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </Section>

      {/* Change password */}
      <Section title="Change Password">
        <Alert type={pwdMsg.type} msg={pwdMsg.text} />
        <form onSubmit={handlePwdSave} className="space-y-4">
          <FormInput label="Current Password" icon={FiLock} type="password" value={pwd.current} onChange={setW('current')} placeholder="••••••••" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="New Password" icon={FiLock} type="password" value={pwd.newPwd} onChange={setW('newPwd')} placeholder="Min. 8 characters" />
            <FormInput label="Confirm New Password" icon={FiLock} type="password" value={pwd.confirm} onChange={setW('confirm')} placeholder="Repeat new password" />
          </div>
          <button type="submit" disabled={pwdLoading}
            className="border border-gold/25 text-gold px-7 py-3 font-body text-xs tracking-widest uppercase hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <FiLock size={12} />
            {pwdLoading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </Section>

    </AccountLayout>
  )
}
export default ProfilePage
