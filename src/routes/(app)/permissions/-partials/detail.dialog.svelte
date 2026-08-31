<script lang="ts">
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import { formatDate } from "$lib/utils/format";
	import type { AuthPermission } from "$lib/types/Auth";

	interface Props {
		open: boolean;
		item: AuthPermission | undefined;
		onOpenChange: (open: boolean) => void;
	}

	let { open, item, onOpenChange }: Props = $props();
</script>

<AppDialog {open} {onOpenChange} title="Detail Permission">
	{#if item}
		<div class="flex flex-col gap-4">
			<div class="divide-y divide-surface-200 dark:divide-surface-700">
				<div class="flex items-center justify-between gap-4 py-2">
					<span class="text-sm text-surface-500 dark:text-surface-400"
						>Nama</span
					>
					<span class="text-sm font-medium">{item.name}</span>
				</div>
				<div class="flex items-center justify-between gap-4 py-2">
					<span class="text-sm text-surface-500 dark:text-surface-400"
						>Slug</span
					>
					<span class="badge font-mono">{item.slug}</span>
				</div>
				<div class="flex items-center justify-between gap-4 py-2">
					<span class="text-sm text-surface-500 dark:text-surface-400"
						>Deskripsi</span
					>
					<span class="text-sm font-medium">{item.description || "-"}</span>
				</div>
				<div class="flex items-center justify-between gap-4 py-2">
					<span class="text-sm text-surface-500 dark:text-surface-400"
						>Dibuat</span
					>
					<span class="text-sm font-medium">{formatDate(item.created_at)}</span>
				</div>
			</div>

			<div>
				<h4
					class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400"
				>
					Digunakan oleh Role
				</h4>
				{#if item.roles && item.roles.length > 0}
					<div class="flex flex-wrap gap-1.5">
						{#each item.roles as role (role.id)}
							<span class="badge capitalize">{role.name}</span>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-surface-500 dark:text-surface-400">
						Belum ada role yang menggunakan permission ini.
					</p>
				{/if}
			</div>
		</div>
	{/if}
</AppDialog>
