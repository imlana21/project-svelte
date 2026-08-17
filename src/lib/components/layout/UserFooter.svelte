<script lang="ts">
	import { LogOut } from '@lucide/svelte';
	import { useAuth } from '$lib/hooks/useAuth.svelte';

	const auth = useAuth();

	function getInitials(name: string): string {
		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}

	async function handleLogout() {
		await auth.logout();
		window.location.href = '/login';
	}
</script>

{#if auth.user}
	<div class="flex items-center gap-3 border-t border-surface-300 p-3 dark:border-surface-700">
		<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-primary-contrast-500">
			{getInitials(auth.user.name)}
		</div>
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-semibold">{auth.user.name}</p>
			<p class="truncate text-xs text-surface-500 dark:text-surface-400">{auth.user.email}</p>
		</div>
		<button
			class="btn btn-icon btn-sm bg-transparent text-surface-500 hover:text-error-500 dark:text-surface-400"
			title="Logout"
			onclick={handleLogout}
		>
			<LogOut size={18} />
		</button>
	</div>
{/if}
