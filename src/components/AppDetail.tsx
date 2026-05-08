"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  Download,
  Info,
  AlertTriangle,
  Globe,
  Minus,
  Square,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { DynamicIcon } from "@/components/DynamicIcon";
import type { App } from "@/data/apps";

interface AppDetailProps {
  app: App | null;
  isOpen: boolean;
  onClose: () => void;
}

function getPackageManagerLabel(key: string): string {
  const labels: Record<string, string> = {
    flatpak: "Flatpak",
    snap: "Snap",
    apt: "APT (Debian/Ubuntu)",
    brew: "Homebrew (macOS/Linux)",
    pacman: "Pacman (Arch Linux)",
  };
  return labels[key] || key;
}

export function AppDetail({ app, isOpen, onClose }: AppDetailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);

  // Lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPosRef.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!app) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70"
          />

          {/* Terminal Window */}
          <div
            className="fixed z-[70] inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:max-w-2xl sm:w-full"
            style={{ maxHeight: "92vh" }}
          >
            <div
              className="flex flex-col rounded-t-2xl sm:rounded-t-lg sm:rounded-b-lg overflow-hidden shadow-2xl shadow-black/50"
              style={{ height: "92vh", maxHeight: "92vh" }}
            >
              {/* ── Terminal Title Bar ── */}
              <div className="shrink-0 bg-[#1a1a1a] border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
                {/* Window buttons */}
                <div className="flex items-center gap-2">
                  {/* Red X - Close */}
                  <button
                    onClick={onClose}
                    className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center group/x"
                    title="Fechar (Esc)"
                  >
                    <Minus
                      className="w-2 h-2 text-[#4a0002] opacity-0 group-hover/x:opacity-100 transition-opacity"
                      style={{ strokeWidth: 4 }}
                    />
                  </button>
                  {/* Yellow - Minimize (decorative) */}
                  <button className="w-3.5 h-3.5 rounded-full bg-[#febc2e] hover:brightness-110 transition-all flex items-center justify-center group/m">
                    <Minus
                      className="w-2 h-2 text-[#995700] opacity-0 group-hover/m:opacity-100 transition-opacity"
                      style={{ strokeWidth: 4 }}
                    />
                  </button>
                  {/* Green - Maximize (decorative) */}
                  <button className="w-3.5 h-3.5 rounded-full bg-[#28c840] hover:brightness-110 transition-all flex items-center justify-center group/g">
                    <Square
                      className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover/g:opacity-100 transition-opacity"
                      style={{ strokeWidth: 4 }}
                    />
                  </button>
                </div>

                {/* Terminal title */}
                <div className="flex-1 text-center">
                  <span className="text-xs font-mono text-white/40 select-none">
                    <span className="text-amber-400/70">micael</span>
                    <span className="text-white/20">@</span>
                    <span className="text-amber-400/70">linuxzeiro</span>
                    <span className="text-white/20">:</span>
                    <span className="text-amber-400">~</span>
                    <span className="text-white/20">$ </span>
                    <span className="text-white/50">{app.name}</span>
                  </span>
                </div>

                {/* Spacer to balance dots */}
                <div className="w-[54px]" />
              </div>

              {/* ── Terminal Body ── */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overscroll-contain bg-[#0d0d0d] p-5 sm:p-6 space-y-5"
                style={{
                  WebkitOverflowScrolling: "touch",
                  minHeight: 0,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                }}
              >
                {/* App info header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${app.iconColor} flex items-center justify-center shadow-lg shrink-0`}
                  >
                    <DynamicIcon
                      name={app.icon}
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-1.5 font-mono">
                      <span className="text-white/30 mr-2">$</span>
                      {app.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded">
                        {app.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-amber-400/70">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {app.rating}/5
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <Download className="w-3 h-3" />
                        {app.downloads}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-l-2 border-amber-500/30 pl-4">
                  <p className="text-[13px] text-white/50 leading-relaxed">
                    <span className="text-amber-400/60 mr-2">//</span>
                    {app.longDescription}
                  </p>
                </div>

                {/* Website link */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-amber-400/60">&gt;</span>
                  <a
                    href={app.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 hover:underline underline-offset-2 transition-colors"
                  >
                    {app.website}
                  </a>
                  <ExternalLink className="w-3 h-3 text-white/20" />
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 pt-3 pb-1">
                    <Globe className="w-3.5 h-3.5 text-amber-400/50" />
                    <span className="text-xs text-amber-400/50 uppercase tracking-widest">
                      Website
                    </span>
                  </div>
                </div>

                {/* Install Commands */}
                <div>
                  <h3 className="text-sm font-semibold text-amber-400/80 mb-4 flex items-center gap-2 font-mono">
                    <span className="text-amber-400">$</span>
                    <span>Instalação</span>
                    <span className="ml-auto text-[10px] text-white/20 normal-case tracking-normal">
                      {Object.keys(app.commands).length} método(s) disponível(is)
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(app.commands).map(([key, cmd]) => (
                      <div key={key}>
                        <p className="text-[11px] text-white/25 mb-1.5 font-mono">
                          <span className="text-white/15"># </span>
                          {getPackageManagerLabel(key)}
                        </p>
                        <CodeBlock command={cmd} label={key} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observations */}
                {app.observations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-amber-400/80 mb-4 flex items-center gap-2 font-mono">
                      <Info className="w-4 h-4 text-amber-400/60" />
                      <span>Observações</span>
                    </h3>
                    <div className="space-y-2.5">
                      {app.observations.map((obs, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/[0.03] border border-amber-500/10"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-400/50 shrink-0 mt-0.5" />
                          <p className="text-[13px] text-white/50 leading-relaxed">
                            {obs}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="pb-4 sm:pb-2">
                  <h3 className="text-sm font-semibold text-amber-400/80 mb-3 flex items-center gap-2 font-mono">
                    <span className="text-white/30">$</span>
                    <span>tags</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-white/30 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Terminal cursor at the bottom */}
                <div className="pt-2 pb-1 flex items-center gap-1">
                  <span className="text-amber-400 text-sm">$</span>
                  <span className="w-2 h-4 bg-amber-400/70 animate-terminal-blink" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
