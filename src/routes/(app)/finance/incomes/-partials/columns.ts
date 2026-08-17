import type { ColumnDef } from '$lib/types/Api'

export const incomeColumns: ColumnDef[] = [
	{ key: 'period', label: 'Periode', sortable: true },
	{ key: 'source', label: 'Sumber', sortable: true },
	{ key: 'amount', label: 'Jumlah', sortable: true },
	{ key: 'is_distributed', label: 'Status Distribusi', sortable: true },
]
