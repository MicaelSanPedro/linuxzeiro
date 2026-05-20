"use client";

import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="seu@email.com"
        className="flex-1 px-4 py-3 rounded-full bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all"
      />
      <button type="submit" className="btn-primary justify-center">
        Inscrever
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
