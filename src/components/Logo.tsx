/**
 * TechMate Logo
 * Monograma TM dentro de quadrado arredondado, gradient dourado, vibe terminal.
 */
interface LogoProps {
  className?: string;
  glow?: boolean;
  variant?: "amber" | "dark";
}

export function Logo({ className = "w-10 h-10", glow = false, variant = "amber" }: LogoProps) {
  const gradId = "tm-grad";
  const strokeId = "tm-stroke";

  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TechMate"
      role="img"
      style={
        glow
          ? { filter: "drop-shadow(0 0 12px rgba(249, 189, 24, 0.45))" }
          : undefined
      }
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {variant === "amber" ? (
            <>
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="45%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#cb8c0a" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#1a1206" />
              <stop offset="100%" stopColor="#0a0908" />
            </>
          )}
        </linearGradient>
        <linearGradient id={strokeId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1206" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3a2810" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill={`url(#${gradId})`} />

      <rect x="3" y="3" width="58" height="20" rx="13" ry="13" fill="white" opacity="0.15" />

      {/* T */}
      <rect x="14" y="18" width="22" height="5" rx="1.5" fill={`url(#${strokeId})`} />
      <rect x="22" y="18" width="6" height="28" rx="1.5" fill={`url(#${strokeId})`} />

      {/* M */}
      <rect x="36" y="18" width="5" height="28" rx="1.5" fill={`url(#${strokeId})`} />
      <rect x="46" y="18" width="5" height="28" rx="1.5" fill={`url(#${strokeId})`} />
      <path d="M 41 18 L 43.5 26 L 46 18 Z" fill={`url(#${strokeId})`} />

      {/* Cursor block */}
      <rect x="14" y="48" width="4" height="4" rx="0.5" fill={`url(#${strokeId})`} />
    </svg>
  );
}
