"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/FavoritesProvider";
import { openSignInModal } from "@/components/SignInModal";
import { useState } from "react";

interface FavoriteButtonProps {
  slug: string;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ slug, className = "", size = "sm" }: FavoriteButtonProps) {
  const { isFavorite, toggle, isLoggedIn } = useFavorites();
  const [animating, setAnimating] = useState(false);
  const fav = isFavorite(slug);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      openSignInModal();
      return;
    }
    setAnimating(true);
    await toggle(slug);
    setTimeout(() => setAnimating(false), 300);
  };

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center transition-all duration-200 ${
        size === "sm"
          ? "w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
          : "w-9 h-9 rounded-xl"
      } backdrop-blur-[40px] saturate-[180%] ${
        fav
          ? "bg-gradient-to-b from-rose-500/25 to-rose-600/10 border border-rose-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_-4px_rgba(244,63,94,0.3)]"
          : "bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_12px_-4px_rgba(0,0,0,0.4)]"
      } hover:scale-110 active:scale-95 ${className}`}
      title={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={`${iconSize} transition-all duration-200 ${
          fav
            ? "text-rose-400 fill-rose-400"
            : "text-white/60 group-hover:text-white/80"
        } ${animating ? "scale-125" : ""}`}
      />
    </button>
  );
}
