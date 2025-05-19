<script lang="ts">
    import { C } from "$lib/constants";
    import { isFrontendBrowser } from "$lib/util";
    import { getContext, onMount } from "svelte";
    import type { IMenuBarContext } from "$lib/MenuBar/MenuBar.svelte";
    import { IconChevronRight } from "@tabler/icons-svelte";

    let {
        id,
        title,
        onClick,
    }: { id: string; title: string; onClick?: (id?: string) => void } =
        $props();

    let menuContext = getContext<IMenuBarContext>(C.CONTEXT.MENU_BAR);

    function buttonHandler(id?: string) {
        if (onClick) onClick(id);
    }

    onMount(() => {
        menuContext.onAddItem({
            id: id,
            text: title,
            action: onClick,
        });
    });
</script>

{#if isFrontendBrowser()}
    <button
        onclick={() => buttonHandler(id)}
        class="{menuContext.submenu
            ? 'px-4 py-0.5'
            : 'px-2 py-1'} hover:bg-amber-600 text-left flex flex-row gap-8"
        >{title}
        <IconChevronRight
            style="height: 1rem; float: right; {menuContext.submenu
                ? 'visibility: hidden;'
                : 'display: none;'}"
        />
    </button>
{/if}
