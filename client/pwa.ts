import { registerSW as viteRegister } from "virtual:pwa-register";

export function registerSW() {
  if (typeof window === "undefined") return;

  if (import.meta.env.DEV) {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
    }
    return; // avoid SW during dev to keep Vite HMR stable
  }

  const updateSW = viteRegister({
    immediate: true,
    onNeedRefresh() {
      updateSW(true);
    },
    onOfflineReady() {},
  });
  setInterval(() => updateSW(), 60 * 60 * 1000);
}

registerSW();
