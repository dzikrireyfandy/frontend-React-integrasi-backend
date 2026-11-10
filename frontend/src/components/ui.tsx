import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Loader2, SearchX, ServerCrash } from 'lucide-react'

export function Spinner({ label = 'Memuat...' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-muted">
      <Loader2 className="animate-spin" size={22} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function LoadingPanel({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Spinner label={message} />
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-white px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-pine">
        <SearchX size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-lg font-bold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'Data gagal dimuat',
  message,
  onRetry,
}: {
  title?: string
  message: string
  onRetry?: () => void
}) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-chili/30 bg-white px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-chili-soft text-chili">
        <ServerCrash size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-lg font-bold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-primary mt-5">
          Coba lagi
        </button>
      )}
    </div>
  )
}

export function Pagination({
  page,
  limit,
  total,
  onChange,
}: {
  page: number
  limit: number
  total: number
  onChange: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-3">
      <p className="text-sm text-muted">
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-outline"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Sebelumnya
        </button>
        <button
          type="button"
          className="btn btn-outline"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Berikutnya
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1 text-xs font-medium text-chili">
      {message}
    </p>
  )
}
