import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import DataTable from './DataTable.svelte'
import type { ColumnDef } from '$lib/types/Api'

vi.mock('@lucide/svelte', () => {
	const stub = () => ({ render: () => '' })
	return {
		ArrowDown: stub,
		ArrowUp: stub,
		ChevronsUpDown: stub,
		MoreVertical: stub,
		Edit: stub,
		Eye: stub,
		Trash2: stub
	}
})

const columns: ColumnDef[] = [
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'email', label: 'Email' }
]

const items = [
	{ id: 1, name: 'Alice', email: 'alice@test.com' },
	{ id: 2, name: 'Bob', email: 'bob@test.com' }
]

describe('DataTable', () => {
	it('shows loading spinner', () => {
		render(DataTable, { props: { columns, items: [], loading: true } })
		expect(screen.getByText('Memuat data...')).toBeInTheDocument()
	})

	it('shows empty message when no items', () => {
		render(DataTable, { props: { columns, items: [] } })
		expect(screen.getByText('Tidak ada data.')).toBeInTheDocument()
	})

	it('shows custom empty message', () => {
		render(DataTable, { props: { columns, items: [], emptyMessage: 'Kosong' } })
		expect(screen.getByText('Kosong')).toBeInTheDocument()
	})

	it('renders column headers', () => {
		render(DataTable, { props: { columns, items } })
		expect(screen.getByText('Name')).toBeInTheDocument()
		expect(screen.getByText('Email')).toBeInTheDocument()
	})

	it('renders correct number of rows', () => {
		const { container } = render(DataTable, { props: { columns, items } })
		const rows = container.querySelectorAll('tbody tr')
		expect(rows).toHaveLength(2)
	})

	it('calls onSort when sortable header clicked', async () => {
		const onSort = vi.fn()
		render(DataTable, { props: { columns, items, onSort } })
		await fireEvent.click(screen.getByText('Name'))
		expect(onSort).toHaveBeenCalledWith('name')
	})

	it('does not call onSort for non-sortable column', async () => {
		const onSort = vi.fn()
		render(DataTable, { props: { columns, items, onSort } })
		await fireEvent.click(screen.getByText('Email'))
		expect(onSort).not.toHaveBeenCalled()
	})

	it('does not render table when loading', () => {
		const { container } = render(DataTable, { props: { columns, items: [], loading: true } })
		expect(container.querySelector('table')).not.toBeInTheDocument()
	})
})
