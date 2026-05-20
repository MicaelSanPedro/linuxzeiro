import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  linux: "bg-amber-500/15 text-amber-200 border-amber-400/30 shadow-[0_0_18px_-6px_rgba(249,189,24,0.5)]",
  windows: "bg-sky-500/15 text-sky-200 border-sky-400/30 shadow-[0_0_18px_-6px_rgba(56,189,248,0.5)]",
  dev: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30 shadow-[0_0_18px_-6px_rgba(52,211,153,0.5)]",
  desenvolvimento: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30 shadow-[0_0_18px_-6px_rgba(52,211,153,0.5)]",
  segurança: "bg-rose-500/15 text-rose-200 border-rose-400/30 shadow-[0_0_18px_-6px_rgba(251,113,133,0.5)]",
  hardware: "bg-violet-500/15 text-violet-200 border-violet-400/30 shadow-[0_0_18px_-6px_rgba(167,139,250,0.5)]",
  dicas: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30 shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]",
  jogos: "bg-lime-500/15 text-lime-200 border-lime-400/30 shadow-[0_0_18px_-6px_rgba(163,230,53,0.5)]",
};

function getColorClasses(category: string): string {
  const key = category.toLowerCase();
  if (categoryColors[key]) return categoryColors[key];
  for (const [k, v] of Object.entries(categoryColors)) {
    if (key.includes(k)) return v;
  }
  return categoryColors.linux;
}

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border backdrop-blur-md",
        getColorClasses(category),
        className
      )}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-80" />
      {category}
    </span>
  );
}
