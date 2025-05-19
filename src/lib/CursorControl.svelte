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

    let cursor = $state(C.CSS.CURSOR.AUTO);

    setContext<CursorControlContext>(C.CONTEXT.CURSOR_CONTROL, {
        setCursor,
        unsetCursor,
        getCursor,
    });

    function setCursor(newCursor: string): void {
        cursor = newCursor;
    }

    function unsetCursor(): void {
        cursor = C.CSS.CURSOR.AUTO;
    }

    function getCursor(): string {
        return cursor;
    }
</script>

<div class="block w-full h-full {cursor}">
    {@render children?.()}
</div>
