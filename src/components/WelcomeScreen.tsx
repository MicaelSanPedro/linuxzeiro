"use client";

import { useState, useEffect, useCallback } from "react";
import { Logo } from "./Logo";

const STORAGE_KEY = "techmate_welcomed";

export function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    setMounted(true);

    // Check if user has already visited
    const hasVisited = localStorage.getItem(STORAGE_KEY);
    if (hasVisited) return; // Returning user — do nothing

    // New user — show welcome
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const exitTimer = setTimeout(() => setPhase("exit"), 1000);
    const doneTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsVisible(false);
    }, 1600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [isVisible]);

  // Prevent flash on SSR
  if (!mounted) return null;
  if (!isVisible) return null;

  const isExiting = phase === "exit";

  return (
    <div
      className={`welcome-overlay ${phase === "enter" ? "welcome-enter" : "welcome-hold"} ${isExiting ? "welcome-exit" : ""}`}
      aria-hidden="true"
      style={isExiting ? { pointerEvents: "none" } : undefined}
    >
      {/* Letterbox bars */}
      <div className="welcome-letterbox welcome-letterbox--top" />
      <div className="welcome-letterbox welcome-letterbox--bottom" />

      {/* Vignette */}
      <div className="welcome-vignette" />

      {/* Ambient glow behind logo */}
      <div className="welcome-glow" />

      {/* Content */}
      <div className="welcome-content">
        <div className="welcome-logo-wrap">
          <Logo className="w-20 h-20 sm:w-24 sm:h-24" glow variant="amber" />
        </div>

        <div className="welcome-text-group">
          <h1 className="welcome-title">
            <span className="welcome-title--tech">Tech</span>
            <span className="welcome-title--mate shimmer-text">Mate</span>
          </h1>

          <p className="welcome-tagline">
            Bem-vindo ao seu parceiro em tech
          </p>
        </div>

        {/* Decorative line */}
        <div className="welcome-line" />
      </div>

      {/* Subtle particles ring */}
      <div className="welcome-ring" />
      <div className="welcome-ring welcome-ring--outer" />
    </div>
  );
}
