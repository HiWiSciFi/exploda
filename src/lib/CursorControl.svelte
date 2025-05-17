<script module lang="ts">
    export interface CursorControlContext {
        setCursor: (cursor: string) => void;
        unsetCursor: () => void;
        getCursor: () => string;
    }
</script>

<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import { C } from "./constants";

    let { children }: { children?: Snippet } = $props();

    let cursor = $state("");

    setContext<CursorControlContext>(C.CONTEXT.CURSOR_CONTROL, {
        setCursor,
        unsetCursor,
        getCursor,
    });

    function setCursor(newCursor: string): void {
        cursor = newCursor;
    }

    function unsetCursor(): void {
        cursor = "";
    }

    function getCursor(): string {
        return cursor;
    }
</script>

<div
    class="cursor_container"
    style={cursor === "" ? "" : "cursor: " + cursor + ";"}
>
    {@render children?.()}
</div>

<style>
    .cursor_container {
        display: block;
        width: 100%;
        height: 100%;
    }
</style>
