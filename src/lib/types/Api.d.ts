export type SortOrder = 'asc' | 'desc'

/**
 * Envelope konsisten dari `App\Http\Resources\ApiResources`.
 * - Paginated → `data` berisi array + `meta` & `links` tersedia
 * - Single/detail → `data` berisi object
 */
export interface ApiEnvelope<T> {
	status: boolean
	message: string
	data: T
}

export type PaginatedResponse<T> = ApiEnvelope<T[]> & {
	meta: PaginationMeta
	links: PaginationLink
}

export interface ColumnDef {
	key: string
	label: string
	className?: string
	sortable?: boolean
}

export interface FieldDef {
	key: string
	label: string
	required?: boolean
}

/** Query params yang dipahami `HasApiIndex` di backend. */
export interface RequestParams {
	page: number
	perPage: number
	search?: string
	orderBy?: string
	orderDirection?: SortOrder
	[key: string]: string | number | boolean | undefined
}

export interface PaginationLink {
	first: string | null
	last: string | null
	prev: string | null
	next: string | null
}

export interface PaginationMeta {
	current_page: number
	from: number | null
	last_page: number
	links: PaginationMetaLink[]
	path: string
	perPage: number
	to: number | null
	total: number
}

export interface PaginationMetaLink {
	url: string | null
	label: string
	active: boolean
}