<script lang="ts">
	import { untrack } from 'svelte';
	import { Check, ChevronsUpDown, Loader2, X } from '@lucide/svelte';
	import AppDialog from './AppDialog.svelte';

	interface ComboboxItem {
		value: string;
		label: string;
	}

	interface Props {
		value?: string;
		items: ComboboxItem[];
		loading?: boolean;
		placeholder?: string;
		searchPlaceholder?: string;
		disabled?: boolean;
		error?: string | null;
		onChange: (value: string) => void;
		onSearch: (query: string) => void;
		debounceMs?: number;
	}

	let {
		value = '',
		items,
		loading = false,
		placeholder = 'Pilih item...',
		searchPlaceholder = 'Cari...',
		disabled = false,
		error = null,
		onChange,
		onSearch,
		debounceMs = 400,
	}: Props = $props();

	let open = $state(false);
	let query = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	const selectedLabel = $derived(items.find((i) => i.value === value)?.label ?? '');

	function handleQueryChange(e: Event) {
		const target = e.target as HTMLInputElement;
		query = target.value;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearch(query.trim());
		}, debounceMs);
	}

	function handleSelect(itemValue: string) {
		onChange(itemValue);
		open = false;
		query = '';
	}

	function handleClear(e: MouseEvent) {
		e.stopPropagation();
		onChange('');
	}

	function handleOpenChange(o: boolean) {
		open = o;
		if (!o) {
			query = '';
		}
	}

	$effect(() => {
		if (untrack(() => open)) {
			onSearch('');
		}
	});
</script>

<div class="flex flex-col gap-1">
	<div class="relative">
		<button
			type="button"
			class="input flex w-full items-center justify-between gap-2 text-left {error ? 'border-error-500' : ''}"
			{disabled}
			onclick={() => !disabled && (open = true)}
		>
			<span class={value ? '' : 'text-surface-500 dark:text-surface-400'}>
				{value ? selectedLabel : placeholder}
			</span>
			<ChevronsUpDown size={16} class="shrink-0 opacity-50" />
		</button>
		{#if value}
			<button
				type="button"
				class="absolute right-8 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-surface-200 dark:hover:bg-surface-700"
				onclick={handleClear}
				tabindex={-1}
			>
				<X size={14} />
			</button>
		{/if}
	</div>

	{#if error}
		<p class="text-xs text-error-600 dark:text-error-400">{error}</p>
	{/if}

	<AppDialog {open} onOpenChange={handleOpenChange} title={placeholder}>
		<div class="flex flex-col gap-3">
			<input
				class="input w-full"
				type="search"
				placeholder={searchPlaceholder}
				value={query}
				oninput={handleQueryChange}
			/>

			<div class="max-h-64 overflow-y-auto">
				{#if loading}
					<div class="flex items-center justify-center gap-2 py-6 text-surface-500 dark:text-surface-400">
						<Loader2 size={16} class="animate-spin" />
						<span class="text-sm">Memuat data...</span>
					</div>
				{:else if items.length === 0}
					<p class="py-6 text-center text-sm text-surface-500 dark:text-surface-400">
						Tidak ada data ditemukan.
					</p>
				{:else}
					<ul class="flex flex-col gap-0.5">
						{#each items as item (item.value)}
							<li>
								<button
									type="button"
									class="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors hover:bg-surface-200/60 dark:hover:bg-surface-700/40 {item.value === value ? 'bg-primary-500/10 font-medium' : ''}"
									onclick={() => handleSelect(item.value)}
								>
									<span>{item.label}</span>
									{#if item.value === value}
										<Check size={16} class="text-primary-500" />
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</AppDialog>
</div>
