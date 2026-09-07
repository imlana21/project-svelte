import { describe, it, expect } from 'vitest'
import {
	monthKeyOf,
	startOfWeek,
	totalBalance,
	totalSpendingForMonth,
	totalIncomeForMonth,
	totalDebtPerMonth,
	unpaidDebtCount,
	monthOverMonthDelta,
	buildUnpaidDebts,
	buildSpendingSeries,
	shiftMonth
} from './financeDashboardCalc'
import type { FinanceTransaction } from '$lib/types/finance/Transaction'
import type { FinancePocket } from '$lib/types/finance/Pocket'
import type { FinanceDebt } from '$lib/types/finance/Debt'
import type { FinanceIncome } from '$lib/types/finance/Income'

function makeTx(overrides: Partial<FinanceTransaction> = {}): FinanceTransaction {
	return {
		id: 1,
		type: 'expense',
		pocket_id: 1,
		amount: 50000,
		description: 'Test',
		category_tag: null,
		date: '2025-06-15',
		debt_id: null,
		note: null,
		created_at: '2025-06-15',
		updated_at: '2025-06-15',
		...overrides
	}
}

function makePocket(overrides: Partial<FinancePocket> = {}): FinancePocket {
	return {
		id: 1,
		name: 'Main',
		description: null,
		balance: 1000000,
		allocation_config_id: 1,
		is_active: true,
		created_at: '',
		updated_at: '',
		...overrides
	}
}

function makeDebt(overrides: Partial<FinanceDebt> = {}): FinanceDebt {
	return {
		id: 1,
		name: 'Cicilan',
		amount_per_month: 500000,
		due_date: 15,
		pocket_id: 1,
		category_tag: null,
		is_paid_this_month: false,
		paid_at: null,
		is_active: true,
		note: null,
		created_at: '',
		updated_at: '',
		...overrides
	}
}

function makeIncome(overrides: Partial<FinanceIncome> = {}): FinanceIncome {
	return {
		id: 1,
		amount: 5000000,
		source: 'Salary',
		note: null,
		period: '2025-06',
		is_distributed: false,
		created_at: '',
		updated_at: '',
		...overrides
	}
}

describe('monthKeyOf', () => {
	it('returns null for null', () => {
		expect(monthKeyOf(null)).toBeNull()
	})

	it('returns null for undefined', () => {
		expect(monthKeyOf(undefined)).toBeNull()
	})

	it('returns null for invalid date', () => {
		expect(monthKeyOf('not-a-date')).toBeNull()
	})

	it('returns YYYY-MM for valid date', () => {
		expect(monthKeyOf('2025-06-15')).toBe('2025-06')
	})
})

describe('startOfWeek', () => {
	it('returns Monday for a Wednesday', () => {
		const wed = new Date('2025-06-18')
		const result = startOfWeek(wed)
		expect(result.getDay()).toBe(1)
	})

	it('returns previous Monday for a Sunday', () => {
		const sun = new Date('2025-06-22')
		const result = startOfWeek(sun)
		expect(result.getDay()).toBe(1)
	})
})

describe('totalBalance', () => {
	it('sums active pockets only', () => {
		const pockets = [
			makePocket({ balance: 1000000, is_active: true }),
			makePocket({ id: 2, balance: 500000, is_active: false }),
			makePocket({ id: 3, balance: 300000, is_active: true })
		]
		expect(totalBalance(pockets)).toBe(1300000)
	})

	it('returns 0 for empty array', () => {
		expect(totalBalance([])).toBe(0)
	})
})

describe('totalSpendingForMonth', () => {
	it('sums expenses for the given month', () => {
		const txs = [
			makeTx({ type: 'expense', amount: 50000, date: '2025-06-10' }),
			makeTx({ id: 2, type: 'expense', amount: 30000, date: '2025-06-20' }),
			makeTx({ id: 3, type: 'income', amount: 100000, date: '2025-06-15' })
		]
		expect(totalSpendingForMonth(txs, new Date('2025-06-15'))).toBe(80000)
	})

	it('ignores other months', () => {
		const txs = [makeTx({ type: 'expense', amount: 50000, date: '2025-05-10' })]
		expect(totalSpendingForMonth(txs, new Date('2025-06-15'))).toBe(0)
	})
})

describe('totalIncomeForMonth', () => {
	it('sums income for matching period', () => {
		const incomes = [
			makeIncome({ amount: 5000000, period: '2025-06' }),
			makeIncome({ id: 2, amount: 2000000, period: '2025-05' })
		]
		expect(totalIncomeForMonth(incomes, new Date('2025-06-15'))).toBe(5000000)
	})
})

