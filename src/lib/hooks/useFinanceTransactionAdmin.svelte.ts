import type { FinanceTransaction, StoreFinanceTransactionPayload, UpdateFinanceTransactionPayload } from '$lib/types/finance/Transaction'
import * as financeTransactionService from '$lib/services/finance-transaction.service'
import { useCrud } from './useCrud.svelte'

export function useFinanceTransactionAdmin() {
	const crud = useCrud<FinanceTransaction, StoreFinanceTransactionPayload, UpdateFinanceTransactionPayload>({
		fetchAll: financeTransactionService.fetchFinanceTransactions,
		fetchById: financeTransactionService.fetchFinanceTransaction,
		create: financeTransactionService.createFinanceTransaction,
		update: financeTransactionService.updateFinanceTransaction,
		remove: financeTransactionService.deleteFinanceTransaction,
	})

	let importing = $state(false)

	async function importFinanceTransactions(file: File) {
		importing = true
		try {
			return await financeTransactionService.importFinanceTransactions(file)
		} finally {
			importing = false
		}
	}

	return {
		get items() { return crud.items },
		get item() { return crud.item },
		get meta() { return crud.meta },
		get loading() { return crud.loading },
		get importing() { return importing },
		fetchAll: crud.fetchAll,
		fetchById: crud.fetchById,
		create: crud.create,
		update: crud.update,
		remove: crud.remove,
		setItem: crud.setItem,
		importFinanceTransactions,
	}
}
