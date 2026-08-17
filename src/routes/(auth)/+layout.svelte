<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-surface-100 p-4 dark:bg-surface-900">
	<div class="w-full max-w-sm">
		<div class="mb-6 text-center">
			<h1 class="text-3xl font-black tracking-tight">Bestock</h1>
			<p class="mt-1 text-sm text-surface-500 dark:text-surface-400">Stock & Finance Admin</p>
		</div>
		<div class="card p-6">
			{@render children()}
		</div>
	</div>
</div>
