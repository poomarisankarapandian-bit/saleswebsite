import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute() {
  const { user } = useSelector((s) => s.auth)
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
