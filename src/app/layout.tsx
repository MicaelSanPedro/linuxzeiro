import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getAllPosts } from "@/lib/posts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08070a",
};

export const metadata: Metadata = {
  title: "LinuxZeiro — Tech blog para devs e entusiastas",
  description:
    "Tutoriais, dicas e guias sobre Linux, Windows, desenvolvimento, segurança e gaming. Com aquele toque de terminal.",
  keywords: [
    "linux",
    "apps",
    "install",
    "flatpak",
    "snap",
    "apt",
    "pacman",
    "guia",
    "aplicativos",
    "software",
    "tech blog",
    "desenvolvimento",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allPosts = getAllPosts();

  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        {/* ─── Layered background ─── */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#15110a_0%,_#0a0908_50%,_#06060a_100%)]" />

          <div className="ambient-orb animate-orb-1 w-[520px] h-[520px] top-[-160px] left-[-120px] bg-amber-500/[0.18]" />
          <div className="ambient-orb animate-orb-2 w-[640px] h-[640px] top-[30%] right-[-200px] bg-orange-500/[0.10]" />
          <div className="ambient-orb animate-orb-3 w-[420px] h-[420px] bottom-[-60px] left-[28%] bg-rose-500/[0.06]" />
          <div className="ambient-orb animate-orb-1 w-[360px] h-[360px] top-[55%] left-[10%] bg-yellow-500/[0.05]" />

          <div className="absolute inset-0 grid-bg" />

          <div className="absolute inset-0 noise-overlay" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[radial-gradient(ellipse_at_top,_rgba(249,189,24,0.10),_transparent_60%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)]" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar allPosts={allPosts} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
