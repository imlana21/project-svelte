import { createToaster } from '@skeletonlabs/skeleton-svelte'
import { ApiError } from './http'

const isDev = import.meta.env.DEV

const HTTP_MESSAGES: Record<number, string> = {
	0: 'Tidak dapat terhubung ke server.',
	400: 'Permintaan tidak valid.',
	401: 'Sesi berakhir, silakan login kembali.',
	403: 'Anda tidak memiliki akses.',
	404: 'Data tidak ditemukan.',
	405: 'Metode tidak diizinkan.',
	409: 'Terjadi konflik dengan data yang ada.',
	419: 'Sesi telah berakhir.',
	422: 'Data yang dikirim tidak valid.',
	429: 'Terlalu banyak permintaan, coba lagi nanti.',
	500: 'Terjadi kesalahan pada server.',
	502: 'Server tidak dapat dijangkau.',
	503: 'Layanan sedang tidak tersedia.',
	504: 'Server tidak merespons.',
}

function getErrorMessage(error: unknown): string {
	if (error instanceof ApiError) {
		if (isDev) {
			const parts = [`[${error.status}] ${error.message}`]
			if (error.errors) {
				const fieldErrors = Object.entries(error.errors)
					.map(([field, msgs]) => `  ${field}: ${msgs.join(', ')}`)
					.join('\n')
				parts.push(fieldErrors)
			}
			return parts.join('\n')
		}
		return HTTP_MESSAGES[error.status] ?? `Terjadi kesalahan (${error.status})`
	}

	if (error instanceof Error) {
		return isDev ? error.message : 'Terjadi kesalahan yang tidak diketahui.'
	}

	return 'Terjadi kesalahan yang tidak diketahui.'
}

export const toaster = createToaster({
	placement: 'bottom-end',
})

export function toastSuccess(title: string): void {
	toaster.create({ type: 'success', title })
}

export function toastError(error: unknown): void {
	const message = getErrorMessage(error)
	toaster.create({ type: 'error', title: message })
}
