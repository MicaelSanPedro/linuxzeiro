"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Logo } from "./Logo";
import { Sparkles } from "lucide-react";

const STORAGE_KEY = "techmate_username";

function getStoredName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeName(name: string) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
    window.dispatchEvent(new CustomEvent("techmate:username-set"));
  } catch {
    /* ignore */
  }
}

export function getUsername(): string | null {
  return getStoredName();
}

export function WelcomeScreen() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"enter" | "ask" | "exit">("enter");
  const [isVisible, setIsVisible] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydrate from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = getStoredName();
    if (stored) {
      setIsVisible(true);
      setUserName(stored);
      setIsReturning(true);
    } else {
      setIsVisible(true);
      setIsReturning(false);
    }
  }, []);

  // Progress bar logic — simulates loading, completes when site is ready
  useEffect(() => {
    if (!mounted || !isVisible || phase !== "enter") return;

    let rafId: number;
    let start: number | null = null;
    const duration = 3000; // base duration in ms
    const target = 85; // slow crawl up to 85%

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out curve for natural feel
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * target));

      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    // When site is fully loaded, complete the bar and exit
    const complete = () => {
      cancelAnimationFrame(rafId);
      setProgress(100);
      // Wait for bar to visually fill, then exit
      setTimeout(() => setPhase("exit"), 400);
    };

    // If site already loaded
    if (document.readyState === "complete") {
      const timer = setTimeout(complete, 800);
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(rafId);
      };
    }

    // Listen for load event
    window.addEventListener("load", complete);
    return () => {
      window.removeEventListener("load", complete);
      cancelAnimationFrame(rafId);
    };
  }, [mounted, isVisible, phase]);

  // Phase transitions (non-enter phases)
  useEffect(() => {
    if (!mounted || !isVisible || phase !== "ask") return;

    const handle = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(handle);
  }, [phase, mounted, isVisible]);

  useEffect(() => {
    if (!mounted || !isVisible || phase !== "exit") return;

    const doneTimer = setTimeout(() => setIsVisible(false), 900);
    return () => clearTimeout(doneTimer);
  }, [phase, mounted, isVisible]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    storeName(trimmed);
    setUserName(trimmed);
    setIsReturning(true);
    setPhase("exit");
  }, [nameInput]);

  // Prevent flash on SSR
  if (!mounted) return null;
  if (!isVisible) return null;

  const isExiting = phase === "exit";
  const showSplash = phase === "enter";
  const showAsk = phase === "ask";
  const showProgress = phase === "enter";

  return (
    <div
      className={`welcome-overlay ${showSplash ? "welcome-enter" : "welcome-hold"} ${isExiting ? "welcome-exit" : ""}`}
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
        {/* Logo */}
        <div className="welcome-logo-wrap">
          <Logo className="w-20 h-20 sm:w-24 sm:h-24" glow variant="amber" />
        </div>

        {/* ── New user splash ── */}
        {showSplash && !isReturning && (
          <div className="welcome-text-group">
            <h1 className="welcome-title">
              <span className="welcome-title--tech">Tech</span>
              <span className="welcome-title--mate shimmer-text">Mate</span>
            </h1>
            <p className="welcome-tagline">Bem-vindo ao seu parceiro em tech</p>
          </div>
        )}

        {/* ── Returning user ── */}
        {showSplash && isReturning && (
          <div className="welcome-text-group">
            <h1 className="welcome-title">
              <span className="welcome-title--tech">Bem-vindo de volta, </span>
              <span className="welcome-title--mate welcome-name-shine">{userName}</span>
              <span className="welcome-title--tech">!</span>
            </h1>
            <p className="welcome-tagline">Bom te ver por aqui</p>
          </div>
        )}

        {/* ── Ask name phase ── */}
        {showAsk && (
          <div className="welcome-name-section">
            <h2 className="welcome-name-heading">
              <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
              Qual é o seu nome?
            </h2>
            <form onSubmit={handleSubmit} className="welcome-name-form">
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome..."
                maxLength={24}
                className="welcome-name-input"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="welcome-name-btn"
              >
                Entrar
              </button>
            </form>
          </div>
        )}

        {/* Decorative line */}
        <div className="welcome-line" />

        {/* ── Progress bar ── */}
        {showProgress && (
          <div className="welcome-progress-wrap">
            <div className="welcome-progress-track">
              <div
                className="welcome-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Subtle particles ring */}
      <div className="welcome-ring" />
      <div className="welcome-ring welcome-ring--outer" />
    </div>
  );
}
