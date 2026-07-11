"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";

type ApproachFlowerSequenceProps = {
  frames: string[];
};

function fillCanvas(ctx: CanvasRenderingContext2D) {
  const canvas = ctx.canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#F6F5F4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const canvas = ctx.canvas;
  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  const ratio = Math.max(canvas.width / imgWidth, canvas.height / imgHeight);
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  fillCanvas(ctx);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, x, y, width, height);
}

export function ApproachFlowerSequence({ frames }: ApproachFlowerSequenceProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const lastDrawnFrameRef = useRef(0);
  const desiredFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const loadedFramesRef = useRef<Set<number>>(new Set());

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.22,
    restDelta: 0.0008,
  });

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || frames.length === 0) return;

    const clampedIndex = Math.max(0, Math.min(frames.length - 1, frameIndex));
    const img = imagesRef.current[clampedIndex];

    if (img?.complete) {
      drawCover(ctx, img);
      lastDrawnFrameRef.current = clampedIndex;
      return;
    }

    const loadedFrames = loadedFramesRef.current;
    let nearestFrame = lastDrawnFrameRef.current;
    let nearestDistance = Number.POSITIVE_INFINITY;

    loadedFrames.forEach((loadedIndex) => {
      const distance = Math.abs(loadedIndex - clampedIndex);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestFrame = loadedIndex;
      }
    });

    const fallbackImg = imagesRef.current[nearestFrame];
    if (fallbackImg?.complete) {
      drawCover(ctx, fallbackImg);
      lastDrawnFrameRef.current = nearestFrame;
      return;
    }

    fillCanvas(ctx);
  }, [frames.length]);

  const scheduleDraw = useCallback((progress: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const easedProgress = Math.max(0, Math.min(1, progress));
      const frameIndex = Math.floor(easedProgress * (frames.length - 1));
      desiredFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    });
  }, [drawFrame, frames.length]);

  useMotionValueEvent(smoothProgress, "change", scheduleDraw);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(window.innerWidth * dpr));
      const height = Math.max(1, Math.round(window.innerHeight * dpr));

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = "100vw";
      canvas.style.height = "100svh";
      const ctx = canvas.getContext("2d");
      if (ctx) fillCanvas(ctx);
      drawFrame(lastDrawnFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawFrame]);

  useEffect(() => {
    if (frames.length === 0) return;

    let active = true;
    const firstImage = new Image();
    firstImage.decoding = "async";
    firstImage.src = frames[0];
    firstImage.onload = () => {
      if (!active) return;
      imagesRef.current[0] = firstImage;
      loadedFramesRef.current.add(0);
      drawFrame(0);
    };

    const remainingFrames = frames.slice(1).map((src, index) => ({ src, index: index + 1 }));
    let cursor = 0;
    const concurrency = 18;

    const loadNext = () => {
      if (!active || cursor >= remainingFrames.length) return;

      const frame = remainingFrames[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.src = frame.src;
      img.onload = async () => {
        if (!active) return;
        try {
          await img.decode();
        } catch {
          // The onload event is enough for drawImage; decode just improves smoothness when available.
        }
        if (!active) return;
        imagesRef.current[frame.index] = img;
        loadedFramesRef.current.add(frame.index);
        if (frame.index === desiredFrameRef.current) {
          drawFrame(frame.index);
        }
        loadNext();
      };
      img.onerror = loadNext;
    };

    for (let i = 0; i < concurrency; i += 1) {
      loadNext();
    }

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      imagesRef.current = [];
      loadedFramesRef.current = new Set();
    };
  }, [drawFrame, frames]);

  if (frames.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative h-[560vh] bg-[#F6F5F4]"
      aria-label="Approach flower growth animation"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.canvas
          ref={canvasRef}
          className="block h-[100svh] w-screen select-none"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
