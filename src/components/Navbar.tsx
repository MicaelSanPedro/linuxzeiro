"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Search as SearchIcon } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
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
  const pathname = usePathname();

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

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
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
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl overflow-hidden
                              ring-1 ring-amber-400/30
                              shadow-[0_0_24px_-4px_rgba(249,189,24,0.45)]
                              group-hover:shadow-[0_0_32px_-2px_rgba(249,189,24,0.65)]
                              group-hover:ring-amber-400/50
                              transition-all duration-300">
                <Image
                  src="/logo.webp"
                  alt="LinuxZeiro"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight flex items-center">
                <span className="text-white">Linux</span>
                <span className="shimmer-text">Zeiro</span>
              </span>
            </Link>

            {/* Desktop Navigation (center) */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                        active
                          ? "text-amber-100"
                          : "text-white/55 hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/25 to-amber-500/5 border border-amber-400/30 -z-0" />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:block">
                <SearchBar allPosts={allPosts} />
              </div>

              <Link
                href="/blog"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full
                           bg-gradient-to-b from-amber-400/90 to-amber-500
                           text-amber-950 text-xs font-semibold
                           shadow-[0_4px_16px_-4px_rgba(249,189,24,0.5)]
                           hover:shadow-[0_8px_24px_-4px_rgba(249,189,24,0.7)]
                           hover:from-amber-300 hover:to-amber-400
                           transition-all"
              >
                Ler artigos
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile search icon */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors duration-200"
                aria-label="Buscar"
                type="button"
              >
                <SearchIcon className="w-5 h-5 text-white/80" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors duration-200"
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

      {/* Mobile fullscreen menu backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed inset-x-0 top-14 z-40 glass-nav border-b border-amber-500/10 md:hidden transition-all duration-300 ease-out ${
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-1.5 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? "text-amber-200 bg-amber-500/10 border border-amber-500/20"
                    : "text-white/80 hover:text-white hover:bg-white/5 border border-transparent"
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
        </div>
      </div>
    </>
  );
}
