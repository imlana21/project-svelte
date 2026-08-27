<script lang="ts">
	import { goto } from '$app/navigation';
	import { useAuth } from '$lib/hooks/useAuth.svelte';
	import { ApiError } from '$lib/utils/http';
	import { toastSuccess } from '$lib/utils/toaster.svelte';

	const auth = useAuth();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let passwordConfirmation = $state('');
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit() {
		submitting = true;
		error = null;
		try {
			await auth.register({ name, email, password, password_confirmation: passwordConfirmation });
			toastSuccess('Registrasi berhasil. Silakan masuk.');
			goto('/login');
		} catch (e) {
			error = e instanceof ApiError ? e.message : 'Terjadi kesalahan. Silakan coba lagi.';
		} finally {
			submitting = false;
		}
	}
</script>

<h2 class="text-xl font-bold text-balance">Daftar</h2>
<p class="mt-1 text-sm text-surface-500 text-pretty dark:text-surface-400">Buat akun baru</p>

<form class="mt-6 flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
	<label class="label">
		<span>Nama</span>
		<input class="input" type="text" autocomplete="name" bind:value={name} required placeholder="Nama lengkap" />
	</label>

	<label class="label">
		<span>Email</span>
		<input class="input" type="email" autocomplete="email" bind:value={email} required placeholder="nama@email.com" />
	</label>

	<label class="label">
		<span>Password</span>
		<input class="input" type="password" autocomplete="new-password" bind:value={password} required placeholder="Minimal 8 karakter" />
	</label>

	<label class="label">
		<span>Konfirmasi Password</span>
		<input class="input" type="password" autocomplete="new-password" bind:value={passwordConfirmation} required placeholder="Ulangi password" />
	</label>

	{#if error}
		<div class="rounded-md bg-error-500/10 px-3 py-2 text-sm text-error-600 dark:text-error-400">{error}</div>
	{/if}

	<button class="btn bg-primary-500 text-primary-contrast-500 w-full" type="submit" disabled={submitting}>
		{submitting ? 'Memproses...' : 'Daftar'}
	</button>
</form>

<p class="mt-4 text-center text-sm text-surface-500 dark:text-surface-400">
	Sudah punya akun?
	<a class="font-medium underline underline-from-font underline-offset-2" href="/login">Masuk</a>
</p>
