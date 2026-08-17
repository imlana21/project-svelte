<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { AuthPermission, AuthRole } from '$lib/types/Auth';

	interface Props {
		open: boolean;
		item: AuthRole | undefined;
		permissions: AuthPermission[];
		canManagePermissions: boolean;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (permissionIds: number[]) => void;
	}

	let { open, item, permissions, canManagePermissions, saving, onOpenChange, onSubmit }: Props = $props();

	let selected = $state<number[]>([]);

	$effect(() => {
		if (untrack(() => open)) {
			selected = item?.permissions.map((p) => p.id) ?? [];
		}
	});

	function toggle(id: number) {
		selected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
	}

	function handleSubmit() {
		onSubmit(selected);
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Detail Role & Permission"
	description={item?.name}
	footer={footerSnippet}
>
	{#if item}
		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap items-center gap-2 text-sm">
				<span class="badge font-mono">{item.slug}</span>
				<StatusBadge value={item.is_active} />
				{#if typeof item.users_count === 'number'}
					<span class="text-surface-500 dark:text-surface-400">{item.users_count} pengguna</span>
				{/if}
			</div>
			{#if item.description}
				<p class="text-sm text-surface-600 dark:text-surface-300">{item.description}</p>
			{/if}

			<div>
				<p class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Permission</p>
				<div class="max-h-[45vh] space-y-2 overflow-y-auto">
					{#if permissions.length === 0}
						<p class="text-sm text-surface-500 dark:text-surface-400">Belum ada permission tersedia.</p>
					{/if}
					{#each permissions as permission (permission.id)}
						<label
							class="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-300 p-3 transition-colors hover:bg-surface-200/40 dark:border-surface-700 dark:hover:bg-surface-700/30"
							class:pointer-events-none={!canManagePermissions}
						>
							<input
								type="checkbox"
								class="checkbox mt-0.5"
								checked={selected.includes(permission.id)}
								disabled={!canManagePermissions}
								onchange={() => toggle(permission.id)}
							/>
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<p class="text-sm font-medium">{permission.name}</p>
									<span class="badge font-mono text-[10px]">{permission.slug}</span>
								</div>
								{#if permission.description}
									<p class="text-xs text-surface-500 dark:text-surface-400">{permission.description}</p>
								{/if}
							</div>
						</label>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Tutup</button>
	{#if canManagePermissions}
		<button type="button" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving} onclick={handleSubmit}>
			{saving ? 'Menyimpan...' : 'Simpan Permission'}
		</button>
	{/if}
{/snippet}
