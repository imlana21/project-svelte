<script lang="ts">
	import { requireAuth } from '$lib/hooks/useGuard.svelte';

	requireAuth();
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<h1 class="text-4xl font-black">403</h1>
	<p class="mt-2 text-surface-600 dark:text-surface-300">Anda tidak memiliki akses ke halaman ini.</p>
	<a class="btn bg-primary-500 text-primary-contrast-500 mt-6" href="/dashboard">Kembali ke Dashboard</a>
</div>
