"use client";

import { useEffect, useRef } from "react";

/**
 * Live ASCII wave, generated in code from a luminance map image.
 *
 * Replaces the pre-rendered ascii-animation video in the homepage hero: the
 * source image is sampled on a character grid, each cell's brightness picks a
 * glyph from a density ramp and a colour from the MAWT green gradient, and a
 * ticker randomly mutates glyphs so the wave shimmers like the original video.
 *
 * Rendering happens on a <canvas> (one repaint per flicker tick, ~10fps), so
 * the cost stays far below both the video decode it replaces and a DOM/span
 * implementation.
 */

type AsciiWaveProps = {
  /** Image whose luminance drives the wave shape. Served from /public. */
  src: string;
  /** Pause the ticker entirely (layer hidden, reduced motion...). */
  active: boolean;
  /** Called once the first frame has been painted. */
  onReady?: () => void;
  /** 'contain' shows the whole frame with its black margins (the reference
   * composition); 'cover' crops in, using the focus point below. */
  fit?: "contain" | "cover";
  /** Cover-crop focus point, as fractions of the image (0..1). */
  focusX?: number;
  focusY?: number;
  className?: string;
};

/** Glyph pools per brightness tier — the reference frame uses @ # S 0 only.
 * Dim cells swap among dim glyphs, so the flicker never makes a dark edge
 * suddenly read as a bright core. */
const TIER_POOLS = ["0", "0S", "S0", "S0#", "#S0", "@#S", "@#", "@@#"] as const;

/** MAWT ramp, darkest visible cell → white-hot core, mirroring the reference
 * where the heart of the wave burns out to white. */
const COLOR_STOPS: [number, number, number][] = [
  [22, 66, 50],    // #164232
  [35, 104, 79],   // #23684F
  [56, 143, 108],  // #388F6C
  [86, 180, 141],  // #56B48D
  [117, 218, 180], // #75DAB4 — brand
  [176, 240, 214], // #B0F0D6
  [225, 255, 243], // #E1FFF3
  [255, 255, 255], // #FFFFFF — core
];

const CELL = 22;          // grid cell in CSS px — chunky glyphs, as in the reference
const TICK_MS = 100;      // flicker cadence, mirrors the reference script
const LUM_FLOOR = 0.05;   // below this a cell stays empty (pure background)

function lumColor(lum: number): string {
  const t = Math.min(1, Math.max(0, (lum - LUM_FLOOR) / (1 - LUM_FLOOR)));
  const pos = t * (COLOR_STOPS.length - 1);
  const i = Math.min(COLOR_STOPS.length - 2, Math.floor(pos));
  const f = pos - i;
  const [r1, g1, b1] = COLOR_STOPS[i];
  const [r2, g2, b2] = COLOR_STOPS[i + 1];
  return `rgb(${Math.round(r1 + (r2 - r1) * f)},${Math.round(g1 + (g2 - g1) * f)},${Math.round(b1 + (b2 - b1) * f)})`;
}

type Cell = { x: number; y: number; lum: number; tier: number; char: string; color: string };

