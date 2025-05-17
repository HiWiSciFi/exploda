<script lang="ts">
    import type { Snippet } from "svelte";
    import CursorControl from "$lib/CursorControl.svelte";

    let { children }: { children?: Snippet } = $props();

    import "../app.css";
</script>

<CursorControl>
    {@render children?.()}
</CursorControl>
