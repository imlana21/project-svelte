import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import RowActions from './RowActions.svelte'

vi.mock('@lucide/svelte', () => {
	const stub = () => ({ render: () => '' })
	return {
		Edit: stub,
		Eye: stub,
		MoreVertical: stub,
		Trash2: stub
	}
})

const item = { id: 1, name: 'Test' }

describe('RowActions', () => {
	it('renders nothing when no callbacks provided', () => {
		const { container } = render(RowActions, { props: { item } })
		expect(container.innerHTML).toContain('<!--')
	})

	it('renders action button when onDetail provided', () => {
		render(RowActions, { props: { item, onDetail: vi.fn() } })
		expect(screen.getByLabelText('Aksi')).toBeInTheDocument()
	})

	it('renders action button when onEdit provided', () => {
		render(RowActions, { props: { item, onEdit: vi.fn() } })
		expect(screen.getByLabelText('Aksi')).toBeInTheDocument()
	})

	it('renders action button when onDelete provided', () => {
		render(RowActions, { props: { item, onDelete: vi.fn() } })
		expect(screen.getByLabelText('Aksi')).toBeInTheDocument()
	})

	it('shows dropdown items when button clicked', async () => {
		render(RowActions, {
			props: { item, onDetail: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() }
		})
		await fireEvent.click(screen.getByLabelText('Aksi'))
		expect(screen.getByText('Detail')).toBeInTheDocument()
		expect(screen.getByText('Edit')).toBeInTheDocument()
		expect(screen.getByText('Hapus')).toBeInTheDocument()
	})

	it('calls onDetail when Detail clicked', async () => {
		const onDetail = vi.fn()
		render(RowActions, { props: { item, onDetail } })
		await fireEvent.click(screen.getByLabelText('Aksi'))
		await fireEvent.click(screen.getByText('Detail'))
		expect(onDetail).toHaveBeenCalledWith(item)
	})

	it('calls onEdit when Edit clicked', async () => {
		const onEdit = vi.fn()
		render(RowActions, { props: { item, onEdit } })
		await fireEvent.click(screen.getByLabelText('Aksi'))
		await fireEvent.click(screen.getByText('Edit'))
		expect(onEdit).toHaveBeenCalledWith(item)
	})

	it('calls onDelete when Hapus clicked', async () => {
		const onDelete = vi.fn()
		render(RowActions, { props: { item, onDelete } })
		await fireEvent.click(screen.getByLabelText('Aksi'))
		await fireEvent.click(screen.getByText('Hapus'))
		expect(onDelete).toHaveBeenCalledWith(item)
	})

	it('hides Detail when canDetail is false but other actions exist', async () => {
		render(RowActions, {
			props: { item, onDetail: vi.fn(), onEdit: vi.fn(), canDetail: false }
		})
		await fireEvent.click(screen.getByLabelText('Aksi'))
		expect(screen.queryByText('Detail')).not.toBeInTheDocument()
		expect(screen.getByText('Edit')).toBeInTheDocument()
	})

	it('hides Edit when canEdit is false but other actions exist', async () => {
		render(RowActions, {
			props: { item, onDetail: vi.fn(), onEdit: vi.fn(), canEdit: false }
		})
		await fireEvent.click(screen.getByLabelText('Aksi'))
		expect(screen.queryByText('Edit')).not.toBeInTheDocument()
		expect(screen.getByText('Detail')).toBeInTheDocument()
	})

	it('hides Delete when canDelete is false but other actions exist', async () => {
		render(RowActions, {
			props: { item, onDetail: vi.fn(), onDelete: vi.fn(), canDelete: false }
		})
		await fireEvent.click(screen.getByLabelText('Aksi'))
		expect(screen.queryByText('Hapus')).not.toBeInTheDocument()
		expect(screen.getByText('Detail')).toBeInTheDocument()
	})
})
