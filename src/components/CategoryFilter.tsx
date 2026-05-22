"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  totalPosts: number;
}

export function CategoryFilter({ categories, totalPosts }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  return (
    <div className="flex gap-2 mb-10 sm:mb-12 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap animate-fade-up delay-1 scrollbar-thin">
      <Link
        href="/blog"
        scroll={false}
        className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
          !selectedCategory
            ? "bg-gradient-to-b from-amber-500/25 to-amber-500/10 text-amber-100 border border-amber-400/40 shadow-[0_4px_20px_-8px_rgba(249,189,24,0.5)]"
            : "bg-white/[0.03] text-white/55 border border-white/[0.06] hover:text-white hover:border-white/15 hover:bg-white/[0.05]"
        }`}
      >
        Todos
        <span className="ml-1.5 text-xs opacity-60 font-mono">
          ({totalPosts})
        </span>
      </Link>
      {categories.map((cat) => {
        const active =
          selectedCategory.toLowerCase() === cat.name.toLowerCase();
        return (
          <Link
            key={cat.name}
            href={`/blog?category=${encodeURIComponent(cat.name)}`}
            scroll={false}
            className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              active
                ? "bg-gradient-to-b from-amber-500/25 to-amber-500/10 text-amber-100 border border-amber-400/40 shadow-[0_4px_20px_-8px_rgba(249,189,24,0.5)]"
                : "bg-white/[0.03] text-white/55 border border-white/[0.06] hover:text-white hover:border-white/15 hover:bg-white/[0.05]"
            }`}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-60 font-mono">
              ({cat.count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}
