<script lang="ts" generics="T extends { id: number }">
  import { Edit, Eye, MoreVertical, Trash2 } from "@lucide/svelte";

  let {
    item,
    canEdit = true,
    canDelete = true,
    canDetail = true,
    onDetail,
    onDelete,
    onEdit,
  }: {
    item: T;
    canEdit?: boolean;
    canDelete?: boolean;
    canDetail?: boolean;
    onDetail?: (item: T) => void;
    onDelete?: (item: T) => void;
    onEdit?: (item: T) => void;
  } = $props();

  let open = $state(false);
  let wrapEl = $state<HTMLDivElement>();

  const showDetail = $derived(canDetail && !!onDetail);
  const showEdit = $derived(canEdit && !!onEdit);
  const showDelete = $derived(canDelete && !!onDelete);
  const hasAnyAction = $derived(showDetail || showEdit || showDelete);

  function toggle() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    if (wrapEl && !wrapEl.contains(event.target as Node)) {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  });
</script>

{#if hasAnyAction}
  <div class="relative inline-block text-left" bind:this={wrapEl}>
    <button
      type="button"
      class="rounded p-1 text-surface-500 hover:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-700"
      onclick={toggle}
      aria-label="Aksi"
    >
      <MoreVertical size={16} />
    </button>

    {#if open}
      <div
        class="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-surface-300 bg-white py-1 shadow-lg dark:border-surface-700 dark:bg-surface-800"
      >
        {#if showDetail}
          <button
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
            onclick={() => {
              open = false;
              onDetail!(item);
            }}
          >
            <Eye size={14} />
            Detail
          </button>
        {/if}
        {#if showEdit}
          <button
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
            onclick={() => {
              open = false;
              onEdit!(item);
            }}
          >
            <Edit size={14} />
            Edit
          </button>
        {/if}
        {#if showDelete}
          <button
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-error-600 hover:bg-surface-100 dark:text-error-400 dark:hover:bg-surface-700"
            onclick={() => {
              open = false;
              onDelete!(item);
            }}
          >
            <Trash2 size={14} />
            Hapus
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}
