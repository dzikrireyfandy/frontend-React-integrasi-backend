import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/api'
import { LoadingPanel } from './ui'

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) return <LoadingPanel message="Memeriksa sesi login..." />

  // Belum login -> ke halaman login, lalu kembali ke halaman tujuan setelah berhasil.
  if (!user) {
    const redirect = `${location.pathname}${location.search}`
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />
  }

  // Sudah login tetapi role tidak cukup -> 403 di sisi UI.
  if (roles && !roles.includes(user.role)) return <Navigate to="/forbidden" replace />

  return <Outlet />
}
