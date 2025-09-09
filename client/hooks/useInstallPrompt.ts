import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", handler as any);
    window.addEventListener("appinstalled", onInstalled);

    // iOS standalone check
    // @ts-ignore
    const isStandalone =
      window.navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) setInstalled(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as any);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const showPrompt = async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const res = await deferred.userChoice;
    setDeferred(null);
    return res.outcome === "accepted";
  };

  return {
    canInstall: !!deferred && !installed,
    installed,
    showPrompt,
  } as const;
}
