<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { mainNav } from './menu';

	const { can } = usePermission();

	interface Props {
		collapsed?: boolean;
		onNavigate?: () => void;
	}
	let { collapsed = false, onNavigate = () => {} }: Props = $props();
</script>

<nav class={cn('flex h-full flex-col gap-1 overflow-y-auto', collapsed ? 'p-2' : 'p-3')}>
	{#each mainNav as item (item.title)}
		{#if item.label}
			{#if !collapsed}
				<div class="px-2 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">
					{item.title}
				</div>
			{:else}
				<div class="my-2 border-t border-surface-200 dark:border-surface-800"></div>
			{/if}
		{:else if !item.permission || can(item.permission)}
			<a
				href={item.href}
				onclick={() => onNavigate()}
				title={collapsed ? item.title : undefined}
				class={cn(
					'flex items-center rounded-lg text-sm font-medium transition-colors-fast',
					collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2',
					page.url.pathname === item.href
						? 'bg-primary-500 text-white'
						: 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
				)}
			>
				{#if item.icon}
					<item.icon size={18} />
				{/if}
				{#if !collapsed}
					<span>{item.title}</span>
				{/if}
			</a>
		{/if}
	{/each}
</nav>
