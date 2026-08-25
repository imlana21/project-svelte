<script lang="ts">
	import { untrack } from 'svelte';
	import { AlertCircle, CheckCircle2, Upload } from '@lucide/svelte';
	import AppDialog from './AppDialog.svelte';
	import { parseCSV } from '$lib/utils/csv-utils';
	import type { FieldDef } from '$lib/types/Api';

	interface Props {
		open: boolean;
		title: string;
		fields: FieldDef[];
		onImport: (items: Record<string, string>[]) => void;
		onOpenChange: (open: boolean) => void;
	}

	let { open, title, fields, onImport, onOpenChange }: Props = $props();

	let step = $state<'upload' | 'preview'>('upload');
	let parsed = $state<Record<string, string>[]>([]);
	let errors = $state<string[]>([]);
	let fileInput = $state<HTMLInputElement | undefined>(undefined);

	$effect(() => {
		if (untrack(() => open)) {
			reset();
		}
	});

	function reset() {
		step = 'upload';
		parsed = [];
		errors = [];
		if (fileInput) fileInput.value = '';
	}

	function handleClose() {
		reset();
		onOpenChange(false);
	}

	function handleFile(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const text = event.target?.result as string;
			const data = parseCSV(text);

			const errs: string[] = [];
			const requiredFields = fields.filter((f) => f.required);

			data.forEach((row, i) => {
				requiredFields.forEach((f) => {
					if (!row[f.key] && !row[f.label]) {
						errs.push(`Baris ${i + 1}: ${f.label} wajib diisi`);
					}
				});
			});

			const mapped = data.map((row) => {
				const obj: Record<string, string> = {};
				fields.forEach((f) => {
					obj[f.key] = row[f.key] || row[f.label] || '';
				});
				return obj;
			});

			parsed = mapped;
			errors = errs;
			step = 'preview';
		};
		reader.readAsText(file);
	}

	function handleConfirm() {
		onImport(parsed);
		handleClose();
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Import {title}"
	description="Upload file CSV untuk mengimpor data"
	footer={footerSnippet}
>
	{#if step === 'upload'}
		<div class="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-surface-300 py-8 dark:border-surface-700">
			<Upload size={40} class="text-surface-400" />
			<p class="text-sm text-surface-500 dark:text-surface-400">
				Pilih file CSV untuk diimpor
			</p>
			<p class="text-xs text-surface-400 dark:text-surface-500">
				Kolom yang diperlukan: {fields.filter((f) => f.required).map((f) => f.label).join(', ')}
			</p>
			<input
				bind:this={fileInput}
				type="file"
				accept=".csv"
				class="hidden"
				onchange={handleFile}
			/>
			<button
				type="button"
				class="btn bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-200"
				onclick={() => fileInput?.click()}
			>
				Pilih File
			</button>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			{#if errors.length > 0}
				<div class="rounded-lg bg-error-500/10 p-3">
					<div class="mb-1 flex items-center gap-2 font-medium text-error-600 dark:text-error-400">
						<AlertCircle size={16} />
						<span>{errors.length} error ditemukan</span>
					</div>
					{#each errors.slice(0, 5) as err}
						<p class="text-sm text-error-600 dark:text-error-400">{err}</p>
					{/each}
					{#if errors.length > 5}
						<p class="text-sm text-error-600 dark:text-error-400">
							...dan {errors.length - 5} error lainnya
						</p>
					{/if}
				</div>
			{:else}
				<div class="flex items-center gap-2 text-success-600 dark:text-success-400">
					<CheckCircle2 size={16} />
					<span class="text-sm font-medium">{parsed.length} data siap diimpor</span>
				</div>
			{/if}

			<div class="max-h-64 overflow-auto rounded-lg border border-surface-300 dark:border-surface-700">
				<table class="table">
					<thead>
						<tr>
							{#each fields as f (f.key)}
								<th class="whitespace-nowrap">{f.label}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each parsed.slice(0, 10) as row, i (i)}
							<tr>
								{#each fields as f (f.key)}
									<td class="text-sm">{row[f.key] || '-'}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if parsed.length > 10}
				<p class="text-xs text-surface-500 dark:text-surface-400">
					Menampilkan 10 dari {parsed.length} data
				</p>
			{/if}
		</div>
	{/if}
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={handleClose}>Batal</button>
	{#if step === 'preview' && errors.length === 0}
		<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={handleConfirm}>
			Import {parsed.length} Data
		</button>
	{/if}
{/snippet}
