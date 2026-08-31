<script lang="ts">
	import { X } from '@lucide/svelte';
	import { Dialog } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		children: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
		onOpenChange?: (open: boolean) => void;
	}
	let { open, title, description, children, footer, onOpenChange }: Props = $props();
</script>

<Dialog {open} onOpenChange={(e) => onOpenChange?.(e.open)}>
	<Dialog.Positioner class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:items-center">
		<Dialog.Backdrop class="fixed inset-0 z-[-1] bg-black/40" />
		<Dialog.Content class="card relative w-full max-w-lg overflow-hidden bg-surface-50 p-0 shadow-2xl dark:bg-surface-900">
			<header class="flex items-start justify-between gap-4 border-b border-surface-300 px-5 py-4 dark:border-surface-700">
				<div>
					<Dialog.Title class="text-lg font-semibold text-balance">{title}</Dialog.Title>
					{#if description}
						<Dialog.Description class="mt-0.5 text-sm text-pretty text-surface-500 dark:text-surface-400">{description}</Dialog.Description>
					{/if}
				</div>
				<Dialog.CloseTrigger class="btn btn-icon shrink-0" aria-label="Tutup">
					<X size={18} />
				</Dialog.CloseTrigger>
			</header>
			<div class="px-5 py-4">
				{@render children()}
			</div>
			{#if footer}
				<footer class="flex justify-end gap-2 border-t border-surface-300 px-5 py-4 dark:border-surface-700">
					{@render footer()}
				</footer>
			{/if}
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>
