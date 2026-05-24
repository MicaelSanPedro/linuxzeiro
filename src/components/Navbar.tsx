"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Search as SearchIcon, User, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { getUsername } from "@/components/WelcomeScreen";
import type { PostSummary } from "@/lib/posts";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categorias", href: "/#categories" },
];

interface NavbarProps {
  allPosts: PostSummary[];
}

export function Navbar({ allPosts }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesInView, setCategoriesInView] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();

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

  // Re-measure on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        updateIndicator();
      }
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
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 glass-nav ${scrolled ? "scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px] gap-2">
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
                {/* ── Sliding active indicator (liquid glass capsule) ── */}
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

            {/* Right side */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* User name badge + settings button */}
              {userName && (
                <div className="hidden sm:flex items-center gap-1">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                              backdrop-blur-[40px] saturate-[180%] brightness-[105%]
                              bg-gradient-to-b from-white/[0.07] to-white/[0.02]
                              border border-white/[0.10]
                              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <User className="w-3.5 h-3.5 text-amber-400/80" />
                    <span className="text-xs font-medium text-white/70 max-w-[100px] truncate">{userName}</span>
                  </div>
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-xl
                               backdrop-blur-[40px] saturate-[180%] brightness-[105%]
                               bg-gradient-to-b from-white/[0.07] to-white/[0.02]
                               border border-white/[0.10]
                               shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                               hover:border-white/[0.22] active:scale-95
                               transition-all duration-200"
                    aria-label="Configurações"
                    type="button"
                  >
                    <Settings className="w-3.5 h-3.5 text-white/50 hover:text-white/80 transition-colors" />
                  </button>
                </div>
              )}

              <div className="hidden md:block">
                <SearchBar allPosts={allPosts} />
              </div>

              {/* CTA — liquid glass sheen */}
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

              {/* Mobile search icon — liquid glass pill */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl
                           backdrop-blur-[40px] saturate-[180%] brightness-[105%]
                           bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                           border border-white/[0.12]
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                           hover:border-white/[0.22] active:scale-95
                           transition-all duration-200"
                aria-label="Buscar"
                type="button"
              >
                <SearchIcon className="w-5 h-5 text-white/80" />
              </button>

              {/* Mobile hamburger — liquid glass pill */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl
                           backdrop-blur-[40px] saturate-[180%] brightness-[105%]
                           bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                           border border-white/[0.12]
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                           hover:border-white/[0.22] active:scale-95
                           transition-all duration-200"
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileOpen}
                type="button"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5 text-white/80" />
                ) : (
                  <Menu className="w-5 h-5 text-white/80" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile inline search */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3 px-1 animate-fade-in">
              <SearchBar allPosts={allPosts} alwaysOpen />
            </div>
          )}
        </div>
      </nav>

      {/* Settings panel — rendered outside nav so position:fixed works correctly */}
      <SettingsPanel
        userName={userName || ""}
        onNameChange={(name) => setUserName(name)}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Mobile fullscreen menu backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Dropdown Menu — liquid glass mobile-menu */}
      <div
        className={`fixed inset-x-0 top-14 z-40 liquid-glass-mobile-menu border-b border-white/[0.08] md:hidden transition-all duration-300 ease-out ${
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-1.5 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* User name in mobile menu */}
          {userName && (
            <div className="flex items-center gap-2 px-4 py-2.5 mb-2 rounded-xl
                        bg-amber-500/[0.08] border border-amber-500/15
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full
                          bg-gradient-to-b from-amber-400/20 to-amber-500/10 border border-amber-400/20">
                <User className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Olá</p>
                <p className="text-sm font-semibold text-white/90 truncate max-w-[180px]">{userName}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? "text-amber-200 backdrop-blur-[40px] bg-amber-500/10 border border-amber-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-white/80 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08]"
                }`}
              >
                {link.label}
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
            );
          })}

          {/* CTA */}
          <div className="pt-3 mt-2 border-t border-white/[0.06]">
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Ler todos os artigos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Settings link in mobile */}
          <div className="pt-2 mt-1">
            <button
              onClick={() => { setMobileOpen(false); setSettingsOpen(true); }}
              className="flex items-center justify-between w-full px-4 py-3.5 text-base font-medium rounded-xl
                         text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent
                         hover:border-white/[0.06] transition-all duration-200"
              type="button"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
