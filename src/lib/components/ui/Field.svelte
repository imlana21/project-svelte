<script lang="ts">
	interface Props {
		label: string;
		required?: boolean;
		error?: string | null;
		hint?: string;
		children: import('svelte').Snippet;
	}
	let { label, required = false, error = null, hint, children }: Props = $props();
</script>

<label class="label">
	<span class="text-sm font-medium">
		{label}
		{#if required}<span class="text-error-500"> *</span>{/if}
	</span>
	{@render children()}
	{#if hint}
		<p class="text-xs leading-relaxed text-surface-500 dark:text-surface-400">{hint}</p>
	{/if}
	{#if error}
		<p class="text-xs leading-relaxed text-error-600 dark:text-error-400">{error}</p>
	{/if}
</label>
