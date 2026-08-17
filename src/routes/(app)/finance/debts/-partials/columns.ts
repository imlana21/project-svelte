import type { ColumnDef } from '$lib/types/Api'

export const debtColumns: ColumnDef[] = [
	{ key: 'name', label: 'Nama', sortable: true },
	{ key: 'pocket', label: 'Pocket' },
	{ key: 'amount_per_month', label: 'Biaya/Bulan', sortable: true },
	{ key: 'due_date', label: 'Tgl Jatuh Tempo', sortable: true },
	{ key: 'is_paid_this_month', label: 'Status Bulan Ini' },
	{ key: 'is_active', label: 'Status', sortable: true },
]
