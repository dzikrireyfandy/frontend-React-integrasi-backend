import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { authApi } from '../lib/api'
import { parseError } from '../lib/errors'
import { useAuth } from '../context/AuthContext'
import { FieldError } from '../components/ui'

export default function RegisterPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const errors: Record<string, string> = {}
    if (name.trim().length < 3) errors.name = 'Nama minimal 3 karakter'
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'Format email tidak valid'
    if (password.length < 8) errors.password = 'Password minimal 8 karakter'
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length > 0) return

    setBusy(true)
    try {
      await authApi.register({ name: name.trim(), email: email.trim(), password })
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (caught) {
      const parsed = parseError(caught)
      if (parsed.status === 400) setFieldErrors(parsed.fields)
      setFormError(parsed.status === 409 ? 'Email sudah terdaftar. Gunakan email lain atau masuk.' : parsed.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Buat akun</h1>
        <p className="mt-1 text-sm text-muted">Akun baru otomatis berperan sebagai customer.</p>

        {formError && (
          <p role="alert" className="mt-5 rounded-xl border border-chili/40 bg-chili-soft p-3 text-sm font-medium text-chili">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="label">
              Nama lengkap
            </label>
            <input
              id="name"
              autoComplete="name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              disabled={busy}
            />
            <FieldError message={fieldErrors.name} />
          </div>
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
              autoComplete="new-password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              disabled={busy}
            />
            <FieldError message={fieldErrors.password} />
            {!fieldErrors.password && <p className="mt-1 text-xs text-muted">8 sampai 72 karakter.</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {busy ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-pine underline underline-offset-2">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
