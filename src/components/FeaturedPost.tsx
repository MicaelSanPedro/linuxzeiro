"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { PostSummary } from "@/lib/posts";
import { useRef } from "react";

interface FeaturedPostProps {
  post: PostSummary;
  variant?: "hero" | "compact";
}

export function FeaturedPost({ post, variant = "hero" }: FeaturedPostProps) {
  const { slug, frontmatter } = post;
  const hasImage = Boolean(
    frontmatter.coverImage &&
      (frontmatter.coverImage.startsWith("http") || frontmatter.coverImage.startsWith("/"))
  );
  const cardRef = useRef<HTMLElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--x", `${x}%`);
    cardRef.current.style.setProperty("--y", `${y}%`);
  }

  if (variant === "compact") {
    return (
      <Link href={`/blog/${slug}`} className="group block h-full">
        <article
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="spotlight card-shine relative rounded-2xl overflow-hidden border border-white/[0.06]
                     bg-gradient-to-br from-white/[0.04] to-white/[0.01]
                     transition-all duration-500 ease-out h-full flex flex-col
                     active:scale-[0.99]
                     hover:border-amber-400/30 hover:-translate-y-1
                     hover:shadow-[0_24px_60px_-20px_rgba(249,189,24,0.3)]"
        >
          {/* Background image */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            {hasImage ? (
              <Image
                src={frontmatter.coverImage}
                alt={frontmatter.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(249,189,24,0.3),_transparent_60%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/40 to-transparent" />
            <div className="absolute top-3 left-3">
              <CategoryBadge category={frontmatter.category} />
            </div>
          </div>

          <div className="flex-1 flex flex-col p-4 sm:p-5 gap-2.5 sm:gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-white leading-tight tracking-tight line-clamp-2
                           group-hover:text-amber-100 transition-colors">
              {frontmatter.title}
            </h3>
            <p className="text-sm text-white/45 leading-relaxed line-clamp-2 flex-1">
              {frontmatter.excerpt}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-3 text-[11px] text-white/35 font-mono">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {frontmatter.readTime}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 group-hover:text-amber-200 transition-colors">
                Ler
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // ─── Hero variant ───
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="spotlight card-shine relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08]
                   transition-all duration-500 ease-out h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[480px]
                   active:scale-[0.99]
                   hover:border-amber-400/35
                   hover:shadow-[0_40px_100px_-20px_rgba(249,189,24,0.35)]"
      >
        {/* Background image */}
        {hasImage && (
          <Image
            src={frontmatter.coverImage}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-[#06060a]/85 to-[#06060a]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 via-transparent to-rose-900/10 pointer-events-none" />

        {/* Featured tag */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                        bg-amber-500/15 border border-amber-500/30 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-200">
            Destaque
          </span>
        </div>

        <div className="relative p-5 sm:p-8 lg:p-10 flex flex-col justify-end h-full">
          <div className="mb-3 sm:mb-4">
            <CategoryBadge category={frontmatter.category} />
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-[2.25rem] font-extrabold text-white leading-[1.1] mb-3 sm:mb-4 max-w-2xl tracking-tight
                         group-hover:text-amber-50 transition-colors duration-300 text-balance">
            {frontmatter.title}
          </h2>

          <p className="text-sm sm:text-base text-white/55 leading-relaxed mb-5 sm:mb-6 max-w-2xl line-clamp-2 sm:line-clamp-3 text-pretty">
            {frontmatter.excerpt}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-white/45 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{frontmatter.readTime}</span>
              </div>
            </div>

            <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full
                             bg-white/[0.05] border border-white/[0.1] backdrop-blur-md
                             text-sm font-medium text-amber-200 w-full sm:w-auto
                             group-hover:bg-amber-500/15 group-hover:border-amber-400/40 group-hover:text-amber-100
                             transition-all duration-300">
              Ler artigo
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
