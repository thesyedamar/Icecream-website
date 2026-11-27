const cutoutCache = new Map<string, string>();
const inFlightCache = new Map<string, Promise<string>>();

/**
 * Removes pure white/light-gray studio backdrop connected to image edges via BFS flood-fill,
 * preserving white ice cream scoops inside the cup contour, then outputs a transparent WebP/PNG data URL.
 */
export function processStudioCutout(src: string): Promise<string> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(src);
  }
  const cached = cutoutCache.get(src);
  if (cached) return Promise.resolve(cached);

  const existing = inFlightCache.get(src);
  if (existing) return existing;

  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const maxDim = 640;
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
        const w = Math.max(1, Math.round((img.naturalWidth || maxDim) * scale));
        const h = Math.max(1, Math.round((img.naturalHeight || maxDim) * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const isBackdrop = (idx: number): boolean => {
          const offset = idx * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const chroma = maxC - minC;
          const lum = (r + g + b) / 3;
          // Studio white and soft neutral contact-shadow backdrop
          return (lum >= 220 && chroma <= 20) || (lum >= 184 && chroma <= 11);
        };

        const enqueue = (idx: number) => {
          if (visited[idx]) return;
          if (!isBackdrop(idx)) return;
          visited[idx] = 1;
          queue[tail++] = idx;
        };

        for (let x = 0; x < w; x++) {
          enqueue(x);
          enqueue((h - 1) * w + x);
        }
        for (let y = 1; y < h - 1; y++) {
          enqueue(y * w);
          enqueue(y * w + (w - 1));
        }

        while (head < tail) {
          const idx = queue[head++];
          const x = idx % w;
          const y = (idx - x) / w;
          if (x > 0) enqueue(idx - 1);
          if (x < w - 1) enqueue(idx + 1);
          if (y > 0) enqueue(idx - w);
          if (y < h - 1) enqueue(idx + w);
        }

        // Clear background pixels and feather 1px boundary for smooth edges
        for (let i = 0; i < w * h; i++) {
          if (visited[i]) {
            data[i * 4 + 3] = 0;
          }
        }

        // Soft 1px fringe attenuation on pixels adjacent to cleared backdrop
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            if (visited[idx]) continue;
            const neighborCleared =
              visited[idx - 1] ||
              visited[idx + 1] ||
              visited[idx - w] ||
              visited[idx + w];
            if (neighborCleared) {
              const offset = idx * 4;
              const r = data[offset];
              const g = data[offset + 1];
              const b = data[offset + 2];
              const lum = (r + g + b) / 3;
              const chroma = Math.max(r, g, b) - Math.min(r, g, b);
              if (lum > 178 && chroma < 24) {
                data[offset + 3] = Math.round(data[offset + 3] * 0.32);
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const outUrl = canvas.toDataURL('image/webp', 0.92);
        cutoutCache.set(src, outUrl);
        resolve(outUrl);
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });

  inFlightCache.set(src, promise);
  return promise;
}
