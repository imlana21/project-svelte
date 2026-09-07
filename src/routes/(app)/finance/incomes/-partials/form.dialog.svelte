<script lang="ts">
	import { untrack } from "svelte";
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import Field from "$lib/components/ui/Field.svelte";
	import type { FinanceIncome } from "$lib/types/finance/Income";

	export interface IncomeForm {
		amount: number;
		source?: string;
		note?: string;
		period: string;
	}

	interface Props {
		open: boolean;
		item: FinanceIncome | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: IncomeForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let amount = $state(0);
	let source = $state("");
	let note = $state("");
	let period = $state(new Date().toISOString().slice(0, 7));
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (open) {
			const currentItem = untrack(() => item);
			amount = currentItem?.amount ?? 0;
			source = currentItem?.source ?? "";
			note = currentItem?.note ?? "";
			period =
				currentItem?.period?.slice(0, 7) ??
				new Date().toISOString().slice(0, 7);
			errors = {};
		}
		if (!open) {
			errors = {};
		}
	});

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (amount <= 0) next.amount = "Jumlah harus lebih dari 0";
		if (!period) next.period = "Periode wajib diisi";
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		if (item) {
			onSubmit({
				source: source.trim() || undefined,
				note: note.trim() || undefined,
			} as IncomeForm);
		} else {
			onSubmit({
				amount,
				source: source.trim() || undefined,
				note: note.trim() || undefined,
				period,
			});
		}
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Pemasukan"
	description={item ? "Ubah data pemasukan" : "Catat pemasukan baru"}
	footer={footerSnippet}
>
	<form id="income-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		{#if !item}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Periode" required error={errors.period}>
					<input class="input" type="month" bind:value={period} />
				</Field>
				<Field label="Jumlah" required error={errors.amount}>
					<input class="input" type="number" min="1" bind:value={amount} />
				</Field>
			</div>
		{/if}
		<Field label="Sumber">
			<input
				class="input"
				type="text"
				placeholder="Gaji, Bonus, dll."
				bind:value={source}
			/>
		</Field>
		<Field label="Catatan">
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
		form="income-form"
		class="btn bg-primary-500 text-primary-contrast-500"
		disabled={saving}
	>
		{saving ? "Menyimpan..." : "Simpan"}
	</button>
{/snippet}