describe('totalDebtPerMonth', () => {
	it('sums active debts', () => {
		const debts = [
			makeDebt({ amount_per_month: 500000, is_active: true }),
			makeDebt({ id: 2, amount_per_month: 300000, is_active: false })
		]
		expect(totalDebtPerMonth(debts)).toBe(500000)
	})
})

describe('unpaidDebtCount', () => {
	it('counts unpaid active debts', () => {
		const debts = [
			makeDebt({ is_active: true, is_paid_this_month: false }),
			makeDebt({ id: 2, is_active: true, is_paid_this_month: true }),
			makeDebt({ id: 3, is_active: false, is_paid_this_month: false })
		]
		expect(unpaidDebtCount(debts)).toBe(1)
	})
})

describe('monthOverMonthDelta', () => {
	it('returns 0 when both are 0', () => {
		expect(monthOverMonthDelta(0, 0)).toBe(0)
	})

	it('returns null when previous is 0 and current is not', () => {
		expect(monthOverMonthDelta(100, 0)).toBeNull()
	})

	it('calculates percentage delta', () => {
		expect(monthOverMonthDelta(150, 100)).toBe(50)
	})

	it('handles negative delta', () => {
		expect(monthOverMonthDelta(80, 100)).toBe(-20)
	})
})

describe('buildUnpaidDebts', () => {
	it('returns only unpaid active debts', () => {
		const debts = [
			makeDebt({ is_active: true, is_paid_this_month: false, due_date: 15 }),
			makeDebt({ id: 2, is_active: true, is_paid_this_month: true, due_date: 20 }),
			makeDebt({ id: 3, is_active: false, is_paid_this_month: false, due_date: 10 })
		]
		const ref = new Date('2025-06-20')
		const result = buildUnpaidDebts(debts, ref)
		expect(result).toHaveLength(1)
		expect(result[0].isOverdue).toBe(true)
	})

	it('marks on-time debts correctly', () => {
		const debts = [makeDebt({ is_active: true, is_paid_this_month: false, due_date: 25 })]
		const ref = new Date('2025-06-20')
		const result = buildUnpaidDebts(debts, ref)
		expect(result[0].isOverdue).toBe(false)
		expect(result[0].dueInDays).toBe(5)
	})

	it('sorts by due_date ascending', () => {
		const debts = [
			makeDebt({ due_date: 20, is_active: true, is_paid_this_month: false }),
			makeDebt({ id: 2, due_date: 10, is_active: true, is_paid_this_month: false })
		]
		const result = buildUnpaidDebts(debts, new Date('2025-06-01'))
		expect(result[0].due_date).toBe(10)
		expect(result[1].due_date).toBe(20)
	})
})

describe('buildSpendingSeries', () => {
	it('returns empty for no expenses', () => {
		expect(buildSpendingSeries([], 'daily')).toHaveLength(0)
	})

	it('groups expenses by day', () => {
		const txs = [
			makeTx({ type: 'expense', amount: 50000, date: '2025-06-10' }),
			makeTx({ id: 2, type: 'expense', amount: 30000, date: '2025-06-10' })
		]
		const result = buildSpendingSeries(txs, 'daily')
		expect(result).toHaveLength(1)
		expect(result[0].amount).toBe(80000)
	})

	it('groups expenses by month', () => {
		const txs = [
			makeTx({ type: 'expense', amount: 50000, date: '2025-06-10' }),
			makeTx({ id: 2, type: 'expense', amount: 30000, date: '2025-06-20' })
		]
		const result = buildSpendingSeries(txs, 'monthly')
		expect(result).toHaveLength(1)
		expect(result[0].amount).toBe(80000)
	})

	it('ignores non-expense transactions', () => {
		const txs = [makeTx({ type: 'income', amount: 100000, date: '2025-06-10' })]
		expect(buildSpendingSeries(txs, 'daily')).toHaveLength(0)
	})
})

describe('shiftMonth', () => {
	it('shifts forward', () => {
		const result = shiftMonth(new Date('2025-06-15'), 1)
		expect(result.getMonth()).toBe(6)
	})

	it('shifts backward', () => {
		const result = shiftMonth(new Date('2025-06-15'), -1)
		expect(result.getMonth()).toBe(4)
	})

	it('handles year boundary', () => {
		const result = shiftMonth(new Date('2025-01-15'), -1)
		expect(result.getFullYear()).toBe(2024)
		expect(result.getMonth()).toBe(11)
	})
})
