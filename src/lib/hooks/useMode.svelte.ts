import { modeStore } from '$lib/state/mode.store.svelte'

export function useMode() {
	return modeStore
}
