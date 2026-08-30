import type { StockTransaction, StoreTransactionPayload } from '$lib/types/Stock'
import * as transactionService from '$lib/services/transaction.service'
import { useCrud } from './useCrud.svelte'

export function useTransactionAdmin() {
	const crud = useCrud<StockTransaction, StoreTransactionPayload>({
		fetchAll: transactionService.fetchTransactions,
		fetchById: transactionService.fetchTransaction,
		create: transactionService.createTransaction,
		remove: transactionService.deleteTransaction,
	})

	let importing = $state(false)

	async function importTransactions(file: File) {
		importing = true
		try {
			return await transactionService.importTransactions(file)
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
		remove: crud.remove,
		setItem: crud.setItem,
		importTransactions,
	}
}
