export function preloadImage(url: string) {
  try {
    if (!url) return;
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager" as any;
    img.src = url;
  } catch {}
}
