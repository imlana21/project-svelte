<script lang="ts">
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import type { StockSekuritas } from '$lib/types/Stock';

	export interface SekuritasForm {
		code: string;
		name: string;
		balance: number;
	}

	interface Props {
		open: boolean;
		item: StockSekuritas | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: SekuritasForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let code = $state('');
	let name = $state('');
	let balance = $state(0);
	let errors = $state<{ code?: string; name?: string; balance?: string }>({});

	$effect(() => {
		if (open && item) {
			code = item.code;
			name = item.name;
			balance = Number(item.balance);
			errors = {};
		}
		if (!open) {
			code = '';
			name = '';
			balance = 0;
			errors = {};
		}
	});

	function validate(): boolean {
		const next: typeof errors = {};
		if (code.trim().length < 2) next.code = 'Kode minimal 2 karakter';
		else if (code.trim().length > 5) next.code = 'Kode maksimal 5 karakter';
		if (name.trim().length < 3) next.name = 'Nama minimal 3 karakter';
		if (balance < 0) next.balance = 'Saldo tidak boleh negatif';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({ code: code.trim().toUpperCase(), name: name.trim(), balance });
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Sekuritas"
	description={item ? 'Ubah data sekuritas' : 'Tambah sekuritas baru'}
	footer={footerSnippet}
>
	<form id="sekuritas-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Kode" required error={errors.code}>
				<input class="input" type="text" placeholder="IPOT" maxlength="5" bind:value={code} />
			</Field>
			<Field label="Nama" required error={errors.name}>
				<input class="input" type="text" placeholder="PT Indo Premier Sekuritas" bind:value={name} />
			</Field>
		</div>
		<Field label="Saldo" error={errors.balance}>
			<input class="input" type="number" min="0" bind:value={balance} />
		</Field>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="sekuritas-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
