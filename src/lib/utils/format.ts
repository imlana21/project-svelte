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

export function formatNumber(num: number | null | undefined): string {
	if (num === null || num === undefined) return '-'
	return new Intl.NumberFormat('id-ID').format(num)
}


