import { describe, it, expect, vi } from 'vitest'
import { useCrud } from '$lib/hooks/useCrud.svelte'
import type { CrudService } from '$lib/hooks/useCrud.svelte'
import type { PaginatedResponse } from '$lib/types/Api'

interface TestItem {
	id: number
	name: string
}

function makeService(overrides: Partial<CrudService<TestItem>> = {}): CrudService<TestItem> {
	return {
		fetchAll: vi.fn().mockResolvedValue({
			data: [],
			meta: { current_page: 1, from: 1, last_page: 1, links: [], path: '/', perPage: 10, to: 0, total: 0 }
		}),
		...overrides
	}
}

function makeResponse(data: TestItem[] = []): PaginatedResponse<TestItem> {
	return {
		status: true,
		message: 'ok',
		data,
		meta: {
			current_page: 1,
			from: 1,
			last_page: 1,
			links: [],
			path: '/',
			perPage: 10,
			to: data.length,
			total: data.length
		},
		links: { first: null, last: null, prev: null, next: null }
	}
}

describe('useCrud', () => {
	it('initializes with empty state', () => {
		const crud = useCrud(makeService())
		expect(crud.items).toEqual([])
		expect(crud.item).toBeUndefined()
		expect(crud.meta).toBeUndefined()
		expect(crud.loading).toBe(false)
	})

	it('fetchAll populates items and meta', async () => {
		const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
		const service = makeService({ fetchAll: vi.fn().mockResolvedValue(makeResponse(items)) })
		const crud = useCrud(service)
		await crud.fetchAll()
		expect(crud.items).toHaveLength(2)
		expect(crud.meta).toBeDefined()
		expect(crud.meta?.total).toBe(2)
	})

	it('fetchAll sets loading during call', async () => {
		let resolvePromise: any
		const service = makeService({
			fetchAll: vi.fn().mockImplementation(() => new Promise((r) => { resolvePromise = r }))
		})
		const crud = useCrud(service)
		const promise = crud.fetchAll()
		expect(crud.loading).toBe(true)
		resolvePromise(makeResponse())
		await promise
		expect(crud.loading).toBe(false)
	})

	it('fetchById sets item', async () => {
		const service = makeService({
			fetchById: vi.fn().mockResolvedValue({ status: true, message: 'ok', data: { id: 5, name: 'Fetched' } })
		})
		const crud = useCrud(service)
		await crud.fetchById(5)
		expect(crud.item).toEqual({ id: 5, name: 'Fetched' })
	})

	it('fetchById does nothing when service.fetchById is missing', async () => {
		const service = makeService()
		delete service.fetchById
		const crud = useCrud(service)
		await crud.fetchById(1)
		expect(crud.item).toBeUndefined()
	})

	it('create calls service.create', async () => {
		const create = vi.fn().mockResolvedValue({ status: true, message: 'ok', data: {} })
		const service = makeService({ create })
		const crud = useCrud(service)
		await crud.create({ name: 'New' } as any)
		expect(create).toHaveBeenCalledWith({ name: 'New' })
	})

	it('update calls service.update', async () => {
		const update = vi.fn().mockResolvedValue({ status: true, message: 'ok', data: {} })
		const service = makeService({ update })
		const crud = useCrud(service)
		await crud.update(1, { name: 'Updated' } as any)
		expect(update).toHaveBeenCalledWith(1, { name: 'Updated' })
	})

	it('remove calls service.remove and filters item', async () => {
		const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
		const remove = vi.fn().mockResolvedValue({ status: true, message: 'ok', data: null })
		const service = makeService({
			fetchAll: vi.fn().mockResolvedValue(makeResponse(items)),
			remove
		})
		const crud = useCrud(service)
		await crud.fetchAll()
		await crud.remove(1)
		expect(remove).toHaveBeenCalledWith(1)
		expect(crud.items.find((i) => i.id === 1)).toBeUndefined()
		expect(crud.items).toHaveLength(1)
	})

	it('setItem sets item', () => {
		const crud = useCrud(makeService())
		crud.setItem({ id: 3, name: 'Custom' })
		expect(crud.item).toEqual({ id: 3, name: 'Custom' })
	})

	it('setItem with undefined clears item', () => {
		const crud = useCrud(makeService())
		crud.setItem({ id: 3, name: 'Custom' })
		crud.setItem(undefined)
		expect(crud.item).toBeUndefined()
	})

	it('reset clears all state', async () => {
		const service = makeService({
			fetchAll: vi.fn().mockResolvedValue(makeResponse([{ id: 1, name: 'A' }]))
		})
		const crud = useCrud(service)
		await crud.fetchAll()
		crud.setItem({ id: 1, name: 'A' })
		crud.reset()
		expect(crud.items).toEqual([])
		expect(crud.item).toBeUndefined()
		expect(crud.meta).toBeUndefined()
	})

	it('setParams stores params', () => {
		const crud = useCrud(makeService())
		crud.setParams({ page: 2, perPage: 25 })
		expect(crud.params).toEqual({ page: 2, perPage: 25 })
	})
})
