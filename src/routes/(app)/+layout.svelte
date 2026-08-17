<script lang="ts">
	import AdminShell from '$lib/components/layout/AdminShell.svelte';

	let { children } = $props();
</script>

<AdminShell>
	{@render children()}
</AdminShell>
