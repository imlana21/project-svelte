import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import PaginationBar from './PaginationBar.svelte'
import type { PaginationMeta } from '$lib/types/Api'

vi.mock('@lucide/svelte', () => {
	const stub = () => ({ render: () => '' })
	return { ChevronLeft: stub, ChevronRight: stub }
})

function makeMeta(overrides: Partial<PaginationMeta> = {}): PaginationMeta {
	return {
		current_page: 1,
		from: 1,
		last_page: 5,
		links: [],
		path: '/test',
		perPage: 10,
		to: 10,
		total: 50,
		...overrides
	}
}

describe('PaginationBar', () => {
	it('renders nothing when meta is undefined', () => {
		const { container } = render(PaginationBar, { props: { meta: undefined } })
		expect(container.querySelector('.flex')).not.toBeInTheDocument()
	})

	it('displays range info', () => {
		render(PaginationBar, { props: { meta: makeMeta() } })
		expect(screen.getByText(/1–10/)).toBeInTheDocument()
		expect(screen.getByText(/50/)).toBeInTheDocument()
	})

	it('disables prev button on first page', () => {
		render(PaginationBar, { props: { meta: makeMeta({ current_page: 1 }) } })
		const prevBtn = screen.getByLabelText('Halaman sebelumnya')
		expect(prevBtn).toBeDisabled()
	})

	it('disables next button on last page', () => {
		render(PaginationBar, { props: { meta: makeMeta({ current_page: 5, last_page: 5 }) } })
		const nextBtn = screen.getByLabelText('Halaman berikutnya')
		expect(nextBtn).toBeDisabled()
	})

	it('enables prev button when not on first page', () => {
		render(PaginationBar, { props: { meta: makeMeta({ current_page: 3 }) } })
		const prevBtn = screen.getByLabelText('Halaman sebelumnya')
		expect(prevBtn).not.toBeDisabled()
	})

	it('enables next button when not on last page', () => {
		render(PaginationBar, { props: { meta: makeMeta({ current_page: 3 }) } })
		const nextBtn = screen.getByLabelText('Halaman berikutnya')
		expect(nextBtn).not.toBeDisabled()
	})

	it('calls onPageChange when next button clicked', async () => {
		const onPageChange = vi.fn()
		render(PaginationBar, { props: { meta: makeMeta({ current_page: 2 }), onPageChange } })
		const nextBtn = screen.getByLabelText('Halaman berikutnya')
		await fireEvent.click(nextBtn)
		expect(onPageChange).toHaveBeenCalledWith(3)
	})

	it('calls onPageChange when prev button clicked', async () => {
		const onPageChange = vi.fn()
		render(PaginationBar, { props: { meta: makeMeta({ current_page: 3 }), onPageChange } })
		const prevBtn = screen.getByLabelText('Halaman sebelumnya')
		await fireEvent.click(prevBtn)
		expect(onPageChange).toHaveBeenCalledWith(2)
	})

	it('calls onPageChange when page number clicked', async () => {
		const onPageChange = vi.fn()
		render(PaginationBar, { props: { meta: makeMeta({ current_page: 2 }), onPageChange } })
		const page3 = screen.getByText('3')
		await fireEvent.click(page3)
		expect(onPageChange).toHaveBeenCalledWith(3)
	})

	it('calls onPerPageChange when select changes', async () => {
		const onPerPageChange = vi.fn()
		render(PaginationBar, { props: { meta: makeMeta(), onPerPageChange } })
		const select = screen.getByRole('combobox')
		await fireEvent.change(select, { target: { value: '25' } })
		expect(onPerPageChange).toHaveBeenCalledWith(25)
	})

	it('does not render per-page select when onPerPageChange is not provided', () => {
		render(PaginationBar, { props: { meta: makeMeta() } })
		expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
	})
})
