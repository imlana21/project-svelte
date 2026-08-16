// src/types/Api.d.ts
import type { SortOrder } from '@/components/tables'

export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T[]
  links: PaginationLink
  meta: PaginationMeta
}

export interface PaginationLink {
  first: string
  last: string
  prev: any
  next: string
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  links: PaginationMetaLink[]
  path: string
  perPage: number
  to: number
  total: number
}

export interface PaginationMetaLink {
  url?: string
  label: string
  active: boolean
}

export interface ColumnDef<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
  className?: string
}

export interface FieldDef {
  key: string
  label: string
  required?: boolean
}

export interface RequestParams {
  page: number
  perPage: number
  search?: string
  orderBy?: string
  orderDirection?: SortOrder
}
