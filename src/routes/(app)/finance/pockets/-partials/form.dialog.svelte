<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import type { FinancePocket } from '$lib/types/finance/Pocket';
	import type { FinanceAllocationConfig } from '$lib/types/finance/AllocationConfig';
	import { fetchAllocationConfigs } from '$lib/services/allocation-config.service';

	export interface PocketForm {
		name: string;
		description?: string;
		allocation_config_id: number;
		is_active: boolean;
	}

	interface Props {
		open: boolean;
		item: FinancePocket | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: PocketForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let name = $state('');
	let description = $state('');
	let allocationConfigId = $state(0);
	let isActive = $state(true);
	let errors = $state<Record<string, string>>({});
	let allocationOptions = $state<FinanceAllocationConfig[]>([]);

	$effect(() => {
		if (untrack(() => open)) {
			name = item?.name ?? '';
			description = item?.description ?? '';
			allocationConfigId = item?.allocation_config_id ?? 0;
			isActive = item?.is_active ?? true;
			errors = {};
			loadAllocationOptions();
		}
	});

	async function loadAllocationOptions() {
		try {
			const res = await fetchAllocationConfigs({ page: 1, perPage: 100 });
			allocationOptions = res.data;
		} catch { /* silent */ }
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!name.trim()) next.name = 'Nama pocket wajib diisi';
		if (!allocationConfigId) next.allocation_config_id = 'Alokasi wajib dipilih';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			name: name.trim(),
			description: description.trim() || undefined,
			allocation_config_id: allocationConfigId,
			is_active: isActive,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Pocket"
	description={item ? 'Ubah data pocket' : 'Tambah pocket baru'}
	footer={footerSnippet}
>
	<form id="pocket-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Nama" required error={errors.name}>
				<input class="input" type="text" placeholder="Tabungan Hari Tua" bind:value={name} />
			</Field>
			<Field label="Alokasi" required error={errors.allocation_config_id}>
				<select class="input" bind:value={allocationConfigId}>
					<option value={0}>Pilih alokasi...</option>
					{#each allocationOptions as a (a.id)}
						<option value={a.id}>{a.category_name} ({(a.percentage * 100).toFixed(1)}%)</option>
					{/each}
				</select>
			</Field>
		</div>
		<Field label="Deskripsi">
			<textarea class="input min-h-16" placeholder="Opsional" bind:value={description}></textarea>
		</Field>
		<div class="flex items-center gap-2">
			<input type="checkbox" class="checkbox" bind:checked={isActive} />
			<span class="label">Aktif</span>
		</div>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="pocket-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
