"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";

type ApproachFlowerSequenceProps = {
  frames: string[];
};

function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const canvas = ctx.canvas;
  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  const ratio = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#F6F5F4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    const fallbackImg = imagesRef.current[lastDrawnFrameRef.current];

    if (img?.complete) {
      drawContain(ctx, img);
      lastDrawnFrameRef.current = clampedIndex;
      return;
    }

    if (fallbackImg?.complete) {
      drawContain(ctx, fallbackImg);
    }
  }, [frames.length]);

  const scheduleDraw = useCallback((progress: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const easedProgress = Math.max(0, Math.min(1, progress));
      const frameIndex = Math.round(easedProgress * (frames.length - 1));
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
      canvas.style.height = "100vh";
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
      drawFrame(0);
    };

    const remainingFrames = frames.slice(1).map((src, index) => ({ src, index: index + 1 }));
    let cursor = 0;
    const concurrency = 8;

    const loadNext = () => {
      if (!active || cursor >= remainingFrames.length) return;

      const frame = remainingFrames[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.src = frame.src;
      img.onload = () => {
        if (!active) return;
        imagesRef.current[frame.index] = img;
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
    };
  }, [drawFrame, frames]);

  if (frames.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative h-[320vh] bg-[#F6F5F4]"
      aria-label="Approach flower growth animation"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.canvas
          ref={canvasRef}
          className="block h-screen w-screen select-none"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  );
}
