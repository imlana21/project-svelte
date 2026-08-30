<script lang="ts">
	import { Upload, AlertTriangle, CheckCircle2, FileSpreadsheet } from '@lucide/svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import type { ImportTransactionResult } from '$lib/services/transaction.service';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		saving: boolean;
		onSubmit: (file: File) => Promise<ImportTransactionResult>;
	}

	let { open, onOpenChange, saving, onSubmit }: Props = $props();

	const REQUIRED_COLUMNS = ['sekuritas', 'emiten', 'type', 'date', 'price', 'lot'];

	let file = $state<File | null>(null);
	let fileName = $state('');
	let parsedHeaders = $state<string[]>([]);
	let parsedRows = $state<Record<string, string>[]>([]);
	let validationErrors = $state<Record<number, Record<string, string>>>({});
	let globalErrors = $state<string[]>([]);
	let result = $state<ImportTransactionResult | null>(null);
	let step = $state<'pick' | 'preview' | 'result'>('pick');

	function reset() {
		file = null;
		fileName = '';
		parsedHeaders = [];
		parsedRows = [];
		validationErrors = {};
		globalErrors = [];
		result = null;
		step = 'pick';
	}

	function handleOpenChange(o: boolean) {
		if (!o) reset();
		onOpenChange(o);
	}

	function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
		const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
		if (lines.length === 0) return { headers: [], rows: [] };

		const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
		const rows: Record<string, string>[] = [];

		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(',');
			const row: Record<string, string> = {};
			for (let j = 0; j < headers.length; j++) {
				row[headers[j]] = (values[j] ?? '').trim();
			}
			rows.push(row);
		}

		return { headers, rows };
	}

	function validateDate(dateStr: string): boolean {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
		const d = new Date(dateStr);
		return !isNaN(d.getTime());
	}

	function validate(headers: string[], rows: Record<string, string>[]): Record<number, Record<string, string>> {
		const errors: Record<number, Record<string, string>> = {};

		const missingRequired = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
		if (missingRequired.length > 0) {
			globalErrors = [`Kolom wajib tidak ditemukan: ${missingRequired.join(', ')}. Kolom tersedia: ${headers.join(', ')}`];
			return {};
		}
		globalErrors = [];

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const rowErrors: Record<string, string> = {};

			if (!row.sekuritas?.trim()) rowErrors.sekuritas = 'Wajib diisi';
			if (!row.emiten?.trim()) rowErrors.emiten = 'Wajib diisi';

			const type = row.type?.toLowerCase().trim();
			if (!type) rowErrors.type = 'Wajib diisi';
			else if (type !== 'buy' && type !== 'sell') rowErrors.type = 'Harus buy atau sell';

			if (!row.date?.trim()) rowErrors.date = 'Wajib diisi';
			else if (!validateDate(row.date.trim())) rowErrors.date = 'Format harus YYYY-MM-DD';

			const price = parseFloat(row.price);
			if (!row.price?.trim()) rowErrors.price = 'Wajib diisi';
			else if (isNaN(price) || price <= 0) rowErrors.price = 'Harus angka > 0';

			const lot = parseInt(row.lot, 10);
			if (!row.lot?.trim()) rowErrors.lot = 'Wajib diisi';
			else if (isNaN(lot) || lot <= 0) rowErrors.lot = 'Harus angka > 0';

			const feeStr = row.fee?.trim();
			if (feeStr) {
				const fee = parseFloat(feeStr);
				if (isNaN(fee) || fee < 0) rowErrors.fee = 'Harus angka >= 0';
			}

			if (Object.keys(rowErrors).length > 0) {
				errors[i] = rowErrors;
			}
		}

		return errors;
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const selected = input.files?.[0];
		if (!selected) return;

		file = selected;
		fileName = selected.name;
		result = null;

		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result as string;
			const { headers, rows } = parseCSV(text);
			parsedHeaders = headers;
			parsedRows = rows;
			validationErrors = validate(headers, rows);
			step = 'preview';
		};
		reader.readAsText(selected);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const droppedFile = e.dataTransfer?.files?.[0];
		if (!droppedFile) return;

		file = droppedFile;
		fileName = droppedFile.name;
		result = null;

		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result as string;
			const { headers, rows } = parseCSV(text);
			parsedHeaders = headers;
			parsedRows = rows;
			validationErrors = validate(headers, rows);
			step = 'preview';
		};
		reader.readAsText(droppedFile);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	const validRowCount = $derived(parsedRows.length - Object.keys(validationErrors).length);
	const errorRowCount = $derived(Object.keys(validationErrors).length);
	const hasErrors = $derived(errorRowCount > 0 || globalErrors.length > 0);

	async function handleSubmit() {
		if (!file) return;
		try {
			const res = await onSubmit(file);
			result = res;
			step = 'result';
		} catch {
			// error handled by parent toast
		}
	}
</script>

<AppDialog
	{open}
	onOpenChange={handleOpenChange}
	title="Import Transaksi"
	description="Import transaksi dari file CSV"
