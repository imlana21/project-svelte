import type { PaginatedResponse, RequestParams } from '$lib/types/Api'

/** Ambil seluruh halaman dengan batas backend dan urutan yang stabil. */
export async function fetchAllPages<T>(
	fetchPage: (params: RequestParams) => Promise<PaginatedResponse<T>>,
): Promise<T[]> {
	const items: T[] = []
	let page = 1
	let lastPage = 1
	do {
		const response = await fetchPage({ page, perPage: 100, orderBy: 'id', orderDirection: 'asc' })
		items.push(...response.data)
		lastPage = response.meta.last_page
		page++
	} while (page <= lastPage)
	return items
}
