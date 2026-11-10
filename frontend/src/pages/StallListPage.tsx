import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'
import { stallApi } from '../lib/api'
import { parseError } from '../lib/errors'
import { can } from '../lib/permissions'
import { useAuth } from '../context/AuthContext'
import { useDebounced } from '../hooks/useDebounced'
import StallCard from '../components/StallCard'
import { EmptyState, ErrorState, Pagination, Spinner } from '../components/ui'
import type { Stall } from '../types/api'

const PAGE_SIZE = 9

export default function StallListPage() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()

  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''
  const page = Math.max(1, Number(params.get('page')) || 1)

  // Kotak pencarian punya state sendiri supaya mengetik tidak menembak API di setiap huruf.
  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebounced(searchInput.trim())

  const [stalls, setStalls] = useState<Stall[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value)
            else next.delete(key)
          }
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  // Terapkan hasil debounce ke URL; kembali ke halaman 1 bila kata kunci berubah.
  useEffect(() => {
    if (debouncedSearch !== search) updateParams({ search: debouncedSearch || null, page: null })
  }, [debouncedSearch, search, updateParams])

  // Daftar kategori untuk filter diambil sekali dari data yang ada.
  useEffect(() => {
    let cancelled = false
    stallApi
      .list({ limit: 100 })
      .then((result) => {
        if (cancelled) return
        const unique = Array.from(new Set(result.data.map((s) => s.category).filter((c): c is string => Boolean(c))))
        setCategories(unique.sort((a, b) => a.localeCompare(b, 'id')))
      })
      .catch(() => {
        /* filter kategori opsional, error utama ditampilkan oleh daftar */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    stallApi
      .list({
        search: search || undefined,
        category: category || undefined,
        page,
        limit: PAGE_SIZE,
      })
      .then((result) => {
        if (cancelled) return
        setStalls(result.data)
        setTotal(result.meta.total)
      })
      .catch((caught) => {
        if (!cancelled) setError(parseError(caught).message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [search, category, page, reloadKey])

  const hasFilter = Boolean(search || category)

  function resetFilters() {
    setSearchInput('')
    setParams({}, { replace: true })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Mau makan di warung mana hari ini?
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Lihat warung kantin kampus lengkap dengan lokasi, rating, dan menunya.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="search" className="sr-only">
              Cari nama warung
            </label>
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Cari nama warung..."
              className="input pl-10"
            />
          </div>

          <div>
            <label htmlFor="category-filter" className="sr-only">
              Filter kategori
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(event) => updateParams({ category: event.target.value || null, page: null })}
              className="input sm:w-56"
            >
              <option value="">Semua kategori</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <Spinner label="Memuat daftar warung..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
      ) : stalls.length === 0 ? (
        hasFilter ? (
          <EmptyState
            title="Warung tidak ditemukan"
            description="Coba kata kunci lain atau pilih kategori yang berbeda."
            action={
              <button type="button" className="btn btn-primary" onClick={resetFilters}>
                <X size={16} aria-hidden="true" />
                Reset pencarian
              </button>
            }
          />
        ) : (
          <EmptyState
            title="Belum ada warung"
            description="Data warung masih kosong."
            action={
              can.create(user) ? (
                <Link to="/stalls/new" className="btn btn-primary">
                  <Plus size={16} aria-hidden="true" />
                  Tambah warung pertama
                </Link>
              ) : undefined
            }
          />
        )
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">
            Menampilkan {stalls.length} dari {total} warung
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stalls.map((stall) => (
              <StallCard key={stall.id} stall={stall} />
            ))}
          </div>
          <Pagination
            page={page}
            limit={PAGE_SIZE}
            total={total}
            onChange={(next) => {
              updateParams({ page: next > 1 ? String(next) : null })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </>
      )}
    </div>
  )
}