>
	{#if step === 'pick'}
		<div
			class="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-surface-300 p-8 text-center transition-colors hover:border-primary-400 dark:border-surface-600"
			role="button"
			tabindex="0"
			ondrop={handleDrop}
			ondragover={handleDragOver}
			onclick={() => document.getElementById('import-file-input')?.click()}
			onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('import-file-input')?.click(); }}
		>
			<FileSpreadsheet size={40} class="text-surface-400" />
			<p class="text-sm text-surface-600 dark:text-surface-400">
				Seret file CSV ke sini atau <span class="text-primary-500 font-medium">klik untuk memilih</span>
			</p>
			<p class="text-xs text-surface-400">Format: .csv</p>
			<input
				id="import-file-input"
				type="file"
				accept=".csv"
				class="hidden"
				onchange={handleFileSelect}
			/>
		</div>

		<div class="mt-4 rounded-lg bg-surface-100 p-3 text-xs dark:bg-surface-800">
			<p class="font-medium text-surface-700 dark:text-surface-300">Format kolom CSV:</p>
			<ul class="mt-1 space-y-0.5 text-surface-500 dark:text-surface-400">
				<li><strong>sekuritas</strong> (wajib) - Kode broker, contoh: MNC</li>
				<li><strong>emiten</strong> (wajib) - Ticker saham, contoh: BBCA</li>
				<li><strong>type</strong> (wajib) - buy atau sell</li>
				<li><strong>date</strong> (wajib) - Format YYYY-MM-DD</li>
				<li><strong>price</strong> (wajib) - Harga per lembar (angka &gt; 0)</li>
				<li><strong>lot</strong> (wajib) - Jumlah lot (angka &gt; 0)</li>
				<li><strong>fee</strong> (opsional) - Fee transaksi (default 0)</li>
			</ul>
		</div>
	{:else if step === 'preview'}
		{#if globalErrors.length > 0}
			<div class="mb-3 rounded-lg bg-error-50 p-3 text-sm text-error-700 dark:bg-error-950 dark:text-error-300">
				{#each globalErrors as err}
					<p>{err}</p>
				{/each}
			</div>
		{/if}

		<div class="mb-3 flex items-center gap-4 text-xs">
			<span class="text-surface-500">File: <strong>{fileName}</strong></span>
			<span class="text-surface-500">Total baris: <strong>{parsedRows.length}</strong></span>
			{#if validRowCount > 0}
				<span class="flex items-center gap-1 text-success-600">
					<CheckCircle2 size={12} /> {validRowCount} valid
				</span>
			{/if}
			{#if errorRowCount > 0}
				<span class="flex items-center gap-1 text-error-600">
					<AlertTriangle size={12} /> {errorRowCount} error
				</span>
			{/if}
		</div>

		<div class="max-h-64 overflow-auto rounded-lg border border-surface-200 dark:border-surface-700">
			<table class="w-full text-xs">
				<thead class="sticky top-0 bg-surface-100 dark:bg-surface-800">
					<tr>
						<th class="px-2 py-1.5 text-left font-medium text-surface-600 dark:text-surface-400">#</th>
						{#each parsedHeaders as header}
							<th class="px-2 py-1.5 text-left font-medium text-surface-600 dark:text-surface-400">{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each parsedRows as row, i}
						{@const hasRowError = validationErrors[i] !== undefined}
						<tr class="border-t border-surface-100 dark:border-surface-800 {hasRowError ? 'bg-error-50/50 dark:bg-error-950/30' : ''}">
							<td class="px-2 py-1 text-surface-400">{i + 2}</td>
							{#each parsedHeaders as header}
								{@const cellError = validationErrors[i]?.[header]}
								<td class="px-2 py-1 {cellError ? 'text-error-600 font-medium' : 'text-surface-700 dark:text-surface-300'}">
									{row[header] || '-'}
									{#if cellError}
										<span class="block text-[10px] text-error-500">{cellError}</span>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<button
			type="button"
			class="btn btn-sm mt-3"
			onclick={() => { step = 'pick'; file = null; }}
		>
			Pilih file lain
		</button>
	{:else if step === 'result'}
		<div class="flex flex-col items-center gap-3 py-4 text-center">
			<CheckCircle2 size={48} class="text-success-500" />
			<h3 class="text-lg font-bold">Import Selesai</h3>
			<div class="text-sm text-surface-600 dark:text-surface-400">
				<p>Diproses: <strong>{(result?.imported ?? 0) + (result?.skipped ?? 0)}</strong> baris</p>
				<p>Berhasil: <strong class="text-success-600">{result?.imported ?? 0}</strong></p>
				{#if (result?.skipped ?? 0) > 0}
					<p>Dilewati: <strong class="text-warning-600">{result?.skipped}</strong></p>
				{/if}
			</div>
			{#if result?.errors && result.errors.length > 0}
				<div class="mt-2 w-full rounded-lg bg-error-50 p-3 text-left text-xs dark:bg-error-950">
					<p class="font-medium text-error-700 dark:text-error-300">Detail error:</p>
					<ul class="mt-1 space-y-0.5 text-error-600 dark:text-error-400">
						{#each result.errors as err}
							<li>{err}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</AppDialog>

{#snippet footerSnippet()}
	{#if step === 'pick'}
		<button type="button" class="btn" onclick={() => handleOpenChange(false)}>Batal</button>
	{:else if step === 'preview'}
		<button type="button" class="btn" onclick={() => handleOpenChange(false)}>Batal</button>
		<button
			type="button"
			class="btn bg-primary-500 text-primary-contrast-500"
			disabled={saving || hasErrors || parsedRows.length === 0}
			onclick={handleSubmit}
		>
			{#if saving}
				<span class="loading loading-spinner loading-sm"></span> Mengimpor...
			{:else}
				<Upload size={16} /> Import {validRowCount} Baris
			{/if}
		</button>
	{:else if step === 'result'}
		<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={() => handleOpenChange(false)}>
			Tutup
		</button>
	{/if}
{/snippet}
