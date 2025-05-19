<script lang="ts">
    import { isFrontendBrowser } from "$lib/util";
    import { getContext, onMount, setContext, type Snippet } from "svelte";
    import type { IMenuBarContext } from "$lib/MenuBar/MenuBar.svelte";
    import { C } from "$lib/constants";
    import {
        type MenuItemOptions,
        type SubmenuOptions,
    } from "@tauri-apps/api/menu";
    import { IconChevronRight } from "@tabler/icons-svelte";

    let {
        children,
        id,
        title,
        onclick,
    }: {
        children?: Snippet;
        id?: string;
        title: string;
        onclick?: (id: string) => void;
    } = $props();

    let parentMenu = getContext<IMenuBarContext>(C.CONTEXT.MENU_BAR);
    let options: SubmenuOptions = {
        text: title,
        items: [],
    };

    function onAddItem(item: SubmenuOptions | MenuItemOptions) {
        if (isFrontendBrowser()) return;
        options.items?.push(item);
    }

    setContext<IMenuBarContext>(C.CONTEXT.MENU_BAR, {
        submenu: true,
        onclick: onclick,
        onAddItem: onAddItem,
    });

    let submenu: HTMLDivElement | undefined = $state(undefined);
    let showMenu: boolean = $state(false);

    function toggleMenu(e: Event) {
        showMenu = !showMenu;
        e.stopPropagation();
    }

    function invclick() {
        if (showMenu) showMenu = false;
    }

    onMount(() => {
        console.log(`Submenu ${id}`);
        console.log(parentMenu);
        if (isFrontendBrowser()) return;
        parentMenu.onAddItem(options);
    });
</script>

<svelte:document onclick={invclick} />

{#if isFrontendBrowser()}
    <button
        onclick={toggleMenu}
        class=" relative {parentMenu.submenu
            ? 'px-4 py-0.5'
            : 'px-2 py-1'} hover:bg-amber-600 text-left"
        >{title}
        <IconChevronRight
            style="height: 1rem; float: right; {parentMenu.submenu
                ? ''
                : 'display: none;'}"
        />
        <div
            bind:this={submenu}
            class="flex transition-opacity {showMenu
                ? 'visible opacity-100'
                : 'invisible opacity-0'} absolute {parentMenu.submenu
                ? 'left-full top-0'
                : 'left-0 top-full'} flex-col z-3 bg-slate-500 items-stretch p-1 w-max rounded-sm border-solid border-1"
        >
            {@render children?.()}
        </div>
    </button>
{:else}
    {@render children?.()}
{/if}
