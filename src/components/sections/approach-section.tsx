"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleClass } from "@/components/ui/section-title-style";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ApproachSection({ dict }: { dict: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);
  // Touch / reduced-motion: free horizontal swipe.
  // Fine-pointer desktops (any width): pinned vertical scroll → horizontal slide.
  const [nativeCarousel, setNativeCarousel] = useState(false);

  useEffect(() => {
    const sync = () => {
      // Touch-primary only — NOT prefersNativeScroll(): that also matched
      // prefers-reduced-motion, silently swapping the signature pinned scrub
      // for a manual carousel on desktops with Windows animations off. The
      // scrub is 1:1 scroll-driven (position follows the wheel, no autonomous
      // motion), so reduced-motion desktops keep it; phones keep the swipe.
      setNativeCarousel(
        window.matchMedia("(hover: none) and (pointer: coarse)").matches,
      );
    };
    sync();
    const media = window.matchMedia(
      "(hover: none) and (pointer: coarse), (prefers-reduced-motion: reduce)",
    );
    media.addEventListener("change", sync);
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  // Measure how far the deck must travel to reveal the last card.
  useEffect(() => {
    if (nativeCarousel) return;

    const calculateScrollRange = () => {
      if (cardsRef.current && containerRef.current) {
        const range =
          cardsRef.current.scrollWidth - containerRef.current.clientWidth;
        setScrollRange(Math.max(0, range));
      }
    };

    // Measure after layout — images / fonts can widen cards one frame later.
    calculateScrollRange();
    const raf = requestAnimationFrame(calculateScrollRange);

    const resizeObserver = new ResizeObserver(() => calculateScrollRange());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (cardsRef.current) resizeObserver.observe(cardsRef.current);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [dict?.items, nativeCarousel]);

  // Desktop scrub. Hooks stay unconditional (Rules of Hooks); ignored when
  // the native carousel is active.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Direct 1:1 scrub — deck slides WITH vertical scroll. Keyframed so the
  // last card is fully reached at 88% of the pin, then rests before unpin.
  // Array form (not a closure) so when scrollRange updates from 0 → measured,
  // the transform rebuilds and the deck actually moves.
  const x = useTransform(scrollYProgress, [0, 0.88, 1], [0, -scrollRange, -scrollRange]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (nativeCarousel) return;
    setShowLeftBlur(latest > 0.01);
    setShowRightBlur(latest < 0.86);
  });

  useEffect(() => {
    if (!nativeCarousel) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      setShowLeftBlur(scroller.scrollLeft > 8);
      setShowRightBlur(scroller.scrollLeft < max - 8);
    };

    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [nativeCarousel, dict?.items]);

  // Mouse drag-to-scroll for the native carousel: its scrollbar is hidden
  // (a visible bar under the cards read as broken), yet reduced-motion
  // desktops land on this variant too and a mouse has no other way to reach
  // the off-screen cards. Touch keeps native swipe (pointerType guard).
  const dragRef = useRef({ startX: 0, startLeft: 0, dragging: false });
  const onDeckPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (e.pointerType !== "mouse" || !scroller) return;
    if (scroller.scrollWidth <= scroller.clientWidth) return;
    dragRef.current = { startX: e.clientX, startLeft: scroller.scrollLeft, dragging: true };
    scroller.setPointerCapture(e.pointerId);
  };
  const onDeckPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging || !scrollerRef.current) return;
    scrollerRef.current.scrollLeft =
      dragRef.current.startLeft - (e.clientX - dragRef.current.startX);
  };
  const onDeckPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    scrollerRef.current?.releasePointerCapture(e.pointerId);
  };

  if (!dict) return null;

  const cards = (
    <>
      {dict.items?.map((item: any) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="group relative flex flex-col justify-between bg-[#EDEDED]/50 hover:bg-[#E3EAE6]/70 border border-black/[0.02] rounded-2xl pt-8 px-5 xs:px-8 pb-0 md:pt-12 md:px-10 md:pb-0 transition-all duration-500 ease-out w-[calc(100vw-3rem)] sm:w-[375px] md:w-[410px] shrink-0 min-h-[460px] sm:min-h-[500px] md:min-h-[520px] overflow-hidden"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-neutral-900 leading-tight sm:text-2xl">
              {item.title}
            </h3>
            <p className="text-sm font-normal leading-[1.6] tracking-[-0.015em] text-black/50">
              {item.description}
            </p>
          </div>

          {item.image && (
            <div className="relative w-full h-[220px] sm:h-[250px] md:h-[280px] mt-6 flex items-end justify-center pointer-events-none">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 410px, (min-width: 640px) 375px, calc(100vw - 3rem)"
                className="object-contain object-bottom select-none"
                draggable="false"
              />
            </div>
          )}
        </motion.div>
      ))}
    </>
  );

  const blurs = (
    <>
      <div
        className={`absolute left-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-r from-[#F4F8F5] via-[#F4F8F5]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
          showLeftBlur ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maskImage: "linear-gradient(to right, black 25%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, black 25%, transparent)",
        }}
      />
      <div
        className={`absolute right-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-l from-[#F4F8F5] via-[#F4F8F5]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
          showRightBlur ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maskImage: "linear-gradient(to left, black 25%, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black 25%, transparent)",
        }}
      />
    </>
  );

  if (nativeCarousel) {
    return (
      <section className="relative bg-transparent py-12 sm:py-16 md:py-24">
        <div className="site-container-wide w-full">
          <div className="mb-10 h-px w-full bg-black/10" />
          <div className="mb-10 sm:mb-14">
            <AnimatedTitle
              as="h2"
              text={dict.headline}
              className={sectionTitleClass}
              splitBy="word"
            />
          </div>

          <div className="relative">
            {blurs}
            {/* Native horizontal swipe — does not pin the page or fight vertical momentum. */}
            <div
              ref={scrollerRef}
              data-lenis-prevent
              // No visible scrollbar (inline style so the html-level
              // scrollbar theme can't leak back in); mouse users drag the
              // deck instead — see the pointer handlers. select-none because
              // a drag would otherwise smear a text selection across cards.
              className="overflow-x-auto overscroll-x-contain pb-6 select-none cursor-grab active:cursor-grabbing"
              // touchAction: pan-x alone blocked VERTICAL page scroll whenever
              // the touch started on the deck (which fills most of a phone
              // screen) — the page felt stuck at this section. manipulation =
              // pan-x + pan-y + pinch-zoom; the browser picks the dominant axis.
              style={{
                touchAction: "manipulation",
                scrollbarWidth: "none",
              }}
              onPointerDown={onDeckPointerDown}
              onPointerMove={onDeckPointerMove}
              onPointerUp={onDeckPointerEnd}
              onPointerCancel={onDeckPointerEnd}
            >
              <motion.div
                className="flex w-max gap-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {cards}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[280vh] bg-transparent">
      <div className="sticky top-0 h-[100dvh] flex flex-col justify-center overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="site-container-wide w-full" ref={containerRef}>
          <div className="mb-10 h-px w-full bg-black/10" />

          <div className="mb-10 sm:mb-14">
            <AnimatedTitle
              as="h2"
              text={dict.headline}
              className={sectionTitleClass}
              splitBy="word"
            />
          </div>

          <div className="relative overflow-hidden">
            {blurs}

            <div className="pb-6 select-none overflow-hidden">
              <motion.div
                ref={cardsRef}
                style={{ x }}
                className="flex w-max gap-3 will-change-transform"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {cards}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
