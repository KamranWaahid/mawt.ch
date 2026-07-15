"use client";

import { useEffect, useRef } from "react";

/**
 * Live ASCII wave, generated in code from a luminance map image.
 */

type AsciiWaveProps = {
  src: string;
  active: boolean;
  onReady?: () => void;
  fit?: "contain" | "cover";
  focusX?: number;
  focusY?: number;
  className?: string;
};

const CELL = 22;
const TICK_MS = 100;

const getChar = (intensity: number) => {
  const pool = ["0", "S", "#", "@"];
  const targetIdx = intensity * (pool.length - 1);
  const spread = (Math.random() - 0.5) * 2.0; 
  let finalIdx = Math.round(targetIdx + spread);
  finalIdx = Math.max(0, Math.min(pool.length - 1, finalIdx));
  return pool[finalIdx];
};

// OKLab interpolation
function oklab_to_srgb(l: number, a: number, b: number) {
  let l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  l_ = l_ * l_ * l_;
  m_ = m_ * m_ * m_;
  s_ = s_ * s_ * s_;

  const r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const b_ = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  const to_srgb = (c: number) => {
    c = Math.max(0, Math.min(1, c));
    return c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
  };

  return [
    Math.round(to_srgb(r) * 255),
    Math.round(to_srgb(g) * 255),
    Math.round(to_srgb(b_) * 255)
  ];
}

function srgb_to_oklab(r: number, g: number, b: number) {
  const to_linear = (c: number) => {
    c /= 255;
    return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  };
  const rl = to_linear(r);
  const gl = to_linear(g);
  const bl = to_linear(b);

  const l_ = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m_ = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s_ = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l__ = Math.cbrt(l_);
  const m__ = Math.cbrt(m_);
  const s__ = Math.cbrt(s_);

  return [
    0.2104542553 * l__ + 0.7936177850 * m__ - 0.0040720468 * s__,
    1.9779984951 * l__ - 2.4285922050 * m__ + 0.4505937099 * s__,
    0.0259040371 * l__ + 0.7827717662 * m__ - 0.8086757660 * s__
  ];
}

const DARK_LAB = srgb_to_oklab(0, 43, 54);
const BRIGHT_LAB = srgb_to_oklab(117, 218, 180);

function interpolateColor(t: number, alpha: number): string {
  const l = DARK_LAB[0] + (BRIGHT_LAB[0] - DARK_LAB[0]) * t;
  const a = DARK_LAB[1] + (BRIGHT_LAB[1] - DARK_LAB[1]) * t;
  const b = DARK_LAB[2] + (BRIGHT_LAB[2] - DARK_LAB[2]) * t;
  const [r, g, b_rgb] = oklab_to_srgb(l, a, b);
  return `rgba(${r},${g},${b_rgb},${alpha})`;
}

const smoothstep = (min: number, max: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
};

type Cell = { x: number; y: number; intensity: number; colorIntensity: number; opacity: number; char: string; color: string };

