<script lang="ts">
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import StatusBadge from "$lib/components/ui/StatusBadge.svelte";
	import { formatDate } from "$lib/utils/format";
	import type { User } from "$lib/types/Auth";

	interface Props {
		open: boolean;
		item: User | undefined;
		canManageRoles: boolean;
		onOpenChange: (open: boolean) => void;
		onManageRoles: () => void;
	}

	let { open, item, canManageRoles, onOpenChange, onManageRoles }: Props =
		$props();
</script>

<AppDialog {open} {onOpenChange} title="Detail Pengguna">
	{#if item}
		<div class="flex flex-col gap-4">
			<div
				class="rounded-lg border border-surface-300 p-4 dark:border-surface-700"
			>
				<h4
					class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400"
				>
					Informasi Akun
				</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Nama</span
						>
						<span class="text-sm font-medium">{item.name}</span>
					</div>
					<div class="flex items-center justify-between gap-4 py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Email</span
						>
						<span class="text-sm font-medium">{item.email}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Status</span
						>
						<StatusBadge value={item.is_active} />
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Login Terakhir</span
						>
						<span class="text-sm font-medium"
							>{item.last_login_at
								? formatDate(item.last_login_at)
								: "Belum pernah"}</span
						>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Terdaftar</span
						>
						<span class="text-sm font-medium"
							>{formatDate(item.created_at)}</span
						>
					</div>
				</div>
			</div>

			<div>
				<div class="mb-2 flex items-center justify-between">
					<h4
						class="text-sm font-semibold text-surface-500 dark:text-surface-400"
					>
						Role
					</h4>
					{#if canManageRoles}
						<button type="button" class="btn btn-sm" onclick={onManageRoles}
							>Kelola Role</button
						>
					{/if}
				</div>
				{#if item.roles.length > 0}
					<div class="flex flex-wrap gap-1.5">
						{#each item.roles as role (role)}
							<span class="badge capitalize">{role}</span>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-surface-500 dark:text-surface-400">
						Pengguna ini belum punya role.
					</p>
				{/if}
			</div>
		</div>
	{/if}
</AppDialog>
