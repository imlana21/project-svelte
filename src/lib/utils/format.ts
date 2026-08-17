export function formatRupiah(amount: number | string | null | undefined): string {
	if (amount === null || amount === undefined) return 'Rp 0'
	const num = typeof amount === 'string' ? parseFloat(amount) : amount
	if (isNaN(num)) return 'Rp 0'
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(num)
}

export function formatDate(date: string | null | undefined): string {
	if (!date) return '-'
	return new Date(date).toLocaleDateString('id-ID', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

export function formatDateTime(date: string | null | undefined): string {
	if (!date) return '-'
	return new Date(date).toLocaleString('id-ID', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function formatNumber(num: number | null | undefined): string {
	if (num === null || num === undefined) return '-'
	return new Intl.NumberFormat('id-ID').format(num)
}

export function formatDecimal(num: number | string | null | undefined, fractionDigits = 2): string {
	if (num === null || num === undefined) return '-'
	const n = typeof num === 'string' ? parseFloat(num) : num
	if (isNaN(n)) return '-'
	return new Intl.NumberFormat('id-ID', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(n)
}
