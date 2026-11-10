import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../lib/api'
import { tokenStore, UNAUTHORIZED_EVENT } from '../lib/http'
import type { LoginInput, User } from '../types/api'

interface AuthState {
  user: User | null
  /** false selama sesi (token tersimpan) masih diperiksa lewat GET /auth/me */
  isReady: boolean
  login: (input: LoginInput) => Promise<User>
  logout: () => void
  /** true bila sesi berakhir karena 401, dipakai untuk pesan di halaman login */
  sessionExpired: boolean
  clearSessionExpired: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(() => tokenStore.get() === null)
  const [sessionExpired, setSessionExpired] = useState(false)

  // Pulihkan sesi saat aplikasi dibuka: token tersimpan divalidasi lewat GET /auth/me.
  useEffect(() => {
    if (!tokenStore.get()) return
    let cancelled = false

    authApi
      .me()
      .then((me) => {
        if (!cancelled) setUser(me)
      })
      .catch(() => {
        tokenStore.clear()
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Interceptor Axios memancarkan event ini saat server menjawab 401.
  useEffect(() => {
    function handleUnauthorized() {
      tokenStore.clear()
      setUser(null)
      setSessionExpired(true)
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const result = await authApi.login(input)
    tokenStore.set(result.token)
    setUser(result.user)
    setSessionExpired(false)
    return result.user
  }, [])

  // Backend memakai Bearer JWT tanpa endpoint logout, jadi logout = menghapus token di client.
  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const clearSessionExpired = useCallback(() => setSessionExpired(false), [])

  const value = useMemo(
    () => ({ user, isReady, login, logout, sessionExpired, clearSessionExpired }),
    [user, isReady, login, logout, sessionExpired, clearSessionExpired],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
