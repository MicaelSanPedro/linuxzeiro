"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { PostSummary } from "@/lib/posts";

interface SearchBarProps {
  allPosts: PostSummary[];
  /** If true, the search input is always shown (no collapsed button) */
  alwaysOpen?: boolean;
}

export function SearchBar({ allPosts, alwaysOpen = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(alwaysOpen);
  const [results, setResults] = useState<PostSummary[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allPosts.filter(
      (post) =>
        post.frontmatter.title.toLowerCase().includes(q) ||
        post.frontmatter.excerpt.toLowerCase().includes(q) ||
        post.frontmatter.category.toLowerCase().includes(q) ||
        post.frontmatter.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    setResults(filtered.slice(0, 6));
    setSelectedIndex(-1);
  }, [query, allPosts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        if (alwaysOpen) {
          setQuery("");
        } else {
          setIsOpen(false);
          setQuery("");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [alwaysOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current && !alwaysOpen) {
      inputRef.current.focus();
    }
  }, [isOpen, alwaysOpen]);

  // Auto-focus when alwaysOpen mode (mobile inline)
  useEffect(() => {
    if (alwaysOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [alwaysOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (alwaysOpen) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [alwaysOpen]);

  function handleSelect(slug: string) {
    if (!alwaysOpen) setIsOpen(false);
    setQuery("");
    router.push(`/blog/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    }
  }

  if (!isOpen && !alwaysOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/10 transition-all duration-200 text-sm"
        aria-label="Buscar artigos"
        type="button"
      >
        <Search className="w-4 h-4" />
        <span className="hidden lg:inline">Buscar...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-white/25 font-mono">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Input */}
      <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/[0.05] border border-amber-500/30 shadow-lg shadow-amber-500/10 search-glow">
        <Search className="w-4 h-4 text-amber-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar artigos, tags..."
          className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="p-1 rounded hover:bg-white/10 transition-colors shrink-0"
            type="button"
            aria-label="Limpar"
          >
            <X className="w-3.5 h-3.5 text-white/40" />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-white/25 font-mono shrink-0">
          ESC
        </kbd>
      </div>

      {/* Results dropdown */}
      {results.length > 0 && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[#111]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl shadow-black/50 z-50">
          <div className="p-1 max-h-[60vh] overflow-y-auto">
            {results.map((post, i) => (
              <button
                key={post.slug}
                onClick={() => handleSelect(post.slug)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors duration-100 ${
                  i === selectedIndex
                    ? "bg-amber-500/10"
                    : "hover:bg-white/[0.04] active:bg-white/[0.06]"
                }`}
                type="button"
              >
                <span className="text-amber-400 mt-0.5 shrink-0">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white font-medium truncate">
                    {post.frontmatter.title}
                  </p>
                  <p className="text-xs text-white/30 truncate mt-0.5">
                    {post.frontmatter.category} &middot; {post.frontmatter.readTime} de leitura
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-white/[0.04]">
            <p className="text-[11px] text-white/20">
              {results.length} resultado{results.length !== 1 ? "s" : ""} &middot; <span className="hidden sm:inline">Use setas para navegar &middot; </span>Enter para abrir
            </p>
          </div>
        </div>
      )}

      {/* No results */}
      {query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[#111]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl shadow-black/50 z-50">
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-white/30">
              Nenhum resultado para &quot;{query}&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
