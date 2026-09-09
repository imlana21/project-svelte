<script lang="ts">
	import { onMount } from 'svelte';
	import { CheckCircle2, Lock, User } from '@lucide/svelte';
	import { useAuth } from '$lib/hooks/useAuth.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatDate } from '$lib/utils/format';

	const auth = useAuth();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let passwordConfirmation = $state('');

	let profileErrors = $state<{ name?: string; email?: string }>({});
	let passwordErrors = $state<{ password?: string; password_confirmation?: string }>({});

	onMount(() => {
		if (auth.user) {
			name = auth.user.name;
			email = auth.user.email;
		}
	});

	function getInitials(name: string): string {
		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}

	function validateProfile(): boolean {
		const next: typeof profileErrors = {};
		if (name.trim().length < 3) next.name = 'Nama minimal 3 karakter';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Email tidak valid';
		profileErrors = next;
		return Object.keys(next).length === 0;
	}

	function validatePassword(): boolean {
		const next: typeof passwordErrors = {};
		if (password.length < 8) next.password = 'Password minimal 8 karakter';
		if (password !== passwordConfirmation) next.password_confirmation = 'Konfirmasi password tidak cocok';
		passwordErrors = next;
		return Object.keys(next).length === 0;
	}

	async function handleUpdateProfile(e: SubmitEvent) {
		e.preventDefault();
		if (!validateProfile()) return;
		try {
			await auth.updateProfile({ name: name.trim(), email: email.trim() });
			toastSuccess('Profil berhasil diperbarui');
		} catch (e) {
			toastError(e);
		}
	}

	async function handleChangePassword(e: SubmitEvent) {
		e.preventDefault();
		if (!validatePassword()) return;
		try {
			await auth.changePassword({ password, password_confirmation: passwordConfirmation });
			password = '';
			passwordConfirmation = '';
			passwordErrors = {};
			toastSuccess('Password berhasil diubah');
		} catch (e) {
			toastError(e);
		}
	}
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
	<h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Profile</h1>

	{#if auth.user}
		<div class="card p-6">
			<div class="flex items-center gap-4">
				<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
					{getInitials(auth.user.name)}
				</div>
				<div>
					<h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">{auth.user.name}</h2>
					<p class="text-sm text-surface-500 dark:text-surface-400">{auth.user.email}</p>
					{#if auth.user.roles.length > 0}
						<div class="mt-1 flex flex-wrap gap-1">
							{#each auth.user.roles as role (role)}
								<span class="badge bg-primary-500 text-primary-contrast-500">{role}</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-4 grid grid-cols-2 gap-4 border-t border-surface-200 pt-4 dark:border-surface-700">
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Terakhir login</p>
					<p class="text-sm font-medium text-surface-700 dark:text-surface-300">
						{auth.user.last_login_at ? formatDate(auth.user.last_login_at) : '-'}
					</p>
				</div>
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Terdaftar sejak</p>
					<p class="text-sm font-medium text-surface-700 dark:text-surface-300">
						{formatDate(auth.user.created_at)}
					</p>
				</div>
			</div>
		</div>

		<div class="card p-6">
			<div class="mb-4 flex items-center gap-2">
				<User size={20} class="text-surface-600 dark:text-surface-400" />
				<h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Ubah Profil</h3>
			</div>
			<form class="flex flex-col gap-4" onsubmit={handleUpdateProfile}>
				<Field label="Nama" required error={profileErrors.name}>
					<input
						class="input"
						type="text"
						placeholder="Nama lengkap"
						bind:value={name}
					/>
				</Field>
				<Field label="Email" required error={profileErrors.email}>
					<input
						class="input"
						type="email"
						placeholder="nama@perusahaan.com"
						bind:value={email}
					/>
				</Field>
				<div class="flex justify-end">
					<button
						type="submit"
						class="btn bg-primary-500 text-primary-contrast-500"
						disabled={auth.loading}
					>
						{auth.loading ? 'Menyimpan...' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>

		<div class="card p-6">
			<div class="mb-4 flex items-center gap-2">
				<Lock size={20} class="text-surface-600 dark:text-surface-400" />
				<h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Ubah Password</h3>
			</div>
			<form class="flex flex-col gap-4" onsubmit={handleChangePassword}>
				<Field label="Password Baru" required error={passwordErrors.password}>
					<input
						class="input"
						type="password"
						placeholder="••••••••"
						bind:value={password}
					/>
				</Field>
				<Field label="Konfirmasi Password" required error={passwordErrors.password_confirmation}>
					<input
						class="input"
						type="password"
						placeholder="••••••••"
						bind:value={passwordConfirmation}
					/>
				</Field>
				<div class="flex justify-end">
					<button
						type="submit"
						class="btn bg-primary-500 text-primary-contrast-500"
						disabled={auth.loading}
					>
						{auth.loading ? 'Menyimpan...' : 'Ubah Password'}
					</button>
				</div>
			</form>
		</div>
	{/if}
</div>
