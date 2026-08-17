<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { mainNav } from './menu';

	const { can } = usePermission();

	interface Props {
		onNavigate?: () => void;
	}
	let { onNavigate = () => {} }: Props = $props();
</script>

<nav class="flex h-full flex-col gap-1 overflow-y-auto p-3">
	{#each mainNav as item (item.title)}
		{#if item.label}
			<div class="px-2 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">
				{item.title}
			</div>
		{:else if !item.permission || can(item.permission)}
			<a
				href={item.href}
				onclick={() => onNavigate()}
				class={cn(
					'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
					page.url.pathname === item.href
						? 'bg-primary-500 text-primary-contrast-500'
						: 'text-surface-700 hover:bg-surface-200/60 dark:text-surface-200 dark:hover:bg-surface-700/50'
				)}
			>
				{#if item.icon}
					<item.icon size={18} />
				{/if}
				<span>{item.title}</span>
			</a>
		{/if}
	{/each}
</nav>
