import type { StockAnalysis, StoreAnalysisPayload, UpdateAnalysisPayload } from '$lib/types/Stock'
import type { PaginationMeta, RequestParams } from '$lib/types/Api'
import * as analysisService from '$lib/services/analysis.service'

export function useAnalysisAdmin() {
	let items = $state<StockAnalysis[]>([])
	let item = $state<StockAnalysis | undefined>(undefined)
	let meta = $state<PaginationMeta | undefined>(undefined)
	let loading = $state(false)
	let params = $state<RequestParams | undefined>(undefined)

	async function fetchAll(override: Partial<RequestParams> = {}): Promise<void> {
		const merged: RequestParams = { page: 1, perPage: 10, ...params, ...override }
		params = merged
		loading = true
		try {
			const res = await analysisService.fetchAnalyses(merged)
			items = res.data
			meta = res.meta
		} finally {
			loading = false
		}
	}

	async function fetchById(id: number): Promise<void> {
		loading = true
		try {
			const res = await analysisService.fetchAnalysis(id)
			item = res.data
		} finally {
			loading = false
		}
	}

	async function create(payload: StoreAnalysisPayload): Promise<void> {
		loading = true
		try {
			await analysisService.createAnalysis(payload)
		} finally {
			loading = false
		}
	}

	async function createWithImage(payload: StoreAnalysisPayload, imageFile: File): Promise<void> {
		loading = true
		try {
			await analysisService.createAnalysis(payload, imageFile)
		} finally {
			loading = false
		}
	}

	async function update(id: number, payload: UpdateAnalysisPayload): Promise<void> {
		loading = true
		try {
			await analysisService.updateAnalysis(id, payload)
		} finally {
			loading = false
		}
	}

	async function updateWithImage(id: number, payload: UpdateAnalysisPayload, imageFile: File): Promise<void> {
		loading = true
		try {
			await analysisService.updateAnalysis(id, payload, imageFile)
		} finally {
			loading = false
		}
	}

	async function remove(id: number): Promise<void> {
		loading = true
		try {
			await analysisService.deleteAnalysis(id)
			items = items.filter((it) => it.id !== id)
		} finally {
			loading = false
		}
	}

	function setItem(next?: StockAnalysis): void {
		item = next
	}

	function setParams(next: RequestParams): void {
		params = next
	}

	function reset(): void {
		items = []
		item = undefined
		meta = undefined
		params = undefined
	}

	return {
		get items() { return items },
		get item() { return item },
		get meta() { return meta },
		get loading() { return loading },
		get params() { return params },
		fetchAll,
		fetchById,
		create,
		createWithImage,
		update,
		updateWithImage,
		remove,
		setItem,
		setParams,
		reset,
	}
}
