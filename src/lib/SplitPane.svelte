<script lang="ts">
    import {
        getContext,
        onDestroy,
        onMount,
        setContext,
        type Snippet,
    } from "svelte";
    import type { SplitViewContext } from "./SplitView.svelte";
    import { C } from "./constants";
    import { type CursorControlContext } from "./CursorControl.svelte";

    let {
        children,
        size,
        grow = false,
        resizable = true,
    }: {
        children?: Snippet;
        size?: number;
        grow?: boolean;
        resizable?: boolean;
    } = $props();
    let id: number = $state(-1);

    let widthInitial = $state(true);
    let currentWidth = $state(0);
    let widthstr = $derived(
        widthInitial ? (size ? size + "%" : "auto") : currentWidth + "px",
    );

    let last = $state(false);

    let { setCursor, unsetCursor } = getContext<CursorControlContext>(
        C.CONTEXT.CURSOR_CONTROL,
    );

    let container: HTMLDivElement;

    const context = getContext<SplitViewContext>(C.CONTEXT.SPLIT_VIEW);
    context.onCreatePane({
        getId: getId,
        setId: setId,
        setLast: setLast,
    });

    onMount(() => {
        let style = window.getComputedStyle(container);
        if (!style.width.endsWith("px")) {
            console.error("Computed style is not in px");
            return;
        }
        if (!grow) {
            currentWidth = Number(style.width.slice(0, -2));
            widthInitial = false;
        }
    });

    onDestroy(() => {
        context.onDeletePane(id);
    });

    function setLast(newLast: boolean): void {
        last = newLast;
    }

    function setId(newId: number): void {
        id = newId;
    }

    function getId(): number {
        return id;
    }

    setContext<() => number>(C.CONTEXT.ID, getId);

    let resizing = false;

    function startResize(e: MouseEvent) {
        resizing = true;
        setCursor(C.CSS.CURSOR.RESIZE.EW);
        e.preventDefault();
    }

    function endResize() {
        resizing = false;
        unsetCursor();
    }

    function resize(e: MouseEvent) {
        if (resizing) {
            let rect = container.getBoundingClientRect();
            let desiredSize = e.x + 3 / 2 - rect.left;
            currentWidth = desiredSize;
        }
    }
</script>

<svelte:window onmousemove={resize} onmouseup={endResize} />

<div
    bind:this={container}
    class="block relative {grow ? 'grow' : ''}"
    style="width: {widthstr};"
>
    {@render children?.()}
</div>

{#if resizable && !last}
    <div
        class="w-0.5 h-full bg-gray-400 cursor-ew-resize relative"
        onmousedown={startResize}
        role="none"
    >
        <div
            class="block absolute bg-green-700 w-1 h-full -ml-0.5 z-10 opacity-0 transition-opacity hover:opacity-100"
        ></div>
    </div>
{/if}
