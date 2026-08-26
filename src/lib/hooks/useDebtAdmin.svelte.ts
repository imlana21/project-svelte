import type { FinanceDebt, StoreDebtPayload, UpdateDebtPayload } from '$lib/types/finance/Debt'
import * as debtService from '$lib/services/debt.service'
import { useCrud } from './useCrud.svelte'

export function useDebtAdmin() {
	const crud = useCrud<FinanceDebt, StoreDebtPayload, UpdateDebtPayload>({
		fetchAll: debtService.fetchDebts,
		fetchById: debtService.fetchDebt,
		create: debtService.createDebt,
		update: debtService.updateDebt,
		remove: debtService.deleteDebt,
	})

	async function togglePaid(id: number, isPaid: boolean): Promise<void> {
		if (isPaid) {
			await debtService.unmarkDebtAsPaid(id)
		} else {
			await debtService.markDebtAsPaid(id)
		}
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
		togglePaid,
	}
}
