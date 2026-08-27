<script lang="ts">
	interface Props {
		value: boolean;
		trueLabel?: string;
		falseLabel?: string;
	}
	let { value, trueLabel = 'Aktif', falseLabel = 'Nonaktif' }: Props = $props();
</script>

{#if value}
	<span class="badge whitespace-nowrap bg-success-500 text-success-contrast-500">{trueLabel}</span>
{:else}
	<span class="badge whitespace-nowrap bg-surface-300 text-surface-700 dark:bg-surface-700 dark:text-surface-200">{falseLabel}</span>
{/if}
