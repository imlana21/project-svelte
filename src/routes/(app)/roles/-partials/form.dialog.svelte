<script lang="ts">
	import { untrack } from "svelte";
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import Field from "$lib/components/ui/Field.svelte";
	import type { AuthRole } from "$lib/types/Auth";

	export interface RoleForm {
		name: string;
		slug: string;
		description: string;
		is_active: boolean;
	}

	interface Props {
		open: boolean;
		item: AuthRole | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: RoleForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let name = $state("");
	let slug = $state("");
	let description = $state("");
	let isActive = $state(true);
	let errors = $state<{ name?: string; slug?: string; description?: string }>(
		{},
	);

	$effect(() => {
		if (open) {
			const currentItem = untrack(() => item);
			if (currentItem) {
				name = currentItem.name;
				slug = currentItem.slug;
				description = currentItem.description ?? "";
				isActive = currentItem.is_active;
			} else {
				name = "";
				slug = "";
				description = "";
				isActive = true;
			}
			errors = {};
		}
		if (!open) {
			errors = {};
		}
	});

	function validate(): boolean {
		const next: typeof errors = {};
		if (name.trim().length < 3) next.name = "Nama minimal 3 karakter";
		if (slug.trim().length < 2) next.slug = "Slug minimal 2 karakter";
		else if (!/^[a-z0-9_-]+$/.test(slug.trim()))
			next.slug = "Slug hanya boleh huruf kecil, angka, - dan _";
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			name: name.trim(),
			slug: slug.trim(),
			description: description.trim(),
			is_active: isActive,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Role"
	description={item ? "Ubah detail role" : "Tambah role baru"}
	footer={footerSnippet}
>
	<form id="role-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<Field label="Nama" required error={errors.name}>
			<input
				class="input"
				type="text"
				placeholder="Contoh: Administrator"
				bind:value={name}
			/>
		</Field>
		<Field
			label="Slug"
			required
			error={errors.slug}
			hint="Huruf kecil, angka, - atau _"
		>
			<input
				class="input"
				type="text"
				placeholder="Contoh: admin"
				bind:value={slug}
			/>
		</Field>
		<Field label="Deskripsi" error={errors.description}>
			<textarea
				class="input min-h-20"
				placeholder="Deskripsi role (opsional)"
				bind:value={description}
			></textarea>
		</Field>
		<label class="flex cursor-pointer items-center gap-2 text-sm">
			<input type="checkbox" class="checkbox" bind:checked={isActive} />
			Aktif
		</label>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button
		type="button"
		class="btn"
		onclick={() => onOpenChange(false)}
		disabled={saving}>Batal</button
	>
	<button
		type="submit"
		form="role-form"
		class="btn bg-primary-500 text-primary-contrast-500"
		disabled={saving}
	>
		{saving ? "Menyimpan..." : "Simpan"}
	</button>
{/snippet}
