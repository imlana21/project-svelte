import { sidebarStore } from '$lib/state/sidebar.store.svelte'

export function useSidebar() {
	return sidebarStore
}
