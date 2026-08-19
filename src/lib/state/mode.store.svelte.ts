type Mode = 'light' | 'dark'

const STORAGE_KEY = 'mode'

class ModeStore {
	mode = $state<Mode>('light')

	constructor() {
		if (typeof window === 'undefined') return
		const stored = localStorage.getItem(STORAGE_KEY) as Mode | null
		this.mode = stored ?? this.getSystemPreference()
		this.apply(this.mode)
	}

	private getSystemPreference(): Mode {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}

	private apply(mode: Mode): void {
		document.documentElement.setAttribute('data-mode', mode)
	}

	toggle(): void {
		this.mode = this.mode === 'light' ? 'dark' : 'light'
		localStorage.setItem(STORAGE_KEY, this.mode)
		this.apply(this.mode)
	}
}

export const modeStore = new ModeStore()
