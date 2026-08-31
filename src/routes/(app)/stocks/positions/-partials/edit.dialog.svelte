<script lang="ts">
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import Field from "$lib/components/ui/Field.svelte";
	import type { StockPosition } from "$lib/types/Stock";

	export interface PositionEditForm {
		plan_sl: number | null;
		plan_tp: number | null;
		trend: string | null;
		quadrant: string | null;
		note: string | null;
	}

	interface Props {
		open: boolean;
		item: StockPosition | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: PositionEditForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let planSl = $state<number | null>(null);
	let planTp = $state<number | null>(null);
	let trend = $state<string | null>(null);
	let quadrant = $state<string | null>(null);
	let note = $state<string | null>(null);
	let errors = $state<Record<string, string>>({});

	const trendOptions = [
		{ value: "extreme", label: "Extreme" },
		{ value: "strong", label: "Strong" },
		{ value: "medium", label: "Medium" },
		{ value: "weak", label: "Weak" },
		{ value: "down", label: "Down" },
	];

	const quadrantOptions = [
		{ value: "leading", label: "Leading" },
		{ value: "improving", label: "Improving" },
		{ value: "weakening", label: "Weakening" },
		{ value: "lagging", label: "Lagging" },
	];

	$effect(() => {
		if (open && item) {
			planSl = item.plan_sl;
			planTp = item.plan_tp;
			trend = item.trend;
			quadrant = item.quadrant;
			note = item.note;
			errors = {};
		}
		if (!open) {
			errors = {};
		}
	});

	function validate(): boolean {
		const next: Record<string, string> = {};
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			plan_sl: planSl,
			plan_tp: planTp,
			trend,
			quadrant,
			note: note?.trim() || null,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Edit Posisi"
	description={item
		? `Ubah data posisi ${item.emiten?.ticker ?? ""}`
		: "Ubah data posisi"}
	footer={footerSnippet}
>
	<form
		id="position-edit-form"
		class="flex flex-col gap-4"
		onsubmit={handleSubmit}
	>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Plan SL" error={errors.plan_sl}>
				<input
					class="input"
					type="number"
					placeholder="0"
					bind:value={planSl}
				/>
			</Field>
			<Field label="Plan TP" error={errors.plan_tp}>
				<input
					class="input"
					type="number"
					placeholder="0"
					bind:value={planTp}
				/>
			</Field>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Trend" error={errors.trend}>
				<select class="input" bind:value={trend}>
					<option value={null}>Pilih trend...</option>
					{#each trendOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</Field>
			<Field label="Quadrant" error={errors.quadrant}>
				<select class="input" bind:value={quadrant}>
					<option value={null}>Pilih quadrant...</option>
					{#each quadrantOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</Field>
		</div>
		<Field label="Catatan" error={errors.note}>
			<textarea class="input min-h-16" placeholder="Opsional" bind:value={note}
			></textarea>
		</Field>
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
		form="position-edit-form"
		class="btn bg-primary-500 text-primary-contrast-500"
		disabled={saving}
	>
		{saving ? "Menyimpan..." : "Simpan"}
	</button>
{/snippet}
