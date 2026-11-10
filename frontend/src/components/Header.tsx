import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, Plus, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { can } from '../lib/permissions'
import { roleLabel } from '../lib/format'

export default function Header() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.info('Kamu sudah keluar.')
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Review Kantin - beranda">
          <img src="/favicon.svg" alt="" className="h-9 w-9" />
          <span className="font-display text-xl font-extrabold tracking-tight text-pine">Review Kantin</span>
        </Link>

        <nav aria-label="Navigasi utama" className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-sage text-pine' : 'text-muted hover:text-ink'}`
            }
          >
            Daftar Warung
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {can.create(user) && (
            <Link to="/stalls/new" className="btn btn-primary">
              <Plus size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Tambah Warung</span>
              <span className="sm:hidden">Tambah</span>
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm hover:border-line-strong"
              >
                <UserRound size={16} className="text-pine" aria-hidden="true" />
                <span className="max-w-[9rem] truncate font-semibold">{user.name}</span>
                <span className="rounded-full bg-sage px-2 py-0.5 text-xs font-semibold text-pine">
                  {roleLabel[user.role]}
                </span>
              </Link>
              <button type="button" onClick={handleLogout} className="btn btn-outline" aria-label="Keluar">
                <LogOut size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                <LogIn size={16} aria-hidden="true" />
                Masuk
              </Link>
              <Link to="/register" className="btn btn-primary hidden sm:inline-flex">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
