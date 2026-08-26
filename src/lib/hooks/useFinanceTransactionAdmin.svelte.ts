import type { FinanceTransaction, StoreFinanceTransactionPayload, UpdateFinanceTransactionPayload } from '$lib/types/finance/Transaction'
import * as financeTransactionService from '$lib/services/finance-transaction.service'
import { useCrud } from './useCrud.svelte'

export function useFinanceTransactionAdmin() {
	return useCrud<FinanceTransaction, StoreFinanceTransactionPayload, UpdateFinanceTransactionPayload>({
		fetchAll: financeTransactionService.fetchFinanceTransactions,
		fetchById: financeTransactionService.fetchFinanceTransaction,
		create: financeTransactionService.createFinanceTransaction,
		update: financeTransactionService.updateFinanceTransaction,
		remove: financeTransactionService.deleteFinanceTransaction,
	})
}
