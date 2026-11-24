import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../common/Loader'

const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Loader />
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
export default PrivateRoute
