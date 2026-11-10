import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import type { Stall, StallInput } from '../types/api'
import { FieldError } from './ui'

const CATEGORY_SUGGESTIONS = ['Nasi', 'Nasi Goreng', 'Nasi Padang', 'Mie & Kwetiau', 'Bakso', 'Soto', 'Sate', 'Western', 'Minuman']

interface Props {
  initial?: Stall
  submitLabel: string
  busy: boolean
  serverErrors: Record<string, string>
  onSubmit: (input: StallInput) => void
  onCancel: () => void
}

type FormErrors = Partial<Record<keyof StallInput, string>>

function validate(values: { name: string; category: string; location: string; description: string }): FormErrors {
  const errors: FormErrors = {}
  const name = values.name.trim()
  if (!name) errors.name = 'Nama warung wajib diisi'
  else if (name.length < 3) errors.name = 'Nama minimal 3 karakter'
  else if (name.length > 100) errors.name = 'Nama maksimal 100 karakter'
  if (values.category.trim().length > 50) errors.category = 'Kategori maksimal 50 karakter'
  if (values.location.trim().length > 100) errors.location = 'Lokasi maksimal 100 karakter'
  if (values.description.trim().length > 1000) errors.description = 'Deskripsi maksimal 1000 karakter'
  return errors
}

const emptyToNull = (value: string) => (value.trim() === '' ? null : value.trim())

export default function StallForm({ initial, submitLabel, busy, serverErrors, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [clientErrors, setClientErrors] = useState<FormErrors>({})

  // Validasi di frontend hanya untuk umpan balik cepat; backend tetap memvalidasi ulang.
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const errors = validate({ name, category, location, description })
    setClientErrors(errors)
    if (Object.keys(errors).length > 0) return

    onSubmit({
      name: name.trim(),
      category: emptyToNull(category),
      location: emptyToNull(location),
      description: emptyToNull(description),
    })
  }

  const err = (field: keyof StallInput) => clientErrors[field] ?? serverErrors[field]

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="label">
          Nama warung <span className="text-chili">*</span>
        </label>
        <input
          id="name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(err('name'))}
          placeholder="Contoh: Bakso Pasca"
          disabled={busy}
        />
        <FieldError message={err('name')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="label">
            Kategori
          </label>
          <input
            id="category"
            className="input"
            list="category-options"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-invalid={Boolean(err('category'))}
            placeholder="Contoh: Bakso"
            disabled={busy}
          />
          <datalist id="category-options">
            {CATEGORY_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <FieldError message={err('category')} />
        </div>

        <div>
          <label htmlFor="location" className="label">
            Lokasi
          </label>
          <input
            id="location"
            className="input"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            aria-invalid={Boolean(err('location'))}
            placeholder="Contoh: Kantin Teknik"
            disabled={busy}
          />
          <FieldError message={err('location')} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label">
          Deskripsi
        </label>
        <textarea
          id="description"
          rows={4}
          className="input resize-y"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          aria-invalid={Boolean(err('description'))}
          placeholder="Ceritakan singkat tentang warung ini"
          disabled={busy}
        />
        <FieldError message={err('description')} />
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {busy ? 'Menyimpan...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
