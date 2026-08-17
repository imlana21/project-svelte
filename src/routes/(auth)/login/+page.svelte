<script lang="ts">
	import { goto } from '$app/navigation';
	import { useAuth } from '$lib/hooks/useAuth.svelte';
	import { ApiError } from '$lib/utils/http';

	const auth = useAuth();

	let email = $state('');
	let password = $state('');
	let remember = $state(true);
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit() {
		submitting = true;
		error = null;
		try {
			await auth.login({ email, password }, remember);
			goto('/dashboard');
		} catch (e) {
			error = e instanceof ApiError ? e.message : 'Terjadi kesalahan. Silakan coba lagi.';
		} finally {
			submitting = false;
		}
	}
</script>

<h2 class="text-xl font-bold">Masuk</h2>
<p class="mt-1 text-sm text-surface-500 dark:text-surface-400">Masuk untuk mengelola aplikasi</p>

<form class="mt-6 flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
	<label class="label">
		<span>Email</span>
		<input
			class="input"
			type="email"
			autocomplete="email"
			bind:value={email}
			required
			placeholder="nama@email.com"
		/>
	</label>

	<label class="label">
		<span>Password</span>
		<input
			class="input"
			type="password"
			autocomplete="current-password"
			bind:value={password}
			required
			placeholder="••••••••"
		/>
	</label>

	<label class="flex items-center gap-2 text-sm">
		<input class="checkbox" type="checkbox" bind:checked={remember} />
		<span>Ingat saya</span>
	</label>

	{#if error}
		<div class="rounded-md bg-error-500/10 px-3 py-2 text-sm text-error-600 dark:text-error-400">{error}</div>
	{/if}

	<button class="btn bg-primary-500 text-primary-contrast-500 w-full" type="submit" disabled={submitting}>
		{submitting ? 'Memproses...' : 'Masuk'}
	</button>
</form>

<p class="mt-4 text-center text-sm text-surface-500 dark:text-surface-400">
	Belum punya akun?
	<a class="font-medium underline underline-offset-2" href="/register">Daftar</a>
</p>
