<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import type { User } from '$lib/types/Auth';

	export interface EditUserForm {
		name: string;
		email: string;
		password: string;
		password_confirmation: string;
		is_active: boolean;
	}

	interface Props {
		open: boolean;
		item: User | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: EditUserForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let passwordConfirmation = $state('');
	let isActive = $state(true);
	let errors = $state<{ name?: string; email?: string; password?: string; password_confirmation?: string }>({});

	$effect(() => {
		if (open) {
			const currentItem = untrack(() => item);
			if (currentItem) {
				name = currentItem.name;
				email = currentItem.email;
				isActive = currentItem.is_active;
			} else {
				name = '';
				email = '';
				isActive = true;
			}
			password = '';
			passwordConfirmation = '';
			errors = {};
		}
		if (!open) {
			errors = {};
		}
	});

	function validate(): boolean {
		const next: typeof errors = {};
		if (name.trim().length < 3) next.name = 'Nama minimal 3 karakter';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Email tidak valid';
		if (password && password.length < 8) next.password = 'Password minimal 8 karakter';
		if (password !== passwordConfirmation) next.password_confirmation = 'Konfirmasi password tidak cocok';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			name: name.trim(),
			email: email.trim(),
			password,
			password_confirmation: passwordConfirmation,
			is_active: isActive,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Pengguna"
	description="Ubah profil pengguna. Kosongkan password jika tidak ingin mengubahnya."
	footer={footerSnippet}
>
	<form id="user-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<Field label="Nama" required error={errors.name}>
			<input class="input" type="text" placeholder="Nama lengkap" bind:value={name} />
		</Field>
		<Field label="Email" required error={errors.email}>
			<input class="input" type="email" placeholder="nama@perusahaan.com" bind:value={email} />
		</Field>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Password Baru" error={errors.password}>
				<input class="input" type="password" placeholder="••••••••" bind:value={password} />
			</Field>
			<Field label="Konfirmasi Password" error={errors.password_confirmation}>
				<input class="input" type="password" placeholder="••••••••" bind:value={passwordConfirmation} />
			</Field>
		</div>
		<label class="flex cursor-pointer items-center gap-2 text-sm">
			<input type="checkbox" class="checkbox" bind:checked={isActive} />
			Aktif
		</label>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="user-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
