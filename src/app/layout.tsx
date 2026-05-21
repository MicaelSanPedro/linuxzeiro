import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
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
  title: "TechMate — Seu parceiro em tech",
  description:
    "Tutoriais, dicas e guias sobre Linux, Windows, desenvolvimento, segurança e gaming. Conteúdo honesto e prático, sem fluff.",
  keywords: [
    "tech",
    "tecnologia",
    "tutoriais",
    "linux",
    "windows",
    "desenvolvimento",
    "programação",
    "gaming",
    "segurança",
    "hardware",
    "open source",
    "tech blog brasil",
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
        <div className="site-backdrop" aria-hidden>
          {/* Grid background */}
          <div className="grid-bg" />

          {/* Ambient blurred orbs */}
          <div className="ambient-orb animate-orb-1 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] bg-amber-500/[0.15] -top-[150px] -left-[100px] sm:-top-[200px] sm:-left-[150px]" />
          <div className="ambient-orb animate-orb-2 w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] bg-rose-500/[0.10] top-[45%] -right-[120px] sm:-right-[180px]" />
          <div className="ambient-orb animate-orb-3 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-sky-500/[0.08] -bottom-[100px] left-[25%] sm:left-[30%]" />
          <div className="ambient-orb animate-orb-1 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-emerald-500/[0.06] top-[20%] right-[15%]" />

          {/* Noise overlay */}
          <div className="noise-overlay" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar allPosts={allPosts} />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
