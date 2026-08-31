<script lang="ts">
	import AppDialog from "./AppDialog.svelte";

	interface Props {
		open: boolean;
		title?: string;
		message: string;
		confirmLabel?: string;
		loading?: boolean;
		onConfirm: () => void;
		onClose: () => void;
	}
	let {
		open,
		title = "Konfirmasi",
		message,
		confirmLabel = "Hapus",
		loading = false,
		onConfirm,
		onClose,
	}: Props = $props();
</script>

<AppDialog {open} {title} children={confirmSnippet} footer={footerSnippet} />

{#snippet confirmSnippet()}
	<p class="text-sm text-pretty text-surface-600 dark:text-surface-300">
		{message}
	</p>
{/snippet}

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onClose()}>Batal</button>
	<button
		type="button"
		class="btn bg-error-500 text-error-contrast-500"
		disabled={loading}
		onclick={() => onConfirm()}
	>
		{loading ? "Memproses..." : confirmLabel}
	</button>
{/snippet}
