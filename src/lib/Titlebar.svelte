<script lang="ts">
    import { getCurrentWindow } from "@tauri-apps/api/window";

    const appWindow = getCurrentWindow();
</script>

<div data-tauri-drag-region class="titlebar">
    <button class="titlebar-button" onclick={appWindow.minimize}>
        <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
        />
    </button>
    <button class="titlebar-button" onclick={appWindow.toggleMaximize}>
        <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
        />
    </button>
    <button class="titlebar-button" onclick={appWindow.close}>
        <img
            src="https://api.iconify.design/mdi:window-close.svg"
            alt="close"
        />
    </button>
</div>

<style>
    .titlebar {
        height: 30px;
        width: 100%;
        background: #329ea3;
        user-select: none;
        display: flex;
        justify-content: flex-end;
        top: 0;
        left: 0;
        right: 0;

        z-index: 5;
    }

    .titlebar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        user-select: none;
        -webkit-user-select: none;
    }

    .titlebar-button:hover {
        background: #5bbec3;
    }
</style>
