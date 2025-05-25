<script module lang="ts">
    export interface IExplorerItem {}

    export interface IExplorerContext {
        addItem: (item: IExplorerItem) => void;
    }
</script>

<script lang="ts">
    import ExplorerItem from "./ExplorerItem.svelte";

    let items: string[] = ["VEEEEERY looooooong Item 1", "Item 2", "Item 3"];
</script>

<!-- <div class="w-full h-full bg-amber-100"></div> -->

<div class="w-full h-full flex flex-col overflow-auto">
    <div class="w-max h-full">
        {#each items as itemText}
            <ExplorerItem text={itemText} />
        {/each}
    </div>
</div>
