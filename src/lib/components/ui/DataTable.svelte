<script lang="ts" generics="T extends { id: number }">
	import type { Snippet } from 'svelte';
	import { ArrowDown, ArrowUp, ChevronsUpDown } from '@lucide/svelte';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';

	let {
		columns,
		items,
		loading = false,
		sortConfig = null,
		onSort,
		cell,
		rowActions,
		emptyMessage = 'Tidak ada data.',
	}: {
		columns: ColumnDef[];
		items: T[];
		loading?: boolean;
		sortConfig?: { key: string; order: SortOrder } | null;
		onSort?: (key: string) => void;
		cell?: Snippet<[T, ColumnDef]>;
		rowActions?: Snippet<[T]>;
		emptyMessage?: string;
	} = $props();
</script>

<div class="table-wrap rounded-lg border border-surface-300 dark:border-surface-700">
	{#if loading}
		<div class="flex items-center justify-center gap-3 p-8 text-surface-500 dark:text-surface-400">
			<span class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
			<span class="text-sm">Memuat data...</span>
		</div>
	{:else}
		<table class="table">
			<thead>
				<tr>
					{#each columns as column (column.key)}
						<th class="whitespace-nowrap">
							{#if column.sortable && onSort}
								<button
									type="button"
									class="inline-flex items-center gap-1 transition-colors-fast hover:text-surface-900 dark:hover:text-surface-50"
									onclick={() => onSort(column.key)}
								>
									{column.label}
									{#if sortConfig?.key === column.key}
										{#if sortConfig.order === 'asc'}
											<ArrowUp size={14} />
										{:else}
											<ArrowDown size={14} />
										{/if}
									{:else}
										<ChevronsUpDown size={14} class="opacity-50" />
									{/if}
								</button>
							{:else}
								{column.label}
							{/if}
						</th>
					{/each}
					{#if rowActions}
						<th class="w-10"></th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#if items.length === 0}
					<tr>
						<td colspan={columns.length + (rowActions ? 1 : 0)} class="py-8 text-center text-sm text-surface-500 dark:text-surface-400">
							{emptyMessage}
						</td>
					</tr>
				{:else}
					{#each items as item (item.id)}
						<tr class="transition-colors-fast hover:bg-surface-200/40 dark:hover:bg-surface-700/30">
							{#each columns as column (column.key)}
								<td class="align-middle" class:font-medium={column.key === 'name'}>
									{#if cell}
										{@render cell(item, column)}
									{/if}
								</td>
							{/each}
							{#if rowActions}
								<td class="whitespace-nowrap text-right">
									{@render rowActions(item)}
								</td>
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	{/if}
</div>
