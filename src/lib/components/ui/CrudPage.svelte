<script lang="ts" generics="T extends { id: number }">
	import { untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import { Search } from '@lucide/svelte';
	import DataTable from './DataTable.svelte';
	import PaginationBar from './PaginationBar.svelte';
	import type { ColumnDef, PaginationMeta, SortOrder } from '$lib/types/Api';

	let {
		title,
		description,
		columns,
		items,
		meta,
		loading = false,
		search = '',
		sortConfig = null,
		onSearch,
		onSort,
		onPageChange,
		onPerPageChange,
		actions,
		cell,
		rowActions,
		children,
	}: {
		title: string;
		description?: string;
		columns: ColumnDef[];
		items: T[];
		meta: PaginationMeta | undefined;
		loading?: boolean;
		search?: string;
		sortConfig?: { key: string; order: SortOrder } | null;
		onSearch?: (value: string) => void;
		onSort?: (key: string) => void;
		onPageChange?: (page: number) => void;
		onPerPageChange?: (perPage: number) => void;
		actions?: Snippet;
		cell?: Snippet<[T, ColumnDef]>;
		rowActions?: Snippet<[T]>;
		children?: Snippet;
	} = $props();

	let searchInput = $state(untrack(() => search));

	let firstDebounce = true;
	$effect(() => {
		const value = searchInput;
		if (firstDebounce) {
			firstDebounce = false;
			return;
		}
		const cb = untrack(() => onSearch);
		if (!cb) return;
		const timer = setTimeout(() => cb(value), 400);
		return () => clearTimeout(timer);
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h2 class="text-xl font-bold">{title}</h2>
			{#if description}
				<p class="mt-0.5 text-sm text-surface-500 dark:text-surface-400">{description}</p>
			{/if}
		</div>
		{#if actions}
			<div class="flex items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>

	{#if onSearch || children}
		<div class="flex flex-wrap items-center gap-3">
			{#if onSearch}
				<div class="relative max-w-xs flex-1">
					<Search size={16} class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
					<input
						class="input w-full pl-9"
						type="search"
						placeholder="Cari..."
						bind:value={searchInput}
					/>
				</div>
			{/if}
			{#if children}
				<div class="flex items-center gap-2">
					{@render children()}
				</div>
			{/if}
		</div>
	{/if}

	<div class="card overflow-hidden p-0">
		<DataTable
			{columns}
			{items}
			{loading}
			{sortConfig}
			{onSort}
			{cell}
			{rowActions}
		/>
		{#if meta && !loading}
			<div class="border-t border-surface-300 p-4 dark:border-surface-700">
				<PaginationBar {meta} {onPageChange} {onPerPageChange} />
			</div>
		{/if}
	</div>
</div>
