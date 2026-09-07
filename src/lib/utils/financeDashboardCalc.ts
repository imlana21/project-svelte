import type { FinanceTransaction } from '$lib/types/finance/Transaction'
import type { FinancePocket } from '$lib/types/finance/Pocket'
import type { FinanceDebt } from '$lib/types/finance/Debt'
import type { FinanceIncome } from '$lib/types/finance/Income'

export type SpendingGranularity = 'daily' | 'weekly' | 'monthly'

export type SpendingPoint = {
	key: string
	label: string
	amount: number
}

export type UnpaidDebtRow = FinanceDebt & {
	isOverdue: boolean
	dueInDays: number
}

export function monthKeyOf(dateStr: string | null | undefined): string | null {
	if (!dateStr) return null
	const d = new Date(dateStr)
	if (Number.isNaN(d.getTime())) return null
	return d.toISOString().slice(0, 7)
}

export function startOfWeek(date: Date): Date {
	const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
	const day = d.getDay()
	const diff = (day === 0 ? -6 : 1) - day
	d.setDate(d.getDate() + diff)
	return d
}

const DAY_FORMATTER = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short' })
const MONTH_FORMATTER = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' })

const WINDOW_SIZE: Record<SpendingGranularity, number> = {
	daily: 14,
	weekly: 8,
	monthly: 6
}

export function totalBalance(pockets: FinancePocket[]): number {
	return pockets.filter((p) => p.is_active).reduce((sum, p) => sum + p.balance, 0)
}

export function totalSpendingForMonth(transactions: FinanceTransaction[], reference: Date): number {
	const key = reference.toISOString().slice(0, 7)
	return transactions
		.filter((t) => t.type === 'expense' && monthKeyOf(t.date) === key)
		.reduce((sum, t) => sum + t.amount, 0)
}

export function totalIncomeForMonth(incomes: FinanceIncome[], reference: Date): number {
	const key = reference.toISOString().slice(0, 7)
	return incomes.filter((i) => i.period === key).reduce((sum, i) => sum + i.amount, 0)
}

export function totalDebtPerMonth(debts: FinanceDebt[]): number {
	return debts.filter((d) => d.is_active).reduce((sum, d) => sum + d.amount_per_month, 0)
}

export function unpaidDebtCount(debts: FinanceDebt[]): number {
	return debts.filter((d) => d.is_active && !d.is_paid_this_month).length
}

export function monthOverMonthDelta(current: number, previous: number): number | null {
	if (previous === 0) return current === 0 ? 0 : null
	return ((current - previous) / Math.abs(previous)) * 100
}

export function buildUnpaidDebts(debts: FinanceDebt[], reference: Date): UnpaidDebtRow[] {
	const today = reference.getDate()
	return debts
		.filter((d) => d.is_active && !d.is_paid_this_month)
		.map((d) => ({
			...d,
			isOverdue: d.due_date < today,
			dueInDays: d.due_date - today
		}))
		.sort((a, b) => a.due_date - b.due_date)
}

export function buildSpendingSeries(
	transactions: FinanceTransaction[],
	granularity: SpendingGranularity
): SpendingPoint[] {
	const expenses = transactions.filter((t) => t.type === 'expense')
	const buckets = new Map<string, { date: Date; amount: number }>()

	for (const t of expenses) {
		const d = new Date(t.date)
		if (Number.isNaN(d.getTime())) continue

		let bucketDate: Date
		let key: string

		if (granularity === 'daily') {
			bucketDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
			key = bucketDate.toISOString().slice(0, 10)
		} else if (granularity === 'weekly') {
			bucketDate = startOfWeek(d)
			key = bucketDate.toISOString().slice(0, 10)
		} else {
			bucketDate = new Date(d.getFullYear(), d.getMonth(), 1)
			key = bucketDate.toISOString().slice(0, 7)
		}

		const cur = buckets.get(key) ?? { date: bucketDate, amount: 0 }
		cur.amount += t.amount
		buckets.set(key, cur)
	}

	const sortedKeys = Array.from(buckets.keys()).sort()
	const limited = sortedKeys.slice(-WINDOW_SIZE[granularity])

	return limited.map((key) => {
		const bucket = buckets.get(key)!
		const label = granularity === 'monthly' ? MONTH_FORMATTER.format(bucket.date) : DAY_FORMATTER.format(bucket.date)
		return { key, label, amount: bucket.amount }
	})
}

export function shiftMonth(reference: Date, offset: number): Date {
	return new Date(reference.getFullYear(), reference.getMonth() + offset, 1)
}
