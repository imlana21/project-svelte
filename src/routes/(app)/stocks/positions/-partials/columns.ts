import type { ColumnDef } from '$lib/types/Api'

export const positionColumns: ColumnDef[] = [
	{ key: 'emiten', label: 'Emiten', sortable: true },
	{ key: 'lot', label: 'Lot', sortable: true },
	{ key: 'avg_price', label: 'Harga Rata-rata', sortable: true },
	{ key: 'status', label: 'Status', sortable: true },
	{ key: 'trend', label: 'Trend' },
	{ key: 'open_date', label: 'Tanggal Buka', sortable: true },
]
