import type { StockAnalysis, StoreAnalysisPayload, UpdateAnalysisPayload } from '$lib/types/Stock'
import * as analysisService from '$lib/services/analysis.service'
import { useCrud } from './useCrud.svelte'

export function useAnalysisAdmin() {
	return useCrud<StockAnalysis, StoreAnalysisPayload, UpdateAnalysisPayload>({
		fetchAll: analysisService.fetchAnalyses,
		fetchById: analysisService.fetchAnalysis,
		create: analysisService.createAnalysis,
		update: analysisService.updateAnalysis,
		remove: analysisService.deleteAnalysis,
	})
}
