"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Search as SearchIcon, User, Settings, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { getUsername } from "@/components/WelcomeScreen";
import type { PostSummary } from "@/lib/posts";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categorias", href: "/#categories" },
];

interface NavbarProps {
  allPosts: PostSummary[];
}

export function Navbar({ allPosts }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesInView, setCategoriesInView] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState<PostSummary[]>([]);
  const pathname = usePathname();
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Load username from localStorage
  useEffect(() => {
    setUserName(getUsername());
  }, []);

  // Listen for name changes via custom event
  useEffect(() => {
    const handler = () => setUserName(getUsername());
    window.addEventListener("techmate:username-set", handler);
    return () => window.removeEventListener("techmate:username-set", handler);
  }, []);

  // ── Mobile search filtering ──
  useEffect(() => {
    if (mobileQuery.trim().length < 2) {
      setMobileResults([]);
      return;
    }
    const q = mobileQuery.toLowerCase();
    const filtered = allPosts.filter(
      (post) =>
        post.frontmatter.title.toLowerCase().includes(q) ||
        post.frontmatter.excerpt.toLowerCase().includes(q) ||
        post.frontmatter.category.toLowerCase().includes(q) ||
        post.frontmatter.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    setMobileResults(filtered.slice(0, 5));
  }, [mobileQuery, allPosts]);

  // Auto-focus mobile input when search is activated
  useEffect(() => {
    if (mobileSearchActive && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchActive]);

  // ── Sliding indicator refs ──
  const pillRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback(() => {
    const activeLink = navLinks.find((l) => isActive(l.href));
    if (!activeLink || !indicatorRef.current || !navRef.current) return;

    const el = pillRefs.current.get(activeLink.href);
    if (!el) return;

    const navRect = navRef.current.getBoundingClientRect();
    const pillRect = el.getBoundingClientRect();
    const navPadLeft = parseFloat(getComputedStyle(navRef.current).paddingLeft);

    indicatorRef.current.style.transform = `translateX(${pillRect.left - navRect.left - navPadLeft}px)`;
    indicatorRef.current.style.width = `${pillRect.width}px`;
    indicatorRef.current.style.opacity = "1";
  }, [categoriesInView, pathname]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) updateIndicator();
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
        setMobileSearchActive(false);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchActive(false);
    setMobileQuery("");
  }, [pathname]);

  // Lock body scroll when mobile menu or search results are open
  useEffect(() => {
    if (mobileOpen || (mobileSearchActive && mobileResults.length > 0)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, mobileSearchActive, mobileResults.length]);

  useEffect(() => {
    if (pathname !== "/") {
      setCategoriesInView(false);
      return;
    }
    const section = document.getElementById("categories");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCategoriesInView(entry.isIntersecting),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  const handleCategoriesClick = useCallback(() => {
    setCategoriesInView(true);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/" && !categoriesInView;
    if (href === "/#categories") return pathname === "/" && categoriesInView;
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  }

  function handleMobileSearchSelect(slug: string) {
    setMobileSearchActive(false);
    setMobileQuery("");
  }

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 glass-nav ${scrolled ? "scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <Logo className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" glow />
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight flex items-center">
                <span className="text-white">Tech</span>
                <span className="shimmer-text">Mate</span>
              </span>
            </Link>

            {/* Desktop Navigation (center) */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <div
                ref={navRef}
                className="relative flex items-center gap-1 p-1 rounded-full
                           backdrop-blur-[40px] saturate-[200%] brightness-[105%]
                           bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                           border border-white/[0.14]
                           shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                <span
                  ref={indicatorRef}
                  aria-hidden="true"
                  className="absolute top-1 left-0 h-[calc(100%-8px)] rounded-full
                             bg-gradient-to-b from-amber-500/20 to-amber-500/5
                             backdrop-blur-[40px] saturate-[180%]
                             border border-amber-400/25
                             shadow-[0_4px_20px_-8px_rgba(249,189,24,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]
                             transition-all duration-300 ease-out pointer-events-none opacity-0"
                  style={{ willChange: "transform, width" }}
                />

                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={link.href === "/#categories" ? handleCategoriesClick : undefined}
                      ref={(el) => {
                        if (el) pillRefs.current.set(link.href, el);
                      }}
                      className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                        active
                          ? "text-amber-100"
                          : "text-white/55 hover:text-white"
                      }`}
                    >
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side (desktop only) */}
            <div className="hidden md:flex items-center gap-2">
              {userName && (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                              backdrop-blur-[40px] saturate-[180%] brightness-[105%]
                              bg-gradient-to-b from-white/[0.07] to-white/[0.02]
                              border border-white/[0.10]
                              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <User className="w-3.5 h-3.5 text-amber-400/80" />
                    <span className="text-xs font-medium text-white/70 max-w-[100px] truncate">{userName}</span>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center justify-center w-8 h-8 rounded-xl
                               backdrop-blur-[40px] saturate-[180%] brightness-[105%]
                               bg-gradient-to-b from-white/[0.07] to-white/[0.02]
                               border border-white/[0.10]
                               shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                               hover:border-white/[0.22] active:scale-95
                               transition-all duration-200"
                    aria-label="Configuracoes"
                  >
                    <Settings className="w-3.5 h-3.5 text-white/50 hover:text-white/80 transition-colors" />
                  </Link>
                </div>
              )}

              <SearchBar allPosts={allPosts} />

              <Link
                href="/blog"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full
                           bg-gradient-to-b from-amber-400/90 to-amber-500
                           text-amber-950 text-xs font-semibold
                           shadow-[0_4px_16px_-4px_rgba(249,189,24,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]
                           hover:shadow-[0_8px_24px_-4px_rgba(249,189,24,0.7),inset_0_1px_0_rgba(255,255,255,0.5)]
                           hover:from-amber-300 hover:to-amber-400
                           border border-amber-400/30
                           transition-all"
              >
                Ler artigos
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Bar (search + hamburger) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-bottom-bar">
        <div className="mobile-search-bar flex items-center">
          {/* Search area */}
          <div className="flex-1 flex items-center gap-2 py-2.5 px-3 min-w-0">
            <SearchIcon className="w-[18px] h-[18px] text-white/40 shrink-0" />
            <input
              ref={mobileInputRef}
              type="text"
              value={mobileQuery}
              onChange={(e) => {
                setMobileQuery(e.target.value);
                if (!mobileSearchActive) setMobileSearchActive(true);
              }}
              onFocus={() => setMobileSearchActive(true)}
              placeholder="Find..."
              className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
            />
          </div>

          {/* Divider */}
          <div className="mobile-search-divider shrink-0" aria-hidden />

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-12 h-12 shrink-0"
            aria-label="Abrir menu"
            type="button"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block w-[16px] h-[2px] rounded-full bg-white/80" />
              <span className="block w-[16px] h-[2px] rounded-full bg-white/80" />
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile search results dropdown (rises from bottom) ── */}
      {mobileSearchActive && mobileResults.length > 0 && (
        <div className="md:hidden fixed inset-x-0 bottom-[68px] z-[55] px-3 animate-fade-in">
          <div className="mobile-search-results relative">
            <div className="p-1.5">
              {mobileResults.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  onClick={() => handleMobileSearchSelect(post.slug)}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg
                             text-white/80 hover:bg-white/[0.05] active:bg-white/[0.06]
                             transition-colors"
                >
                  <span className="text-amber-400 mt-0.5 shrink-0">
                    <SearchIcon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">
                      {post.frontmatter.title}
                    </p>
                    <p className="text-xs text-white/30 truncate mt-0.5">
                      {post.frontmatter.category} &middot; {post.frontmatter.readTime} de leitura
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-3.5 py-2 border-t border-white/[0.04]">
              <p className="text-[11px] text-white/20">
                {mobileResults.length} resultado{mobileResults.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No results overlay */}
      {mobileSearchActive && mobileQuery.trim().length >= 2 && mobileResults.length === 0 && (
        <div className="md:hidden fixed inset-x-0 bottom-[68px] z-[55] px-3 animate-fade-in">
          <div className="mobile-search-results">
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-white/30">
                Nenhum resultado para &quot;{mobileQuery}&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Close mobile search results when tapping outside */}
      {mobileSearchActive && (
        <div
          className="md:hidden fixed inset-0 bottom-[68px] z-[54]"
          onClick={() => {
            setMobileSearchActive(false);
            setMobileQuery("");
          }}
          aria-hidden
        />
      )}

      {/* ── Mobile Fullscreen Menu Overlay ── */}
      <div
        className={`mobile-menu-overlay md:hidden ${
          mobileOpen ? "mobile-menu-open" : ""
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-backdrop" />
        <div className="mobile-menu-content">
          <button
            onClick={() => setMobileOpen(false)}
            className="mobile-menu-close"
            aria-label="Fechar menu"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mobile-menu-links">
            {userName && (
              <div className="mobile-menu-user">
                <div className="flex items-center justify-center w-12 h-12 rounded-full
                            bg-gradient-to-b from-amber-400/20 to-amber-500/10 border border-amber-400/20">
                  <User className="w-5 h-5 text-amber-400" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Ola</p>
                  <p className="text-lg font-semibold text-white/90 truncate max-w-[200px]">{userName}</p>
                </div>
              </div>
            )}

            <div className="mobile-menu-nav">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`mobile-menu-link ${active ? "active" : ""}`}
                    style={{ animationDelay: `${index * 80 + 100}ms` }}
                  >
                    <span className="mobile-menu-link-text">{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </Link>
                );
              })}

              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="mobile-menu-link mobile-menu-link-secondary"
                style={{ animationDelay: `${navLinks.length * 80 + 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span className="mobile-menu-link-text">Configuracoes</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </Link>
            </div>

            <div className="mobile-menu-cta" style={{ animationDelay: `${navLinks.length * 80 + 200}ms` }}>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="mobile-menu-cta-btn"
              >
                Ler todos os artigos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
