<script module lang="ts">
    export interface IMenuBarContext {
        submenu: boolean;
        onAddItem: (item: SubmenuOptions | MenuItemOptions) => void;
        onclick?: (id: string) => void;
    }
</script>

<script lang="ts">
    import { C } from "$lib/constants";

    import { isFrontendBrowser } from "$lib/util";
    import {
        Menu,
        type MenuItemOptions,
        type MenuOptions,
        type SubmenuOptions,
    } from "@tauri-apps/api/menu";
    import { onMount, setContext, type Snippet } from "svelte";

    let {
        children,
        onclick,
    }: { children?: Snippet; onclick?: (id: string) => void } = $props();

    const options: MenuOptions = { items: [] };

    function onAddItem(item: SubmenuOptions | MenuItemOptions) {
        if (isFrontendBrowser()) return;
        options.items?.push(item);
    }

    setContext<IMenuBarContext>(C.CONTEXT.MENU_BAR, {
        submenu: false,
        onAddItem: onAddItem,
        onclick: onclick,
    });

    onMount(async () => {
        if (isFrontendBrowser()) return;
        await Menu.new(options).then((menu) => menu.setAsAppMenu());
    });
</script>

{#if isFrontendBrowser()}
    <div
        class="w-full h-fit bg-yellow-300 flex flex-row flex-nowrap justify-start text-xs"
    >
        {@render children?.()}
    </div>
{:else}
    {@render children?.()}
{/if}
