import type { StockTransaction, StoreTransactionPayload } from '$lib/types/Stock'
import * as transactionService from '$lib/services/transaction.service'
import { useCrud } from './useCrud.svelte'

export function useTransactionAdmin() {
	return useCrud<StockTransaction, StoreTransactionPayload>({
		fetchAll: transactionService.fetchTransactions,
		fetchById: transactionService.fetchTransaction,
		create: transactionService.createTransaction,
		remove: transactionService.deleteTransaction,
	})
}
