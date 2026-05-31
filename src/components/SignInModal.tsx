"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleGitHubSignIn = async () => {
    setLoading(true);
    await signIn("github", { callbackUrl: window.location.pathname });
  };

  if (!open && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[380px] rounded-2xl overflow-hidden
          transition-all duration-200 ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }
          backdrop-blur-[60px] saturate-[200%] brightness-[105%]
          bg-gradient-to-b from-white/[0.1] to-white/[0.03]
          border border-white/[0.15]
          shadow-[0_32px_80px_-16px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.15)]
          backdrop-filter:blur(60px)`}
      >
        {/* Specular highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
            text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/20 flex items-center justify-center shadow-[0_0_30px_rgba(249,189,24,0.15)]">
              <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Entrar</h2>
            <p className="text-sm text-white/45">
              Faça login para salvar seus favoritos e sincronizar entre dispositivos
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Opções de login</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Login options */}
          <div className="space-y-3">
            {/* GitHub */}
            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl
                bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12]
                hover:border-white/[0.2] hover:from-white/[0.12] hover:to-white/[0.04]
                active:scale-[0.98] transition-all duration-200
                shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_16px_-4px_rgba(0,0,0,0.4)]
                disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                {loading ? "Entrando..." : "Continuar com GitHub"}
              </span>
              {loading && (
                <svg className="w-4 h-4 text-white/50 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </button>

            {/* Email (coming soon) */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl
                bg-white/[0.02] border border-white/[0.06] cursor-not-allowed
                opacity-50 group"
            >
              <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="text-sm font-medium text-white/40">
                Entrar com Email
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider
                bg-amber-500/10 text-amber-400/60 border border-amber-500/15">
                Em breve
              </span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-white/20 mt-6">
            Ao entrar, seus dados são sincronizados com sua conta GitHub
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Global singleton for opening the modal from anywhere ── */

let _openModal: (() => void) | null = null;

export function registerSignInOpener(opener: () => void) {
  _openModal = opener;
}

export function openSignInModal() {
  _openModal?.();
}
