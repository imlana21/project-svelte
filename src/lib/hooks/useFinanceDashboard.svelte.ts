import type { FinanceTransaction } from '$lib/types/finance/Transaction'
import type { FinancePocket } from '$lib/types/finance/Pocket'
import type { FinanceDebt } from '$lib/types/finance/Debt'
import type { FinanceIncome } from '$lib/types/finance/Income'
import { fetchAllPages } from '$lib/services/pagination.service'
import { fetchFinanceTransactions } from '$lib/services/finance-transaction.service'
import { fetchPockets } from '$lib/services/pocket.service'
import { fetchDebts } from '$lib/services/debt.service'
import { fetchIncomes } from '$lib/services/income.service'
import {
	type SpendingGranularity,
	type SpendingPoint,
	type UnpaidDebtRow,
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
} from '$lib/utils/financeDashboardCalc'

export type { SpendingGranularity, SpendingPoint, UnpaidDebtRow }

export { buildUnpaidDebts, buildSpendingSeries, shiftMonth }

export function useFinanceDashboard() {
	let pockets = $state<FinancePocket[]>([])
	let debts = $state<FinanceDebt[]>([])
	let incomes = $state<FinanceIncome[]>([])
	let transactions = $state<FinanceTransaction[]>([])
	let loading = $state(false)

	async function loadAll() {
		loading = true
		try {
			const [pocketRes, debtRes, incomeRes, txRes] = await Promise.all([
				fetchAllPages(fetchPockets),
				fetchAllPages(fetchDebts),
				fetchAllPages(fetchIncomes),
				fetchAllPages(fetchFinanceTransactions)
			])
			pockets = pocketRes
			debts = debtRes
			incomes = incomeRes
			transactions = txRes
		} finally {
			loading = false
		}
	}

	const now = new Date()
	const lastMonth = shiftMonth(now, -1)

	const balance = $derived(totalBalance(pockets))
	const spendingThisMonth = $derived(totalSpendingForMonth(transactions, now))
	const spendingLastMonth = $derived(totalSpendingForMonth(transactions, lastMonth))
	const spendingDelta = $derived(monthOverMonthDelta(spendingThisMonth, spendingLastMonth))
	const incomeThisMonth = $derived(totalIncomeForMonth(incomes, now))
	const incomeLastMonth = $derived(totalIncomeForMonth(incomes, lastMonth))
	const incomeDelta = $derived(monthOverMonthDelta(incomeThisMonth, incomeLastMonth))
	const debtPerMonth = $derived(totalDebtPerMonth(debts))
	const unpaidCount = $derived(unpaidDebtCount(debts))

	return {
		get pockets() { return pockets },
		get debts() { return debts },
		get incomes() { return incomes },
		get transactions() { return transactions },
		get loading() { return loading },
		get balance() { return balance },
		get spendingThisMonth() { return spendingThisMonth },
		get spendingDelta() { return spendingDelta },
		get incomeThisMonth() { return incomeThisMonth },
		get incomeDelta() { return incomeDelta },
		get debtPerMonth() { return debtPerMonth },
		get unpaidCount() { return unpaidCount },
		loadAll,
		buildSpendingSeries,
		buildUnpaidDebts,
		shiftMonth
	}
}
