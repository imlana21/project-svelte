const STORAGE_KEY = 'sidebar-collapsed'

class SidebarStore {
	collapsed = $state(false)

	constructor() {
		if (typeof window === 'undefined') return
		const stored = localStorage.getItem(STORAGE_KEY)
		this.collapsed = stored === 'true'
	}

	toggle(): void {
		this.collapsed = !this.collapsed
		localStorage.setItem(STORAGE_KEY, String(this.collapsed))
	}
}

export const sidebarStore = new SidebarStore()
