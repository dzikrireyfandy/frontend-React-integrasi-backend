import axios from 'axios'

const TOKEN_KEY = 'kantin_token'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const tokenStore = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* storage tidak tersedia */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* storage tidak tersedia */
    }
  },
}

// Base URL dikelola lewat .env agar alamat backend mudah diganti.
const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://localhost:3000'

export const http = axios.create({
  baseURL: baseURL.replace(/\/+$/, ''),
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor: sisipkan JWT (Bearer) di setiap request bila ada.
http.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: 401 pada endpoint non-login berarti sesi habis / token tidak valid.
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isAuthForm = url.endsWith('/auth/login') || url.endsWith('/auth/register')
      const isSessionCheck = url.endsWith('/auth/me')
      if (!isAuthForm && !isSessionCheck) {
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
      }
    }
    return Promise.reject(error)
  },
)
