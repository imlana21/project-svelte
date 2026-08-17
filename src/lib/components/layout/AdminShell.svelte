<script lang="ts">
	import { Menu, X } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import SidebarNav from './SidebarNav.svelte';
	import UserFooter from './UserFooter.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	let sidebarOpen = $state(false);
</script>

<div class="flex min-h-screen bg-surface-100 dark:bg-surface-900">
	<!-- Mobile overlay -->
	{#if sidebarOpen}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default bg-black/50 lg:hidden"
			aria-label="Tutup menu"
			onclick={() => (sidebarOpen = false)}
		></button>
	{/if}

	<!-- Sidebar -->
	<aside
		class={cn(
			'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-surface-50 transition-transform lg:translate-x-0 dark:bg-surface-950',
			sidebarOpen ? 'translate-x-0' : '-translate-x-full'
		)}
	>
		<div class="flex items-center justify-between border-b border-surface-300 px-4 py-4 dark:border-surface-700">
			<span class="text-lg font-black tracking-tight">Bestock</span>
			<button class="btn btn-icon lg:hidden" onclick={() => (sidebarOpen = false)}>
				<X size={18} />
			</button>
		</div>
		<div class="min-h-0 flex-1 overflow-y-auto">
			<SidebarNav onNavigate={() => (sidebarOpen = false)} />
		</div>
		<UserFooter />
	</aside>

	<!-- Main -->
	<div class="flex min-h-screen w-full flex-col lg:pl-64">
		<header class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-surface-300 bg-surface-50/80 px-4 backdrop-blur dark:border-surface-700 dark:bg-surface-950/80">
			<button class="btn btn-icon lg:hidden" onclick={() => (sidebarOpen = true)}>
				<Menu size={18} />
			</button>
			<h1 class="text-base font-semibold">Admin Panel</h1>
		</header>
		<main class="flex-1 p-4 lg:p-6">
			{@render children()}
		</main>
	</div>
</div>
