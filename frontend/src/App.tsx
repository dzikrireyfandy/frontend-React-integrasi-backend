import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider, useToast } from './context/ToastContext'
import Header from './components/Header'
import { ProtectedRoute } from './components/ProtectedRoute'
import StallListPage from './pages/StallListPage'
import StallDetailPage from './pages/StallDetailPage'
import StallFormPage from './pages/StallFormPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import { ForbiddenPage, NotFoundPage } from './pages/StatusPages'

function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="mt-12 border-t border-line py-6 text-center text-xs text-muted">
        Review Kantin · Dzikri Reyfandy
      </footer>
    </div>
  )
}

// Saat token ditolak server (401) di halaman terlindungi, arahkan ke login.
function SessionWatcher() {
  const { sessionExpired, user } = useAuth()
  const toast = useToast()
  const location = useLocation()

  useEffect(() => {
    if (sessionExpired) toast.error('Sesi login berakhir. Silakan masuk lagi.')
  }, [sessionExpired, toast])

  if (sessionExpired && !user && !location.pathname.startsWith('/login')) {
    const redirect = `${location.pathname}${location.search}`
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />
  }
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SessionWatcher />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<StallListPage />} />
              <Route path="stalls/:id" element={<StallDetailPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forbidden" element={<ForbiddenPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              <Route element={<ProtectedRoute roles={['admin', 'owner']} />}>
                <Route path="stalls/new" element={<StallFormPage />} />
                <Route path="stalls/:id/edit" element={<StallFormPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
