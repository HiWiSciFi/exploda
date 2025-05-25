<script lang="ts">
	import SplitView from "$lib/SplitView.svelte";
	import SplitPane from "$lib/SplitPane.svelte";
	import Explorer from "$lib/Explorer/Explorer.svelte";
	import MenuBar from "$lib/MenuBar/MenuBar.svelte";
	import MenuBarItem from "$lib/MenuBar/MenuBarItem.svelte";
	import MenuSubmenu from "$lib/MenuBar/MenuSubmenu.svelte";
	// import Titlebar from "$lib/Titlebar.svelte";

	function menuHandler(id?: string) {
		if (id) console.log(`Menu item "${id}" clicked`);
		else console.log("Unknown menu item clicked");
	}
</script>

<div class="w-full h-full flex flex-col">
	<!-- <Titlebar /> -->
	<MenuBar>
		<MenuSubmenu id={"file"} title={"File"}>
			<MenuBarItem id={"file/save"} title={"Save"} />
			<MenuBarItem id={"file/saveall"} title={"Save All"} />
			<MenuSubmenu id={"file/export"} title={"Export"}>
				<MenuBarItem id={"file/export/json"} title={"JSON (.json)"} />
				<MenuBarItem id={"file/export/xml"} title={"XML (.xml)"} />
			</MenuSubmenu>
		</MenuSubmenu>
		<MenuBarItem id={"open"} title={"Open"} onClick={menuHandler} />
		<MenuBarItem id={"close"} title={"Close"} onClick={menuHandler} />
	</MenuBar>

	<SplitView class="w-full h-full">
		<SplitPane size={5} resizable={false}>
			<div class="h-full w-full bg-amber-100"></div>
		</SplitPane>
		<SplitPane size={20}><Explorer /></SplitPane>
		<SplitPane grow={true}>
			<div class="h-full w-full bg-amber-600"></div>
		</SplitPane>
	</SplitView>
</div>
