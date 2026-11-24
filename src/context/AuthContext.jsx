import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('gf_token'))
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const stored = localStorage.getItem('gf_token')
    if (!stored) { setLoading(false); return }
    try {
      const res = await authService.getMe(stored)
      setUser(res.data.user || res.data.data?.user || res.data)
      setToken(stored)
    } catch {
      localStorage.removeItem('gf_token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    const { token: t, user: u, data } = res.data
    const accessToken = t || data?.token || data?.accessToken
    const userData    = u || data?.user
    if (accessToken) {
      localStorage.setItem('gf_token', accessToken)
      setToken(accessToken)
    }
    if (userData) setUser(userData)
    return res.data
  }

  const register = async (payload) => {
    const res = await authService.register(payload)
    const { token: t, user: u, data } = res.data
    const accessToken = t || data?.token || data?.accessToken
    const userData    = u || data?.user
    if (accessToken) {
      localStorage.setItem('gf_token', accessToken)
      setToken(accessToken)
    }
    if (userData) setUser(userData)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('gf_token')
    setToken(null)
    setUser(null)
  }

  const updateUser = (updated) => setUser(u => ({ ...u, ...updated }))

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
