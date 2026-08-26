import type { FinanceIncome, StoreIncomePayload, UpdateIncomePayload } from '$lib/types/finance/Income'
import * as incomeService from '$lib/services/income.service'
import { useCrud } from './useCrud.svelte'

export function useIncomeAdmin() {
	const crud = useCrud<FinanceIncome, StoreIncomePayload, UpdateIncomePayload>({
		fetchAll: incomeService.fetchIncomes,
		fetchById: incomeService.fetchIncome,
		create: incomeService.createIncome,
		update: incomeService.updateIncome,
		remove: incomeService.deleteIncome,
	})

	async function distribute(id: number): Promise<void> {
		await incomeService.distributeIncome(id)
	}

	async function rollback(id: number): Promise<void> {
		await incomeService.rollbackDistributeIncome(id)
	}

	return {
		get items() { return crud.items },
		get item() { return crud.item },
		get meta() { return crud.meta },
		get loading() { return crud.loading },
		fetchAll: crud.fetchAll,
		fetchById: crud.fetchById,
		create: crud.create,
		update: crud.update,
		remove: crud.remove,
		setItem: crud.setItem,
		distribute,
		rollback,
	}
}
