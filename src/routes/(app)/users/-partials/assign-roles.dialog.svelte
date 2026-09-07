<script lang="ts">
	import { untrack } from "svelte";
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import type { AuthRole, User } from "$lib/types/Auth";

	interface Props {
		open: boolean;
		item: User | undefined;
		roles: AuthRole[];
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (roleIds: number[]) => void;
	}

	let { open, item, roles, saving, onOpenChange, onSubmit }: Props = $props();

	let selected = $state<number[]>([]);

	$effect(() => {
		if (open) {
			const currentItem = untrack(() => item);
			selected = currentItem?.role_ids ?? [];
		}
		if (!open) {
			selected = [];
		}
	});

	function toggle(id: number) {
		selected = selected.includes(id)
			? selected.filter((x) => x !== id)
			: [...selected, id];
	}

	function handleSubmit() {
		onSubmit(selected);
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Kelola Role"
	description={item
		? `Pilih role untuk ${item.name}`
		: "Pilih role untuk pengguna ini"}
	footer={footerSnippet}
>
	<div class="max-h-[50vh] space-y-2 overflow-y-auto">
		{#if roles.length === 0}
			<p class="text-sm text-surface-500 dark:text-surface-400">
				Belum ada role tersedia.
			</p>
		{/if}
		{#each roles as role (role.id)}
			<label
				class="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-300 p-3 transition-colors hover:bg-surface-200/40 dark:border-surface-700 dark:hover:bg-surface-700/30"
			>
				<input
					type="checkbox"
					class="checkbox mt-0.5"
					checked={selected.includes(role.id)}
					onchange={() => toggle(role.id)}
				/>
				<div class="min-w-0">
					<p class="text-sm font-medium capitalize">{role.name}</p>
					{#if role.description}
						<p class="text-xs text-surface-500 dark:text-surface-400">
							{role.description}
						</p>
					{/if}
				</div>
			</label>
		{/each}
	</div>
</AppDialog>

{#snippet footerSnippet()}
	<button
		type="button"
		class="btn"
		onclick={() => onOpenChange(false)}
		disabled={saving}>Batal</button
	>
	<button
		type="button"
		class="btn bg-primary-500 text-primary-contrast-500"
		disabled={saving || selected.length === 0}
		onclick={handleSubmit}
	>
		{saving ? "Menyimpan..." : "Simpan"}
	</button>
{/snippet}
