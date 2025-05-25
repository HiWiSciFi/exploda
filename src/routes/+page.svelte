<script lang="ts">
	import SplitView from "$lib/SplitView.svelte";
	import SplitPane from "$lib/SplitPane.svelte";
	import Explorer from "$lib/Explorer/Explorer.svelte";
	import MenuBar from "$lib/MenuBar/MenuBar.svelte";
	import MenuBarItem from "$lib/MenuBar/MenuBarItem.svelte";
	import MenuSubmenu from "$lib/MenuBar/MenuSubmenu.svelte";
	// import Titlebar from "$lib/Titlebar.svelte";

	// import Edm from "$lib/OData/EdmTypes";

	// let dtstr = "datetime'2025-05-25T23:59:59.1234567'";
	// let dt = Edm.DateTime.datetimeFromODataString(dtstr);
	// console.log(dtstr);
	// console.log(dt);
	// console.log(dt?.toString());

	// let fstr = "0.12345678f";
	// let ft = Edm.Single.singleFromODataString(fstr);
	// console.log(fstr);
	// console.log(ft);
	// console.log(ft?.toString());

	// let tstr = "time'PT20H17M44.345S'";
	// let tt = Edm.Time.timeFromODataString(tstr);
	// console.log(tstr);
	// console.log(tt);
	// console.log(tt?.toString());

	// let dtostr = "datetimeoffset'2002-10-10T17:00:00.3+01:00'";
	// let dto = Edm.DateTimeOffset.datetimeoffsetFromODataString(dtostr);
	// console.log(dtostr);
	// console.log(dto);
	// console.log(dto?.toString());

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
