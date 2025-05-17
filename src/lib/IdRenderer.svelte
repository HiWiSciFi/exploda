<script lang="ts">
    import { getContext } from "svelte";
    import { C } from "./constants";

    let idf = getContext<() => string>(C.CONTEXT.ID);
    let id = $state(idf());

    $effect.pre(() => {
        let nid = idf();
        if (id != nid) id = nid;
    });
</script>

{id}
