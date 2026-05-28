"use client";

import { useEffect, useRef } from "react";

export function MouseOrb() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    /* Create orb element and inject directly into body to avoid
       any stacking context from React tree or parent wrappers */
    const orb = document.createElement("div");
    orb.id = "mouse-orb";
    orb.style.cssText =
      "position:fixed;width:60px;height:60px;border-radius:50%;" +
      "pointer-events:none;z-index:999999;" +
      "transform:translate3d(-200px,-200px,0) translate(-50%,-50%);" +
      "will-change:transform;top:0;left:0;";

    /* Create trail elements */
    const TRAIL_COUNT = 4;
    const trails: HTMLDivElement[] = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const trail = document.createElement("div");
      trail.className = "mouse-orb-trail";
      const size = 48 - i * 7;
      trail.style.cssText =
        "position:fixed;border-radius:50%;pointer-events:none;" +
        `width:${size}px;height:${size}px;z-index:999998;` +
        "transform:translate3d(-200px,-200px,0) translate(-50%,-50%);" +
        "will-change:transform,opacity;top:0;left:0;opacity:0;";
      document.body.appendChild(trail);
      trails.push(trail);
    }

    document.body.appendChild(orb);

    const pos = { x: -200, y: -200 };
    const target = { x: -200, y: -200 };
    const trailPos = Array.from({ length: TRAIL_COUNT }, () => ({
      x: -200,
      y: -200,
    }));
    let rafId = 0;
    let isActive = false;

    const handleMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!isActive) {
        isActive = true;
        orb.style.opacity = "1";
        trails.forEach((t) => {
          t.style.opacity = "0.5";
        });
      }
    };

    const handleLeave = () => {
      isActive = false;
      orb.style.opacity = "0";
      trails.forEach((t) => {
        t.style.opacity = "0";
      });
    };

    const handleEnter = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      pos.x = e.clientX;
      pos.y = e.clientY;
      isActive = true;
      orb.style.opacity = "1";
      trails.forEach((t) => {
        t.style.opacity = "0.5";
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const animate = () => {
      pos.x = lerp(pos.x, target.x, 0.18);
      pos.y = lerp(pos.y, target.y, 0.18);

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const scale = 1 + Math.min(speed * 0.002, 0.15);

      orb.style.transform =
        `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%) scale(${scale})`;

      for (let i = 0; i < TRAIL_COUNT; i++) {
        const prev = i === 0 ? pos : trailPos[i - 1];
        const factor = 0.11 - i * 0.02;
        trailPos[i].x = lerp(trailPos[i].x, prev.x, factor);
        trailPos[i].y = lerp(trailPos[i].y, prev.y, factor);

        const tScale = 1 - i * 0.1;
        const tOpacity = Math.max(0.5 - i * 0.12 + Math.min(speed * 0.002, 0.15), 0.05);
        trails[i].style.transform =
          `translate3d(${trailPos[i].x}px,${trailPos[i].y}px,0) ` +
          `translate(-50%,-50%) scale(${tScale})`;
        if (isActive) {
          trails[i].style.opacity = String(tOpacity);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(rafId);
      orb.remove();
      trails.forEach((t) => t.remove());
    };
  }, []);

  /* Render nothing in React - everything is DOM-injected */
  return null;
}
