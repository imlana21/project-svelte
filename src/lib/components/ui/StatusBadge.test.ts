import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import StatusBadge from './StatusBadge.svelte'

describe('StatusBadge', () => {
	it('renders true label when value is true', () => {
		render(StatusBadge, { props: { value: true } })
		expect(screen.getByText('Aktif')).toBeInTheDocument()
	})

	it('renders false label when value is false', () => {
		render(StatusBadge, { props: { value: false } })
		expect(screen.getByText('Nonaktif')).toBeInTheDocument()
	})

	it('renders custom true label', () => {
		render(StatusBadge, { props: { value: true, trueLabel: 'Active' } })
		expect(screen.getByText('Active')).toBeInTheDocument()
	})

	it('renders custom false label', () => {
		render(StatusBadge, { props: { value: false, falseLabel: 'Inactive' } })
		expect(screen.getByText('Inactive')).toBeInTheDocument()
	})

	it('does not render false label when value is true', () => {
		render(StatusBadge, { props: { value: true } })
		expect(screen.queryByText('Nonaktif')).not.toBeInTheDocument()
	})
})
