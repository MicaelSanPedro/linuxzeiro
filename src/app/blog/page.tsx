import { getAllPosts, getAllCategories } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Search, Layers } from "lucide-react";
import Link from "next/link";

interface BlogPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  const selectedCategory = params.category;
  const filteredPosts = selectedCategory
    ? allPosts.filter(
        (p) => p.frontmatter.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : allPosts;

  return (
    <div className="pt-32 sm:pt-36 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-12 sm:mb-16 max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5 backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/70 font-medium">
              Biblioteca
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight leading-[1.05] text-balance">
            {selectedCategory ? (
              <>
                Categoria:{" "}
                <span className="shimmer-text">{selectedCategory}</span>
              </>
            ) : (
              <>
                Todos os <span className="shimmer-text">artigos</span>
              </>
            )}
          </h1>
          <p className="text-base sm:text-lg text-white/45 text-pretty">
            {selectedCategory
              ? `Mostrando ${filteredPosts.length} artigo${
                  filteredPosts.length === 1 ? "" : "s"
                } na categoria ${selectedCategory}.`
              : `Explore os ${allPosts.length} artigos do blog — filtrados por categoria ou explore a biblioteca completa.`}
          </p>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex flex-wrap gap-2 mb-12 animate-fade-up delay-1">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? "bg-gradient-to-b from-amber-500/25 to-amber-500/10 text-amber-100 border border-amber-400/40 shadow-[0_4px_20px_-8px_rgba(249,189,24,0.5)]"
                : "bg-white/[0.03] text-white/55 border border-white/[0.06] hover:text-white hover:border-white/15 hover:bg-white/[0.05]"
            }`}
          >
            Todos
            <span className="ml-1.5 text-xs opacity-60 font-mono">({allPosts.length})</span>
          </Link>
          {categories.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <Link
                key={cat.name}
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-b from-amber-500/25 to-amber-500/10 text-amber-100 border border-amber-400/40 shadow-[0_4px_20px_-8px_rgba(249,189,24,0.5)]"
                    : "bg-white/[0.03] text-white/55 border border-white/[0.06] hover:text-white hover:border-white/15 hover:bg-white/[0.05]"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-60 font-mono">({cat.count})</span>
              </Link>
            );
          })}
        </div>

        {/* ── Posts Grid ── */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredPosts.map((post, i) => (
              <div
                key={post.slug}
                className={`animate-fade-up delay-${Math.min(i, 6)}`}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-6 rounded-3xl border border-white/[0.06] bg-white/[0.02]">
            <Search className="w-10 h-10 mx-auto text-white/20 mb-4" />
            <p className="text-white/45 text-lg mb-4">Nenhum artigo encontrado.</p>
            <Link
              href="/blog"
              className="btn-secondary inline-flex"
            >
              Ver todos os artigos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
