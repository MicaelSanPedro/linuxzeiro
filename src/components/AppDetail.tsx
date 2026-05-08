"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Star,
  Download,
  Info,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
          {/* Backdrop - sem backdrop-blur no mobile para nao travar scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 sm:backdrop-blur-sm"
          />

          {/* Modal */}
          <div
            className="fixed z-[70] inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:max-w-2xl sm:w-full"
            style={{ maxHeight: "92vh" }}
          >
            <div
              className="flex flex-col rounded-t-3xl sm:rounded-2xl border border-white/10 border-b-0 sm:border-b border-amber-500/10 shadow-2xl shadow-amber-500/10 bg-[#0d0d0d] sm:bg-[#0d0d0d]/95"
              style={{ height: "92vh", maxHeight: "92vh" }}
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header - fixed, nao rola */}
              <div className="p-5 sm:p-6 border-b border-white/[0.06] shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${app.iconColor} flex items-center justify-center shadow-lg shrink-0`}>
                      <DynamicIcon name={app.icon} className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {app.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-md"
                        >
                          {app.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-amber-400">
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
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors shrink-0"
                  >
                    <X className="w-5 h-5 text-white/40 hover:text-white transition-colors" />
                  </button>
                </div>
                <p className="text-sm text-white/50 mt-4 leading-relaxed">
                  {app.longDescription}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <a
                    href={app.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Site oficial
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Scrollable Content - ocupa todo espaco restante */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6"
                style={{
                  WebkitOverflowScrolling: "touch",
                  minHeight: 0,
                }}
              >
                {/* Install Commands */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-amber-400">$</span> Comandos de Instalação
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(app.commands).map(([key, cmd]) => (
                      <div key={key}>
                        <p className="text-xs text-white/30 mb-1.5 font-medium">
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
                    <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-400" />
                      Observações
                    </h3>
                    <div className="space-y-2.5">
                      {app.observations.map((obs, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-400/70 shrink-0 mt-0.5" />
                          <p className="text-sm text-white/60 leading-relaxed">{obs}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="pb-4 sm:pb-2">
                  <h3 className="text-base font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-white/[0.03] text-white/40 border-white/[0.06] rounded-lg"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
