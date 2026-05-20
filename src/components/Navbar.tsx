"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
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
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden
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
              <span className="text-lg sm:text-xl font-bold tracking-tight flex items-center">
                <span className="text-white">Linux</span>
                <span className="shimmer-text">Zeiro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
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
            <div className="flex items-center gap-2">
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

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors duration-200"
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
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
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed inset-x-0 top-16 z-40 glass-nav border-b border-amber-500/10 md:hidden transition-all duration-300 ease-out ${
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? "text-amber-200 bg-amber-500/10 border border-amber-500/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/[0.06]">
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-sm font-medium rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Buscar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
