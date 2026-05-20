import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  User,
  Share2,
} from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };

  return {
    title: `${post.frontmatter.title} — LinuxZeiro`,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: post.frontmatter.coverImage ? [post.frontmatter.coverImage] : [],
      type: "article",
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? "s" : ""}`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? "es" : ""}`;
  return `Há ${Math.floor(diffDays / 365)} ano${Math.floor(diffDays / 365) > 1 ? "s" : ""}`;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const { frontmatter, contentHtml } = post;
  const hasCover = frontmatter.coverImage?.startsWith("http");

  // Related posts (same category, excluding current)
  const allPosts = getAllPosts();
  const related = allPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        p.frontmatter.category.toLowerCase() === frontmatter.category.toLowerCase()
    )
    .slice(0, 3);

  return (
    <div className="pt-28 pb-24 px-4">
      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-amber-300 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar ao Blog
        </Link>

        {/* Post header */}
        <header className="mb-12 animate-fade-up">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <CategoryBadge category={frontmatter.category} />
            <span className="text-xs text-white/20">·</span>
            <span className="text-xs text-white/45 font-mono">
              {getRelativeDate(frontmatter.date)}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.05] mb-7 tracking-tight text-balance">
            {frontmatter.title}
          </h1>

          <p className="text-lg sm:text-xl text-white/55 leading-relaxed mb-9 text-pretty">
            {frontmatter.excerpt}
          </p>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/40 to-amber-600/30 ring-1 ring-amber-400/30 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-amber-200" />
                </div>
                <span className="font-medium text-white/75">LinuxZeiro</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={frontmatter.date}>
                  {formatDate(frontmatter.date)}
                </time>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{frontmatter.readTime}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/45">
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar</span>
            </div>
          </div>

          {/* Tags */}
          {frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono text-amber-300/70 bg-amber-500/[0.06] border border-amber-500/15 hover:bg-amber-500/10 hover:text-amber-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover image */}
        {hasCover && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-white/[0.06] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] animate-fade-up delay-1">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-amber-500/30 via-amber-500/10 to-transparent mb-12" />

        {/* Post content */}
        <div
          className="prose-custom animate-fade-in"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* End-of-article callout */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/[0.06] to-transparent">
          <p className="text-sm text-amber-200/80 font-semibold mb-1 tracking-wide uppercase">
            Curtiu?
          </p>
          <p className="text-white/65 text-sm mb-5">
            Compartilhe com outros devs ou explore mais artigos sobre {frontmatter.category}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/blog?category=${encodeURIComponent(frontmatter.category)}`}
              className="btn-primary"
            >
              Mais sobre {frontmatter.category}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/blog" className="btn-secondary">
              Todos os artigos
            </Link>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Ver todos os artigos
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto mt-24">
          <div className="mb-10 sm:mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-gradient-to-r from-amber-400 to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80 font-medium">
                Relacionados
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Continue lendo
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
