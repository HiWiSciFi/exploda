<script module lang="ts">
    export interface SplitViewPane {
        getId: () => number;
        setId: (id: number) => void;
        setLast: (last: boolean) => void;
    }

    export interface SplitViewContext {
        onCreatePane: (pane: SplitViewPane) => void;
        onDeletePane: (id: number) => void;
    }
</script>

<script lang="ts">
    import { C } from "$lib/constants";
    import { setContext, type Snippet } from "svelte";

    let { children, class: clazz }: { children?: Snippet; class?: string } =
        $props();
    let container: HTMLDivElement;

    setContext<SplitViewContext>(C.CONTEXT.SPLIT_VIEW, {
        onCreatePane: onCreatePane,
        onDeletePane: onDeletePane,
    });

    let splitViewPanes: SplitViewPane[] = $state([]);

    function onCreatePane(pane: SplitViewPane): void {
        if (splitViewPanes.length > 0) {
            splitViewPanes[splitViewPanes.length - 1].setLast(false);
        }

        let id = splitViewPanes.push(pane) - 1;
        pane.setId(id);
        pane.setLast(true);
    }

    function onDeletePane(id: number): void {
        if (id < 0 || id >= splitViewPanes.length)
            return console.error(`No Pane with ID (index) ${id} in array`);

        splitViewPanes.splice(id, 1);

        for (let i = id; i < splitViewPanes.length; i++)
            splitViewPanes[i].setId(i);
    }
</script>

<div class={clazz ? clazz : "block w-full h-full"}>
    <div bind:this={container} class="flex flex-row flex-nowrap w-full h-full">
        {@render children?.()}
    </div>
</div>
