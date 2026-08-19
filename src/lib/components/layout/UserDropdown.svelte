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
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-primary-contrast-500 hover:ring-2 hover:ring-primary-400"
			onclick={handleToggle}
		>
			{getInitials(auth.user.name)}
		</button>

		{#if open}
			<div class="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-surface-300 bg-surface-50 shadow-lg dark:border-surface-600 dark:bg-surface-800">
				<div class="border-b border-surface-300 px-4 py-3 dark:border-surface-600">
					<p class="text-sm font-medium text-surface-900 dark:text-surface-100">{auth.user.name}</p>
				</div>
				<div class="py-1">
					<a
						href="/profile"
						onclick={handleClose}
						class="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-200 dark:text-surface-200 dark:hover:bg-surface-700"
					>
						<User size={16} />
						Profile
					</a>
					<a
						href="/settings"
						onclick={handleClose}
						class="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-200 dark:text-surface-200 dark:hover:bg-surface-700"
					>
						<Settings size={16} />
						Settings
					</a>
				</div>
				<div class="border-t border-surface-300 py-1 dark:border-surface-600">
					<button
						onclick={handleLogout}
						class="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-500 hover:bg-surface-200 dark:hover:bg-surface-700"
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
