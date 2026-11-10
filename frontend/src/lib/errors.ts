import axios from 'axios'
import type { ApiErrorBody, FieldIssue } from '../types/api'

export interface ParsedError {
  status: number | null
  message: string
  fields: Record<string, string>
  isNetwork: boolean
}

// Mengubah error Axios / error lain menjadi pesan yang siap ditampilkan.
export function parseError(error: unknown): ParsedError {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return {
        status: null,
        isNetwork: true,
        fields: {},
        message:
          error.code === 'ECONNABORTED'
            ? 'Server terlalu lama merespons. Coba lagi sebentar.'
            : 'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.',
      }
    }

    const { status, data } = error.response
    const fields: Record<string, string> = {}
    const issues: FieldIssue[] = Array.isArray(data?.errors) ? data.errors : []
    for (const issue of issues) {
      if (issue.field && !fields[issue.field]) fields[issue.field] = issue.message
    }

    return {
      status,
      isNetwork: false,
      fields,
      message: data?.message || `Permintaan gagal (HTTP ${status}).`,
    }
  }

  return {
    status: null,
    isNetwork: false,
    fields: {},
    message: error instanceof Error ? error.message : 'Terjadi kesalahan tak terduga.',
  }
}
