import { createToaster } from '@skeletonlabs/skeleton-svelte'

export const toaster = createToaster({
	placement: 'bottom-end',
})

export function toastSuccess(title: string): void {
	toaster.create({ type: 'success', title })
}

export function toastError(title: string): void {
	toaster.create({ type: 'error', title })
}
