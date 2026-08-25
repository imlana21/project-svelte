<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<h1 class="text-6xl font-black">{($page.status === 404) ? '404' : $page.status}</h1>
	<p class="mt-3 text-lg text-surface-600 dark:text-surface-300">
		{#if $page.status === 404}
			Halaman yang kamu cari tidak ditemukan.
		{:else}
			{$page.error?.message || 'Terjadi kesalahan.'}
		{/if}
	</p>
	<a class="btn bg-primary-500 text-primary-contrast-500 mt-6" href="/dashboard">Kembali ke Dashboard</a>
</div>
