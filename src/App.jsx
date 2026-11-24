import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Loader from './components/common/Loader'
import ScrollToTop from './components/layout/ScrollToTop'
import ScrollProgress from './components/layout/ScrollProgress'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const images = [
      'https://images.unsplash.com/photo-1614690951822-0e1ca07da9ad?w=1920&q=80',
    ]
    images.forEach(src => { const img = new Image(); img.src = src })
    const timer = setTimeout(() => setLoading(false), 2400)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ScrollProgress />
            <AppRoutes />
            <ScrollToTop />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
