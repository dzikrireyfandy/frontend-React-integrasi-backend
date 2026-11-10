export function formatRupiah(value: number | string): string {
  const amount = Number(value)
  if (Number.isNaN(amount)) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const PALETTE = [
  { bg: '#e3f1e8', fg: '#1f5c46' },
  { bg: '#fdeccb', fg: '#7a4b00' },
  { bg: '#fbdcd3', fg: '#8a2c14' },
  { bg: '#dbe8f5', fg: '#1f4a78' },
  { bg: '#ece1f4', fg: '#58307a' },
  { bg: '#f3e9d2', fg: '#5c4a1c' },
]

// Warna kategori konsisten: kategori yang sama selalu mendapat warna yang sama.
export function categoryColor(category: string | null) {
  const text = category ?? 'Lainnya'
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

export const roleLabel: Record<string, string> = {
  admin: 'Admin',
  owner: 'Owner',
  customer: 'Customer',
}
