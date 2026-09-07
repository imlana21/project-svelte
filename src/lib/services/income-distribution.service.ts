import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { FinanceIncomeDistribution } from '$lib/types/finance/IncomeDistribution'
import { http } from '$lib/utils/http'

export function fetchIncomeDistributions(params?: RequestParams): Promise<PaginatedResponse<FinanceIncomeDistribution>> {
	return http.get<PaginatedResponse<FinanceIncomeDistribution>>('/finance/income-distributions', params)
}

export function fetchIncomeDistribution(id: number): Promise<ApiEnvelope<FinanceIncomeDistribution>> {
	return http.get<ApiEnvelope<FinanceIncomeDistribution>>(`/finance/income-distributions/${id}`)
}
