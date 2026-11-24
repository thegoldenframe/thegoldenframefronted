import axios from 'axios'

// ── Axios instance ────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || '/api'

const http = axios.create({ baseURL: BASE, withCredentials: true })

http.interceptors.request.use(cfg => {
  const t = localStorage.getItem('gf_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

http.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gf_token')
      // Redirect only if inside protected pages
      if (window.location.pathname.startsWith('/account')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  login:          (email, password) => http.post('/auth/login', { email, password }),
  register:       (data)            => http.post('/auth/register', data),
  getMe:          (token)           => http.get('/auth/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  forgotPassword: (email)           => http.post('/auth/forgot-password', { email }),
  resetPassword:  (token, password) => http.post('/auth/reset-password', { token, password }),
  updateProfile:  (data)            => http.patch('/auth/profile', data),
  changePassword: (current, newPwd) => http.patch('/auth/change-password', { currentPassword: current, newPassword: newPwd }),
}

// ── Tables ────────────────────────────────────────────────────────────────────
export const tableService = {
  getAll:        (params) => http.get('/tables', { params }),
  getOne:        (id)     => http.get(`/tables/${id}`),
  getAvailable:  (params) => http.get('/tables/available', { params }),
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingService = {
  create:         (data)  => http.post('/bookings', data),
  getMyBookings:  (params)=> http.get('/bookings/my', { params }),
  getOne:         (id)    => http.get(`/bookings/${id}`),
  cancel:         (id)    => http.patch(`/bookings/${id}/cancel`),
  getAvailSlots:  (params)=> http.get('/bookings/available-slots', { params }),
}

// ── Menu ──────────────────────────────────────────────────────────────────────
export const menuService = {
  getCategories: (params) => http.get('/menu/categories', { params }),
  getItems:      (params) => http.get('/menu/items', { params }),
}

// ── Membership ────────────────────────────────────────────────────────────────
export const membershipService = {
  getPlans:   ()     => http.get('/memberships/plans'),
  getMine:    ()     => http.get('/memberships/my'),
  subscribe:  (data) => http.post('/memberships/subscribe', data),
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const notifService = {
  getAll:   () => http.get('/notifications'),
  markRead: (id) => http.patch(`/notifications/${id}/read`),
  markAllRead: () => http.patch('/notifications/read-all'),
}

// ── Contact ───────────────────────────────────────────────────────────────────
export const contactService = {
  send: (data) => http.post('/contact', data),
}

export default http
