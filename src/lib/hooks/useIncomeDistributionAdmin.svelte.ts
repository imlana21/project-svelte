import type { FinanceIncomeDistribution } from '$lib/types/finance/IncomeDistribution'
import * as incomeDistributionService from '$lib/services/income-distribution.service'
import { useCrud } from './useCrud.svelte'

export function useIncomeDistributionAdmin() {
	const crud = useCrud<FinanceIncomeDistribution>({
		fetchAll: incomeDistributionService.fetchIncomeDistributions,
		fetchById: incomeDistributionService.fetchIncomeDistribution,
	})

	return {
		get items() { return crud.items },
		get item() { return crud.item },
		get meta() { return crud.meta },
		get loading() { return crud.loading },
		fetchAll: crud.fetchAll,
		fetchById: crud.fetchById,
		setItem: crud.setItem,
	}
}
