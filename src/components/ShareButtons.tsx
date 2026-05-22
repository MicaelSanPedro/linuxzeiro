"use client";

import { useState, useCallback } from "react";
import {
  Share2,
  Link2,
  Check,
  Twitter,
  MessageCircle,
  Send,
  Linkedin,
} from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Twitter / X",
      icon: <Twitter className="w-4 h-4" />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-sky-500/15 hover:text-sky-300 hover:border-sky-500/30",
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/30",
    },
    {
      label: "Telegram",
      icon: <Send className="w-4 h-4" />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-blue-500/15 hover:text-blue-300 hover:border-blue-500/30",
    },
    {
      label: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-600/15 hover:text-blue-200 hover:border-blue-600/30",
    },
  ];

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const nativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or error — do nothing
      }
    } else {
      setOpen(!open);
    }
  }, [title, url, open]);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        onClick={nativeShare}
        className="inline-flex items-center gap-2 text-xs text-white/45 hover:text-amber-300 transition-colors cursor-pointer group"
        aria-label="Compartilhar"
        type="button"
      >
        <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        <span>Compartilhar</span>
      </button>

      {/* Dropdown — only shown when Web Share API is unavailable */}
      {open && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Share menu */}
          <div className="absolute right-0 top-full mt-2 z-50 animate-fade-in">
            <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-neutral-900/95 border border-white/[0.08] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl min-w-[180px]">
              {/* Copy link */}
              <button
                onClick={copyLink}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-white/70 hover:bg-amber-500/10 hover:text-amber-300 transition-all cursor-pointer"
                type="button"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                {copied ? "Link copiado!" : "Copiar link"}
              </button>

              <div className="h-px bg-white/[0.06] mx-1 my-0.5" />

              {/* Social links */}
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/70 border border-transparent transition-all ${link.color}`}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
