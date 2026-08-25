<script lang="ts">
	import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { useMode } from '$lib/hooks/useMode.svelte';
	import { useSidebar } from '$lib/hooks/useSidebar.svelte';
	import SidebarNav from './SidebarNav.svelte';
	import UserDropdown from './UserDropdown.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	let sidebarOpen = $state(false);
	const mode = useMode();
	const sidebar = useSidebar();
</script>

<div class="flex min-h-screen bg-surface-50 dark:bg-surface-950">
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
			'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-surface-200 bg-surface-50 transition-all duration-300 dark:border-surface-800 dark:bg-surface-950',
			sidebar.collapsed ? 'w-16' : 'w-64',
			sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
		)}
	>
		<div class={cn(
			'flex items-center border-b border-surface-200 py-4 dark:border-surface-800',
			sidebar.collapsed ? 'justify-center px-2' : 'justify-between px-4'
		)}>
			{#if !sidebar.collapsed}
				<span class="text-lg font-black tracking-tight text-primary-600 dark:text-primary-400">Bestock</span>
			{/if}
			<button
				class="hidden rounded-lg p-1.5 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 lg:block"
				onclick={() => sidebar.toggle()}
				title={sidebar.collapsed ? 'Expand menu' : 'Minimize menu'}
			>
				{#if sidebar.collapsed}
					<PanelLeftOpen size={18} />
				{:else}
					<PanelLeftClose size={18} />
				{/if}
			</button>
			<button class="rounded-lg p-1.5 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 lg:hidden" onclick={() => (sidebarOpen = false)}>
				<X size={18} />
			</button>
		</div>
		<div class="min-h-0 flex-1 overflow-y-auto">
			<SidebarNav collapsed={sidebar.collapsed} onNavigate={() => (sidebarOpen = false)} />
		</div>
	</aside>

	<!-- Main -->
	<div class={cn(
		'flex min-h-screen w-full flex-col transition-all duration-300',
		sidebar.collapsed ? 'lg:pl-16' : 'lg:pl-64'
	)}>
		<header class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-surface-200 bg-surface-50/80 px-4 backdrop-blur dark:border-surface-800 dark:bg-surface-950/80">
			<div class="flex items-center gap-3">
				<button class="rounded-lg p-1.5 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 lg:hidden" onclick={() => (sidebarOpen = true)}>
					<Menu size={18} />
				</button>
				<h1 class="text-base font-semibold text-surface-900 dark:text-surface-100">Admin Panel</h1>
			</div>
			<div class="flex items-center gap-1">
				<button
					class="rounded-lg p-1.5 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
					title={mode.mode === 'light' ? 'Dark mode' : 'Light mode'}
					onclick={() => mode.toggle()}
				>
					{#if mode.mode === 'light'}
						<Moon size={18} />
					{:else}
						<Sun size={18} />
					{/if}
				</button>
				<UserDropdown />
			</div>
		</header>
		<main class="flex-1 p-4 lg:p-6">
			{@render children()}
		</main>
	</div>
</div>
