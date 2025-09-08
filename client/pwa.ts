import { registerSW as viteRegister } from "virtual:pwa-register";

export function registerSW() {
  if (typeof window === "undefined") return;
  const updateSW = viteRegister({
    immediate: true,
    onNeedRefresh() {
      // Auto-refresh for fresh content
      updateSW(true);
    },
    onOfflineReady() {
      // no-op
    },
  });
  // Optional: periodic check every hour
  setInterval(() => updateSW(), 60 * 60 * 1000);
}

registerSW();
