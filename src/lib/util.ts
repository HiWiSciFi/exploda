import { isTauri } from "@tauri-apps/api/core";

export function isFrontendBrowser(): boolean {
    // return true;
    return !isTauri();
}
