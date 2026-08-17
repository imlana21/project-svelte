import type { ApiEnvelope, PaginatedResponse, PaginationMeta, RequestParams } from '$lib/types/Api'

export interface CrudService<T, CreatePayload = Partial<T>, UpdatePayload = Partial<T>> {
	fetchAll(params?: RequestParams): Promise<PaginatedResponse<T>>
	fetchById?(id: number): Promise<ApiEnvelope<T>>
	create?(payload: CreatePayload): Promise<ApiEnvelope<unknown>>
	update?(id: number, payload: UpdatePayload): Promise<ApiEnvelope<unknown>>
	remove?(id: number): Promise<ApiEnvelope<unknown>>
}

export interface UseCrud<T, CreatePayload = Partial<T>, UpdatePayload = Partial<T>> {
	items: T[]
	item: T | undefined
	meta: PaginationMeta | undefined
	loading: boolean
	params: RequestParams | undefined
	fetchAll: (override?: Partial<RequestParams>) => Promise<void>
	fetchById: (id: number) => Promise<void>
	create: (payload: CreatePayload) => Promise<void>
	update: (id: number, payload: UpdatePayload) => Promise<void>
	remove: (id: number) => Promise<void>
	setItem: (item?: T) => void
	setParams: (params: RequestParams) => void
	reset: () => void
}

export function useCrud<T, CreatePayload = Partial<T>, UpdatePayload = Partial<T>>(
	service: CrudService<T, CreatePayload, UpdatePayload>,
): UseCrud<T, CreatePayload, UpdatePayload> {
	let items = $state<T[]>([])
	let item = $state<T | undefined>(undefined)
	let meta = $state<PaginationMeta | undefined>(undefined)
	let loading = $state(false)
	let params = $state<RequestParams | undefined>(undefined)

	async function fetchAll(override: Partial<RequestParams> = {}): Promise<void> {
		const merged: RequestParams = { page: 1, perPage: 10, ...params, ...override }
		params = merged
		loading = true
		try {
			const res = await service.fetchAll(merged)
			items = res.data
			meta = res.meta
		} finally {
			loading = false
		}
	}

	async function fetchById(id: number): Promise<void> {
		if (!service.fetchById) return
		loading = true
		try {
			const res = await service.fetchById(id)
			item = res.data
		} finally {
			loading = false
		}
	}

	async function create(payload: CreatePayload): Promise<void> {
		if (!service.create) return
		loading = true
		try {
			await service.create(payload)
		} finally {
			loading = false
		}
	}

	async function update(id: number, payload: UpdatePayload): Promise<void> {
		if (!service.update) return
		loading = true
		try {
			await service.update(id, payload)
		} finally {
			loading = false
		}
	}

	async function remove(id: number): Promise<void> {
		if (!service.remove) return
		loading = true
		try {
			await service.remove(id)
			items = items.filter((it) => (it as { id: number }).id !== id)
		} finally {
			loading = false
		}
	}

	function setItem(next?: T): void {
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

	return { items, item, meta, loading, params, fetchAll, fetchById, create, update, remove, setItem, setParams, reset }
}
