<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import type { PaginationMeta } from '$lib/types/Api';

	interface Props {
		meta: PaginationMeta | undefined;
		onPageChange?: (page: number) => void;
		onPerPageChange?: (perPage: number) => void;
	}
	let { meta, onPageChange, onPerPageChange }: Props = $props();

	const PER_PAGE_OPTIONS = [10, 25, 50, 100];

	function pageWindow(current: number, last: number): number[] {
		const pages: number[] = [];
		const start = Math.max(1, current - 2);
		const end = Math.min(last, current + 2);
		for (let i = start; i <= end; i++) pages.push(i);
		return pages;
	}
</script>

{#if meta}
	<div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
		<p class="text-sm text-surface-500 tabular-nums dark:text-surface-400">
			Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total} data
		</p>

		<div class="flex items-center gap-1">
			{#if onPerPageChange}
				<label class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
					<span>Per halaman</span>
					<select
						class="input w-auto py-1.5"
						value={meta.perPage}
						onchange={(e) => onPerPageChange(Number((e.currentTarget as HTMLSelectElement).value))}
					>
						{#each PER_PAGE_OPTIONS as option (option)}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
			{/if}

			<button
				type="button"
				class="btn btn-icon"
				aria-label="Halaman sebelumnya"
				disabled={meta.current_page <= 1}
				onclick={() => onPageChange?.(meta.current_page - 1)}
			>
				<ChevronLeft size={16} />
			</button>

			{#each pageWindow(meta.current_page, meta.last_page) as page (page)}
				<button
					type="button"
					class={cn('btn min-w-9 px-2', page === meta.current_page && 'bg-primary-500 text-primary-contrast-500')}
					onclick={() => onPageChange?.(page)}
				>
					{page}
				</button>
			{/each}

			<button
				type="button"
				class="btn btn-icon"
				aria-label="Halaman berikutnya"
				disabled={meta.current_page >= meta.last_page}
				onclick={() => onPageChange?.(meta.current_page + 1)}
			>
				<ChevronRight size={16} />
			</button>
		</div>
	</div>
{/if}
