import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, TriangleAlert } from 'lucide-react'
import { stallApi } from '../lib/api'
import { parseError } from '../lib/errors'
import { can } from '../lib/permissions'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import StallForm from '../components/StallForm'
import { EmptyState, ErrorState, Spinner } from '../components/ui'
import type { Stall, StallInput } from '../types/api'

export default function StallFormPage() {
  const { id } = useParams()
  const isEdit = id !== undefined
  const stallId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [stall, setStall] = useState<Stall | null>(null)
  const [isLoading, setIsLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<{ status: number | null; message: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit) return
    if (!Number.isInteger(stallId) || stallId <= 0) {
      setLoadError({ status: 404, message: 'ID warung tidak valid.' })
      setIsLoading(false)
      return
    }

    let cancelled = false
    stallApi
      .get(stallId)
      .then((data) => {
        if (!cancelled) setStall(data)
      })
      .catch((caught) => {
        if (cancelled) return
        const parsed = parseError(caught)
        setLoadError({ status: parsed.status, message: parsed.message })
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isEdit, stallId])

  async function handleSubmit(input: StallInput) {
    setBusy(true)
    setServerErrors({})
    setFormError(null)

    try {
      const saved = isEdit ? await stallApi.update(stallId, input) : await stallApi.create(input)
      toast.success(isEdit ? 'Perubahan warung berhasil disimpan.' : 'Warung baru berhasil ditambahkan.')
      navigate(`/stalls/${saved.id}`)
    } catch (caught) {
      const parsed = parseError(caught)
      if (parsed.status === 400 && Object.keys(parsed.fields).length > 0) {
        // Validasi gagal di backend: tampilkan pesan per field.
        setServerErrors(parsed.fields)
        setFormError('Periksa kembali isian yang ditandai.')
      } else if (parsed.status === 403) {
        setFormError(`Akses ditolak (403): ${parsed.message}`)
        toast.error(`Akses ditolak: ${parsed.message}`)
      } else {
        setFormError(parsed.message)
        toast.error(parsed.message)
      }
    } finally {
      setBusy(false)
    }
  }

  const back = (
    <Link
      to={isEdit ? `/stalls/${id}` : '/'}
      className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-pine"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Kembali
    </Link>
  )

  if (isEdit && isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {back}
        <Spinner label="Memuat data warung..." />
      </div>
    )
  }

  if (isEdit && (loadError || !stall)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {back}
        {loadError?.status === 404 ? (
          <EmptyState title="Warung tidak ditemukan" description="Warung yang ingin diubah tidak ada." />
        ) : (
          <ErrorState message={loadError?.message ?? 'Terjadi kesalahan.'} />
        )}
      </div>
    )
  }

  const notOwner = isEdit && stall !== null && !can.edit(user, stall)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {back}

      <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {isEdit ? 'Ubah data warung' : 'Tambah warung baru'}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isEdit ? 'Perubahan disimpan ke database lewat backend.' : 'Warung baru akan tercatat atas nama akunmu.'}
        </p>

        {notOwner && (
          <div role="note" className="mt-5 flex gap-3 rounded-xl border border-saffron/50 bg-saffron-soft p-4 text-sm">
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-saffron-dark" aria-hidden="true" />
            <p>
              Warung ini bukan milikmu. Backend hanya mengizinkan owner mengubah warung miliknya sendiri, jadi
              penyimpanan kemungkinan ditolak dengan status 403.
            </p>
          </div>
        )}

        {formError && (
          <div role="alert" className="mt-5 rounded-xl border border-chili/40 bg-chili-soft p-4 text-sm font-medium text-chili">
            {formError}
          </div>
        )}

        <div className="mt-6">
          <StallForm
            initial={stall ?? undefined}
            submitLabel={isEdit ? 'Simpan perubahan' : 'Tambah warung'}
            busy={busy}
            serverErrors={serverErrors}
            onSubmit={handleSubmit}
            onCancel={() => navigate(isEdit ? `/stalls/${id}` : '/')}
          />
        </div>
      </div>
    </div>
  )
}
