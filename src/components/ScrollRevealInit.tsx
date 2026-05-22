"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Elements inside .prose-custom that should get scroll-reveal.
 */
const PROSE_REVEAL_SELECTOR = [
  ".prose-custom h2",
  ".prose-custom h3",
  ".prose-custom h4",
  ".prose-custom > p",
  ".prose-custom > ul",
  ".prose-custom > ol",
  ".prose-custom > blockquote",
  ".prose-custom > pre",
  ".prose-custom > img",
  ".prose-custom > hr",
  ".prose-custom > table",
].join(", ");

export function ScrollRevealInit() {
  const pathname = usePathname();
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const initReveal = useCallback(() => {
    // Clean up previous observer
    observerRef.current?.disconnect();
    observerRef.current = null;

    const manualElements = document.querySelectorAll<HTMLElement>(
      "[data-scroll-reveal]"
    );
    const proseElements = document.querySelectorAll<HTMLElement>(
      PROSE_REVEAL_SELECTOR
    );
    const allElements = [...manualElements, ...proseElements];

    if (allElements.length === 0) return;

    let index = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;

            if (el.classList.contains("revealed")) {
              observer.unobserve(entry.target);
              return;
            }

            const explicitDelay = el.getAttribute("data-scroll-delay");
            const ms = explicitDelay ? parseInt(explicitDelay, 10) : 0;
            const stagger = !explicitDelay && el.closest(".prose-custom") ? index * 60 : 0;
            index++;

            const apply = () => {
              el.classList.add("revealed");
            };

            if (ms > 0) {
              setTimeout(apply, ms);
            } else if (stagger > 0) {
              setTimeout(apply, Math.min(stagger, 300));
            } else {
              apply();
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );

    allElements.forEach((el) => observer.observe(el));
    observerRef.current = observer;
  }, []);

  useEffect(() => {
    const timer = setTimeout(initReveal, 100);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [pathname, initReveal]);

  // Re-init when URL search params change (category filter)
  useEffect(() => {
    const handlePopState = () => {
      setTimeout(initReveal, 150);
    };

    // MutationObserver to detect DOM changes from Next.js navigation
    const mainContent = document.querySelector("main") || document.body;
    const mutationObserver = new MutationObserver(() => {
      const hasUnrevealed = document.querySelector("[data-scroll-reveal]:not(.revealed)");
      if (hasUnrevealed) {
        // Small delay to let React finish rendering
        setTimeout(initReveal, 50);
      }
    });

    mutationObserver.observe(mainContent, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      mutationObserver.disconnect();
    };
  }, [initReveal]);

  return null;
}
