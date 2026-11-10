import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { parseError } from '../lib/errors'
import { FieldError } from '../components/ui'

// Hanya izinkan redirect ke path internal agar tidak jadi open-redirect.
function safeRedirect(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

export default function LoginPage() {
  const { user, login, sessionExpired, clearSessionExpired } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const redirect = safeRedirect(params.get('redirect'))
  const registeredNotice = (location.state as { registered?: boolean } | null)?.registered

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  if (user) return <Navigate to={redirect} replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email wajib diisi'
    if (!password) errors.password = 'Password wajib diisi'
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length > 0) return

    setBusy(true)
    try {
      const loggedIn = await login({ email: email.trim(), password })
      toast.success(`Selamat datang, ${loggedIn.name}!`)
      navigate(redirect, { replace: true })
    } catch (caught) {
      const parsed = parseError(caught)
      if (parsed.status === 400) setFieldErrors(parsed.fields)
      setFormError(parsed.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Masuk</h1>
        <p className="mt-1 text-sm text-muted">Masuk untuk mengelola warung sesuai peranmu.</p>

        {registeredNotice && (
          <p role="status" className="mt-5 rounded-xl bg-sage p-3 text-sm font-medium text-pine">
            Registrasi berhasil. Silakan masuk dengan akun barumu.
          </p>
        )}
        {sessionExpired && (
          <p role="alert" className="mt-5 rounded-xl bg-saffron-soft p-3 text-sm font-medium">
            Sesi login berakhir atau tidak valid (401). Silakan masuk lagi.
          </p>
        )}
        {formError && (
          <p role="alert" className="mt-5 rounded-xl border border-chili/40 bg-chili-soft p-3 text-sm font-medium text-chili">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              disabled={busy}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              disabled={busy}
            />
            <FieldError message={fieldErrors.password} />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {busy ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Belum punya akun?{' '}
          <Link to="/register" onClick={clearSessionExpired} className="font-semibold text-pine underline underline-offset-2">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
