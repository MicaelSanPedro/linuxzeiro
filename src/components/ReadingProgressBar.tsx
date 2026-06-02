"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-amber-500 origin-left z-[100]"
      style={{
        scaleX,
        boxShadow: "0 0 8px rgba(245, 158, 11, 0.5)"
      }}
    />
  );
}
