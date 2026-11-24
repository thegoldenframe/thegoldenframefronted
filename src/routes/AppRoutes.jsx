import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PrivateRoute from '../components/auth/PrivateRoute'
import Loader from '../components/common/Loader'
import MobileBar from '../components/layout/MobileBar'
import CartDrawer from '../components/cafe/CartDrawer'

// ── Existing pages (keep as-is) ───────────────────────────────────────────────
import Home         from '../pages/Home'
import AboutPage    from '../pages/AboutPage'
import GalleryPage  from '../pages/GalleryPage'
import ContactPage  from '../pages/ContactPage'
import NotFound     from '../pages/NotFound'

// ── New customer pages (lazy-loaded) ──────────────────────────────────────────
const ServicesPage     = lazy(() => import('../pages/ServicesPage'))
const TablesPage       = lazy(() => import('../pages/TablesPage'))
const MenuPage         = lazy(() => import('../pages/MenuPage'))
const PlayStationPage  = lazy(() => import('../pages/PlayStationPage'))
const CafePage         = lazy(() => import('../pages/CafePage'))
const BookingPage      = lazy(() => import('../pages/BookingPage'))
const MembershipPage   = lazy(() => import('../pages/MembershipPage'))
const OffersPage       = lazy(() => import('../pages/OffersPage'))
const PricingPage      = lazy(() => import('../pages/PricingPage'))

// ── Auth pages ────────────────────────────────────────────────────────────────
const LoginPage          = lazy(() => import('../pages/LoginPage'))
const RegisterPage       = lazy(() => import('../pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'))

// ── Account pages (protected) ─────────────────────────────────────────────────
const ProfilePage       = lazy(() => import('../pages/account/ProfilePage'))
const MyBookingsPage    = lazy(() => import('../pages/account/MyBookingsPage'))
const NotificationsPage = lazy(() => import('../pages/account/NotificationsPage'))

// Auth pages have no navbar/footer
const AUTH_PATHS = ['/login', '/register', '/forgot-password']

function AppRoutes() {
  const location = useLocation()
  const isAuthPage = AUTH_PATHS.some(p => location.pathname.startsWith(p))

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* ── Public ── */}
            <Route path="/"           element={<Home />} />
            <Route path="/about"      element={<AboutPage />} />
            <Route path="/gallery"    element={<GalleryPage />} />
            <Route path="/contact"    element={<ContactPage />} />
            <Route path="/pricing"    element={<PricingPage />} />
            <Route path="/services"   element={<ServicesPage />} />
            <Route path="/tables"     element={<TablesPage />} />
            <Route path="/menu"       element={<CafePage />} />
            <Route path="/cafe"       element={<CafePage />} />
            <Route path="/playstation" element={<PlayStationPage />} />
            <Route path="/booking"    element={<BookingPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/offers"     element={<OffersPage />} />

            {/* ── Auth (no layout) ── */}
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* ── Protected account pages ── */}
            <Route path="/account/profile" element={
              <PrivateRoute><ProfilePage /></PrivateRoute>
            } />
            <Route path="/account/bookings" element={
              <PrivateRoute><MyBookingsPage /></PrivateRoute>
            } />
            <Route path="/account/history" element={
              <PrivateRoute><MyBookingsPage historyMode /></PrivateRoute>
            } />
            <Route path="/account/notifications" element={
              <PrivateRoute><NotificationsPage /></PrivateRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <CartDrawer />}
      {!isAuthPage && <MobileBar />}
    </>
  )
}

export default AppRoutes
