<script lang="ts">
  import SplitView from "$lib/SplitView.svelte";
  import SplitPane from "$lib/SplitPane.svelte";
  import IdRenderer from "$lib/IdRenderer.svelte";
  // import DragResizable from "$lib/DragResizable.svelte";

  let panes: number[] = $state([15, 20, -1]);

  function clickdel(id: number) {
    console.log(`removing ${id}`);
    panes.splice(id, 1);
  }

  function clickins(id: number) {
    console.log(`adding ${id}`);
    panes.splice(id, 0, 15);
  }
</script>

<SplitView>
  {#each panes as pane, i}
    <SplitPane size={pane === -1 ? undefined : pane} grow={pane === -1}>
      <div
        style="background-color: rgb({(i + 1) *
          70}, 0, 0); width: 100%; height: 100%"
      >
        <IdRenderer />
        <button onclick={() => clickdel(i)}>Delete</button>
        <button onclick={() => clickins(i)}>Insert</button>
      </div>
    </SplitPane>
  {/each}

  <!-- <SplitPane size={15}>
        <div style="background-color: green;"><IdRenderer /></div>
    </SplitPane>
    <SplitPane size={20}>
        <div style="background-color: yellow;"><IdRenderer /></div>
    </SplitPane>
    <SplitPane grow={true}>
        <h1 style="background-color: orangered;"><IdRenderer /></h1>
    </SplitPane> -->
</SplitView>

<!-- <section class="base">
    <DragResizable initialSize="200" minSize="150" barSize="10">
        <div class="sidebar">1</div>
    </DragResizable>
    <div class="body">2</div>
</section>

<style>
    .base {
        width: 100%;
        height: 100%;

        display: grid;
        grid: "sidebar body" 1fr / auto 1fr;
    }

    .sidebar {
        grid-area: sidebar;
        width: 100%;
        height: 100%;
        background-color: brown;
    }

    .body {
        grid-area: body;
        background-color: brown;
    }
</style> -->
