import type { ColumnDef } from '$lib/types/Api'

export const incomeDistributionColumns: ColumnDef[] = [
	{ key: 'income_period', label: 'Periode Pemasukan' },
	{ key: 'pocket', label: 'Pocket' },
	{ key: 'category_name', label: 'Kategori' },
	{ key: 'percentage_snapshot', label: 'Persentase' },
	{ key: 'amount', label: 'Jumlah' },
]
