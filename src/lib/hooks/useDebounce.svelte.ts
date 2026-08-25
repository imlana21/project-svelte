/**
 * Debounce a reactive value using Svelte 5 runes.
 * Returns a derived value that updates only after `delay` ms of inactivity.
 *
 * @example
 * const search = $state('')
 * const debouncedSearch = useDebounce(() => search, 400)
 * $effect(() => { fetchData(debouncedSearch()) })
 */
export function useDebounce<T>(accessor: () => T, delay = 400): () => T {
	let current = $state(accessor())
	let timeout: ReturnType<typeof setTimeout> | undefined

	$effect(() => {
		const value = accessor()
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			current = value
		}, delay)
		return () => {
			if (timeout) clearTimeout(timeout)
		}
	})

	return () => current
}