export function AsciiWave({ src, active, onReady, fit = "contain", focusX = 0.5, focusY = 0.48, className }: AsciiWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const readyRef = useRef(false);
  const onReadyRef = useRef(onReady);

  activeRef.current = active;
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cells: Cell[] = [];
    let img: HTMLImageElement | null = null;
    let interval = 0;
    let disposed = false;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.font = `${CELL - 2}px ui-monospace, Menlo, Consolas, monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (const c of cells) {
        ctx.fillStyle = c.color;
        ctx.fillText(c.char, c.x, c.y);
      }
    };

    const buildGrid = () => {
      if (!img || disposed) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const cols = Math.ceil(rect.width / CELL);
      const rows = Math.ceil(rect.height / CELL);

      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      if (fit === "contain") {
        // Show the WHOLE frame, black margins included — the reference is a
        // composed square with breathing room around the wave, and cover-crop
        // was blowing the wave up to fill the viewport.
        const s = Math.min(cols / img.width, rows / img.height);
        const dw = img.width * s;
        const dh = img.height * s;
        octx.drawImage(img, 0, 0, img.width, img.height, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
      } else {
        // Cover-crop, honouring the focus point.
        const scale = Math.max((cols * CELL) / img.width, (rows * CELL) / img.height);
        const cropW = (cols * CELL) / scale;
        const cropH = (rows * CELL) / scale;
        const cropX = Math.min(Math.max((img.width - cropW) * focusX, 0), img.width - cropW);
        const cropY = Math.min(Math.max((img.height - cropH) * focusY, 0), img.height - cropH);
        octx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cols, rows);
      }
      const data = octx.getImageData(0, 0, cols, rows).data;

      // Dominant-channel intensity (HSV value) rather than Rec.709 luminance:
      // the reference frame is blue, and luminance weighs blue at 7%, which
      // crushed the whole wave to the floor.
      const raw = new Float32Array(cols * rows);
      let maxLum = 0;
      // Cut JPEG compression noise BEFORE normalisation: the reference is a
      // WhatsApp JPEG whose black background carries faint speckle that the
      // max-stretch below would otherwise amplify into stray glyphs.
      const RAW_FLOOR = 0.035;
      for (let i = 0; i < cols * rows; i++) {
        const p = i * 4;
        const v = Math.max(data[p], data[p + 1], data[p + 2]) / 255;
        raw[i] = v < RAW_FLOOR ? 0 : v;
        if (raw[i] > maxLum) maxLum = raw[i];
      }
      // Normalise to the sampled maximum: the source is thin glyphs on black,
      // so cell-averaging caps raw values around ~0.4 — without this stretch
      // the hot end of the ramp (the brand greens) would never be reached.
      const scale2 = maxLum > 0.01 ? 1 / maxLum : 1;

      // Shadowed edges, as in the reference frame: glyphs die out softly
      // toward the sides (strong) and the top/bottom (gentle) instead of
      // stopping on a hard border.
      const smooth = (t: number) => {
        const c = Math.min(1, Math.max(0, t));
        return c * c * (3 - 2 * c);
      };
      const fadeCols = Math.max(4, cols * 0.14);
      const fadeRows = Math.max(3, rows * 0.12);
      const edgeFade = (cIdx: number, r: number) =>
        smooth(Math.min(cIdx, cols - 1 - cIdx) / fadeCols) *
        smooth(Math.min(r, rows - 1 - r) / fadeRows);

      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let cIdx = 0; cIdx < cols; cIdx++) {
          const lum =
            Math.pow(Math.min(1, raw[r * cols + cIdx] * scale2), 0.8) * edgeFade(cIdx, r);
          if (lum < LUM_FLOOR) continue;
          const tier = Math.min(
            TIER_POOLS.length - 1,
            Math.floor(((lum - LUM_FLOOR) / (1 - LUM_FLOOR)) * TIER_POOLS.length),
          );
          const pool = TIER_POOLS[tier];
          cells.push({
            x: cIdx * CELL + CELL / 2,
            y: r * CELL + CELL / 2,
            lum,
            tier,
            char: pool[Math.floor(Math.random() * pool.length)],
            color: lumColor(lum),
          });
        }
      }

      paint();
      if (!readyRef.current) {
        readyRef.current = true;
        onReadyRef.current?.();
      }
    };

    const tick = () => {
      if (!activeRef.current || document.hidden || cells.length === 0) return;
      // Mutate a random slice of lit cells (~5-9%), as the reference script does.
      const mutations = Math.max(30, Math.floor(cells.length * (0.05 + Math.random() * 0.04)));
      for (let i = 0; i < mutations; i++) {
        const c = cells[Math.floor(Math.random() * cells.length)];
        const pool = TIER_POOLS[c.tier];
        c.char = pool[Math.floor(Math.random() * pool.length)];
        // Occasional one-tick sparkle: nudge the colour one step hotter.
        c.color = Math.random() < 0.12 ? lumColor(Math.min(1, c.lum + 0.18)) : lumColor(c.lum);
      }
      paint();
    };

    img = new Image();
    img.decoding = "async";
    img.onload = buildGrid;
    img.src = src;

    const ro = new ResizeObserver(buildGrid);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    interval = window.setInterval(tick, TICK_MS);

    return () => {
      disposed = true;
      window.clearInterval(interval);
      ro.disconnect();
      if (img) img.onload = null;
    };
  }, [src, fit, focusX, focusY]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