export function AsciiWave({ src, active, onReady, fit = "contain", focusX = 0.5, focusY = 0.48, className }: AsciiWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const readyRef = useRef(false);
  const onReadyRef = useRef(onReady);

  activeRef.current = active;
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = canvas?.parentElement;
    if (!canvas || !viewport) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cells: Cell[] = [];
    let img: HTMLImageElement | null = null;
    let animationFrameId: number;
    let disposed = false;
    let lastTick = 0;

    const VIEWPORT_LOGICAL_WIDTH = 630;
    const VIEWPORT_LOGICAL_HEIGHT = 630;
    const VIEWPORT_COLS = Math.ceil(VIEWPORT_LOGICAL_WIDTH / CELL);
    const VIEWPORT_ROWS = Math.ceil(VIEWPORT_LOGICAL_HEIGHT / CELL);
    
    const OVERDRAW_CELLS = 25;
    const cols = VIEWPORT_COLS + OVERDRAW_CELLS * 2;
    const rows = VIEWPORT_ROWS + OVERDRAW_CELLS * 2;

    const LOGICAL_WIDTH = cols * CELL;
    const LOGICAL_HEIGHT = rows * CELL;

    const paint = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.font = `${CELL - 2}px ui-monospace, Menlo, Consolas, monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (const c of cells) {
        ctx.fillStyle = c.color;
        ctx.fillText(c.char, c.x, c.y);
      }
    };

    const resizeCanvas = () => {
      if (disposed) return;
      const rect = viewport.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const scaleX = rect.width / VIEWPORT_LOGICAL_WIDTH;
      const scaleY = rect.height / VIEWPORT_LOGICAL_HEIGHT;
      const renderScale = Math.min(scaleX, scaleY);

      const overdrawX = OVERDRAW_CELLS * CELL * renderScale;
      const overdrawY = OVERDRAW_CELLS * CELL * renderScale;

      canvas.style.width = `${rect.width + overdrawX * 2}px`;
      canvas.style.height = `${rect.height + overdrawY * 2}px`;
      canvas.width = Math.round((rect.width + overdrawX * 2) * dpr);
      canvas.height = Math.round((rect.height + overdrawY * 2) * dpr);

      canvas.style.position = 'absolute';
      canvas.style.left = `-${overdrawX}px`;
      canvas.style.top = `-${overdrawY}px`;
      canvas.style.pointerEvents = 'none';

      const offsetX = (rect.width - VIEWPORT_LOGICAL_WIDTH * renderScale) / 2;
      const isMobile = rect.width < 768;
      const offsetY = (rect.height - VIEWPORT_LOGICAL_HEIGHT * renderScale) / 2 - (isMobile ? rect.height * 0.2 : 0);

      ctx.setTransform(dpr * renderScale, 0, 0, dpr * renderScale, dpr * offsetX, dpr * offsetY);
      paint();
    };

    const buildGrid = () => {
      if (!img || disposed) return;

      const offCore = document.createElement("canvas");
      offCore.width = cols;
      offCore.height = rows;
      const octxCore = offCore.getContext("2d", { willReadFrequently: true });
      if (!octxCore) return;

      if (fit === "contain") {
        const s = Math.min(VIEWPORT_COLS / img.width, VIEWPORT_ROWS / img.height);
        const dw = img.width * s;
        const dh = img.height * s;
        octxCore.drawImage(
          img, 
          0, 0, img.width, img.height, 
          (cols - dw) / 2, (rows - dh) / 2, dw, dh
        );
      } else {
        const scale = Math.max(VIEWPORT_COLS / img.width, VIEWPORT_ROWS / img.height);
        const cropW = VIEWPORT_COLS / scale;
        const cropH = VIEWPORT_ROWS / scale;
        const cropX = Math.min(Math.max((img.width - cropW) * focusX, 0), img.width - cropW);
        const cropY = Math.min(Math.max((img.height - cropH) * focusY, 0), img.height - cropH);
        
        octxCore.drawImage(
          img, 
          cropX, cropY, cropW, cropH, 
          OVERDRAW_CELLS, OVERDRAW_CELLS, VIEWPORT_COLS, VIEWPORT_ROWS
        );
      }

      const coreData = octxCore.getImageData(0, 0, cols, rows).data;

      const rawCore = new Float32Array(cols * rows);
      let maxLumCore = 0;

      for (let i = 0; i < cols * rows; i++) {
        const p = i * 4;
        const vCore = Math.max(coreData[p], coreData[p + 1], coreData[p + 2]) / 255;
        rawCore[i] = vCore;
        if (rawCore[i] > maxLumCore) maxLumCore = rawCore[i];
      }

      const scale2Core = maxLumCore > 0.01 ? 1 / maxLumCore : 1;

      cells = [];

      const stableRandom = (cIdx: number, r: number) => {
        return Math.abs(Math.sin(r * 12.9898 + cIdx * 78.233) * 43758.5453) % 1;
      };

      const angle = -28 * Math.PI / 180;
      const centerX = cols / 2;
      const centerY = rows / 2;

      for (let r = 0; r < rows; r++) {
        for (let cIdx = 0; cIdx < cols; cIdx++) {
          const idx = r * cols + cIdx;

          const coreLum = Math.pow(Math.min(1, rawCore[idx] * scale2Core), 0.8);

          const dx = cIdx - centerX;
          const dy = r - centerY;
          const localX = dx * Math.cos(angle) + dy * Math.sin(angle);
          const localY = -dx * Math.sin(angle) + dy * Math.cos(angle);

          const innerLength = 16;
          const outerLength = 55;
          const lengthFade = 1 - smoothstep(innerLength, outerLength, Math.abs(localX));

          // Clean wedge taper: narrow at the top (localX > 0), wide at the base (localX < 0)
          const taper = 1 - (localX / outerLength) * 0.45;
          const innerWidth = Math.max(2, 11 * taper);
          const outerWidth = Math.max(10, 43 * taper);
          const fade = 1 - smoothstep(innerWidth, outerWidth, Math.abs(localY));
          
          const mathMask = fade * lengthFade * Math.max(0.18, coreLum);

          // Separate spatial mask for the enlarged bright center
          const brightInnerLength = 11;
          const brightOuterLength = 32;
          const brightLengthFade = 1 - smoothstep(brightInnerLength, brightOuterLength, Math.abs(localX));
          
          // Parabolic taper for a long, slim, elegant shape that softens at the bottom
          const brightTaper = 1 - (localX / brightOuterLength) * 0.4 - Math.pow(localX / brightOuterLength, 2) * 0.3;
          const brightInnerWidth = Math.max(0.5, 1.8 * brightTaper);
          const brightOuterWidth = Math.max(2, 6.5 * brightTaper);
          const brightFade = 1 - smoothstep(brightInnerWidth, brightOuterWidth, Math.abs(localY));
          
          const brightWave = brightFade * brightLengthFade;

          const baseIntensity = Math.max(coreLum, mathMask, brightWave);

          if (baseIntensity > 0.005) {
            const noise = (stableRandom(cIdx, r) - 0.5) * 0.15;
            const noisyIntensity = Math.max(0, Math.min(1, baseIntensity + noise * baseIntensity));

            const colorIntensity = smoothstep(0, 1, noisyIntensity * 0.85);
            const opacity = Math.max(0, Math.pow(noisyIntensity, 0.45));

            cells.push({
              x: cIdx * CELL + CELL / 2,
              y: r * CELL + CELL / 2,
              intensity: noisyIntensity,
              colorIntensity,
              opacity,
              char: getChar(noisyIntensity),
              color: interpolateColor(colorIntensity, opacity),
            });
          }
        }
      }

      resizeCanvas();

      if (!readyRef.current) {
        readyRef.current = true;
        onReadyRef.current?.();
      }
    };

    const frame = (time: number) => {
      if (disposed) return;

      if (activeRef.current && !document.hidden && cells.length > 0) {
        if (time - lastTick >= TICK_MS) {
          const mutations = Math.max(30, Math.floor(cells.length * (0.05 + Math.random() * 0.04)));
          for (let i = 0; i < mutations; i++) {
            const c = cells[Math.floor(Math.random() * cells.length)];
            
            c.char = getChar(c.intensity);

            if (Math.random() < 0.12) {
              const bumpedIntensity = Math.min(1, c.colorIntensity + 0.18);
              c.color = interpolateColor(bumpedIntensity, c.opacity);
            } else {
              c.color = interpolateColor(c.colorIntensity, c.opacity);
            }
          }
          paint();
          lastTick = time;
        }
      }
      animationFrameId = requestAnimationFrame(frame);
    };

    const startAnimation = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(frame);
    };

    img = new Image();
    img.decoding = "async";
    img.onload = () => {
      buildGrid();
      startAnimation();
    };
    img.src = src;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resizeCanvas);
    });
    ro.observe(viewport);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      if (img) img.onload = null;
    };
  }, [src, fit, focusX, focusY]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
