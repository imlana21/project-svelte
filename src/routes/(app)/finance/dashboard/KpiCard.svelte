<script lang="ts">
	import type { Component } from 'svelte'
	import { cn } from '$lib/utils'

	type KpiTone = 'default' | 'success' | 'destructive' | 'warning'

	let {
		title,
		icon,
		value,
		subtitle,
		delta,
		tone = 'default'
	}: {
		title: string
		icon: Component
		value: string
		subtitle?: string
		delta?: number | null
		tone?: KpiTone
	} = $props()

	const TONE_ICON_BG: Record<KpiTone, string> = {
		default: 'bg-primary/10 text-primary',
		success: 'bg-success/15 text-success',
		destructive: 'bg-destructive/15 text-destructive',
		warning: 'bg-warning/15 text-warning'
	}

	const showDelta = $derived(typeof delta === 'number')
	const isUp = $derived((delta ?? 0) >= 0)
</script>

<div class="rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 space-y-1">
			<p class="text-sm text-surface-500 dark:text-surface-400">{title}</p>
			<p class="truncate text-xl font-bold tracking-tight text-surface-900 md:text-2xl dark:text-surface-100">{value}</p>
			{#if subtitle}
				<p class="text-xs text-surface-500 dark:text-surface-400">{subtitle}</p>
			{/if}
			{#if showDelta}
				<p class="text-xs font-medium {isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
					{isUp ? '+' : ''}{delta!.toFixed(1)}% dari bulan lalu
				</p>
			{/if}
		</div>
		<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {TONE_ICON_BG[tone]}">
			<icon size={20}></icon>
		</div>
	</div>
</div>
