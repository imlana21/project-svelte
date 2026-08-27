<script lang="ts">
	import { LogOut, Settings, User } from '@lucide/svelte';
	import { useAuth } from '$lib/hooks/useAuth.svelte';

	const auth = useAuth();

	let open = $state(false);

	function getInitials(name: string): string {
		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}

	function handleToggle() {
		open = !open;
	}

	function handleClose() {
		open = false;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('[data-dropdown]')) {
			open = false;
		}
	}

	async function handleLogout() {
		open = false;
		await auth.logout();
		window.location.href = '/login';
	}
</script>

<svelte:window onclick={handleClickOutside} />

{#if auth.user}
	<div class="relative" data-dropdown>
		<button
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white transition-all duration-150 hover:ring-2 hover:ring-primary-400 dark:bg-primary-500"
			onclick={handleToggle}
		>
			{getInitials(auth.user.name)}
		</button>

		{#if open}
			<div class="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-surface-200 bg-surface-50 shadow-lg dark:border-surface-700 dark:bg-surface-900">
				<div class="border-b border-surface-200 px-4 py-3 dark:border-surface-700">
					<p class="text-sm font-medium text-surface-900 dark:text-surface-100">{auth.user.name}</p>
				</div>
				<div class="py-1">
					<a
						href="/profile"
						onclick={handleClose}
						class="flex items-center gap-2 px-4 py-2 text-sm text-surface-600 transition-colors-fast hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
					>
						<User size={16} />
						Profile
					</a>
					<a
						href="/settings"
						onclick={handleClose}
						class="flex items-center gap-2 px-4 py-2 text-sm text-surface-600 transition-colors-fast hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
					>
						<Settings size={16} />
						Settings
					</a>
				</div>
				<div class="border-t border-surface-200 py-1 dark:border-surface-700">
					<button
						onclick={handleLogout}
						class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 transition-colors-fast hover:bg-surface-100 dark:text-red-400 dark:hover:bg-surface-800"
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
