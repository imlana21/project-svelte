<script lang="ts">
	import { useAuth } from '$lib/hooks/useAuth.svelte';

	const auth = useAuth();
</script>

<div class="flex flex-col gap-4">
	<div class="card p-6">
		<h1 class="text-2xl font-black text-balance">Selamat datang, {auth.user?.name ?? 'Admin'}</h1>
		<p class="mt-1 text-surface-600 text-pretty dark:text-surface-300">
			Dashboard ringkasan portfolio saham dan keuangan. (Sedang dibangun)
		</p>
	</div>
</div>
