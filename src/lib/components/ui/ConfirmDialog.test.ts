import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ConfirmDialog from './ConfirmDialog.svelte'

describe('ConfirmDialog', () => {
	it('renders all expected elements', () => {
		const { container } = render(ConfirmDialog, {
			props: {
				open: true,
				message: 'Yakin ingin menghapus?',
				onConfirm: vi.fn(),
				onClose: vi.fn()
			}
		})
		expect(container.innerHTML).toContain('Yakin ingin menghapus?')
	})

	it('renders default title and confirm label', () => {
		const { container } = render(ConfirmDialog, {
			props: {
				open: true,
				message: 'Test',
				onConfirm: vi.fn(),
				onClose: vi.fn()
			}
		})
		expect(container.innerHTML).toContain('Konfirmasi')
		expect(container.innerHTML).toContain('Hapus')
	})

	it('renders custom title and confirm label', () => {
		const { container } = render(ConfirmDialog, {
			props: {
				open: true,
				title: 'Warning',
				message: 'Test',
				confirmLabel: 'Ya',
				onConfirm: vi.fn(),
				onClose: vi.fn()
			}
		})
		expect(container.innerHTML).toContain('Warning')
		expect(container.innerHTML).toContain('Ya')
	})

	it('shows loading text when loading', () => {
		const { container } = render(ConfirmDialog, {
			props: {
				open: true,
				message: 'Test',
				loading: true,
				onConfirm: vi.fn(),
				onClose: vi.fn()
			}
		})
		expect(container.innerHTML).toContain('Memproses...')
	})

	it('does not show loading text when not loading', () => {
		const { container } = render(ConfirmDialog, {
			props: {
				open: true,
				message: 'Test',
				loading: false,
				onConfirm: vi.fn(),
				onClose: vi.fn()
			}
		})
		expect(container.innerHTML).not.toContain('Memproses...')
	})
})
