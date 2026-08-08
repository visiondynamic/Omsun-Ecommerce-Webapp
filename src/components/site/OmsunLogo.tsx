import { useId } from "react";
import { cn } from "@/lib/utils";

type OmsunLogoProps = {
  className?: string;
  compact?: boolean;
  watermark?: boolean;
};

export function OmsunLogo({ className, compact = false, watermark = false }: OmsunLogoProps) {
  const gradientId = useId();

  if (watermark) {
    return (
      <svg
        viewBox="0 0 420 420"
        aria-hidden="true"
        className={cn("pointer-events-none select-none", className)}
      >
        <defs>
          <linearGradient id={gradientId} x1="80" y1="72" x2="340" y2="348">
            <stop offset="0%" stopColor="#d11421" />
            <stop offset="100%" stopColor="#3f3f44" />
          </linearGradient>
        </defs>
        <path
          d="M85 169c11-60 58-100 124-100 61 0 113 36 133 91"
          fill="none"
          stroke="url(#${gradientId})"
          strokeLinecap="round"
          strokeWidth="18"
          opacity="0.12"
        />
        <path
          d="M86 257c21 58 71 97 137 97 61 0 115-33 142-85"
          fill="none"
          stroke="url(#${gradientId})"
          strokeLinecap="round"
          strokeWidth="18"
          opacity="0.12"
        />
        <text
          x="50%"
          y="205"
          textAnchor="middle"
          fill="#b51218"
          fontSize="84"
          fontWeight="800"
          letterSpacing="0.04em"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          OMSUN
        </text>
        <text
          x="50%"
          y="252"
          textAnchor="middle"
          fill="#515156"
          fontSize="28"
          fontWeight="600"
          letterSpacing="0.42em"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          NEPAL PRIVATE LIMITED
        </text>
      </svg>
    );
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      {compact ? (
        <div
          className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-border/70 bg-white shadow-[0_14px_34px_-18px_rgba(120,0,0,0.55)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" className="size-full p-1.5" fill="none">
            <defs>
                <linearGradient id={gradientId} x1="16" y1="18" x2="84" y2="82">
                  <stop offset="0%" stopColor="#3BB273" />
                  <stop offset="100%" stopColor="#2F80ED" />
                </linearGradient>
            </defs>
            <path
              d="M18 53C20 31 36 16 56 16c17 0 31 10 37 25"
              stroke={`url(#${gradientId})`}
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <path
              d="M17 57c4 17 17 29 34 34 18 5 37 1 50-10"
              stroke="#4b4b4f"
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <path
              d="M25 44c6-15 18-23 34-24"
              stroke="#ffffff"
              strokeWidth="3.6"
              strokeLinecap="round"
              opacity="0.95"
            />
            <path
              d="M73 74c-8 4-17 5-25 3"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        </div>
      ) : (
        <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/85 px-3 py-2 shadow-[0_14px_34px_-18px_rgba(120,0,0,0.25)] backdrop-blur">
          <div
            className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-border/70 bg-white"
            aria-hidden="true"
          >
            <svg viewBox="0 0 100 100" className="size-full p-1.5" fill="none">
              <defs>
                <linearGradient id={gradientId} x1="16" y1="18" x2="84" y2="82">
                  <stop offset="0%" stopColor="#d11421" />
                  <stop offset="100%" stopColor="#a60f1a" />
                </linearGradient>
              </defs>
              <path
                d="M18 53C20 31 36 16 56 16c17 0 31 10 37 25"
                stroke={`url(#${gradientId})`}
                strokeWidth="4.8"
                strokeLinecap="round"
              />
              <path
                d="M17 57c4 17 17 29 34 34 18 5 37 1 50-10"
                stroke="#4b4b4f"
                strokeWidth="4.8"
                strokeLinecap="round"
              />
              <path
                d="M25 44c6-15 18-23 34-24"
                stroke="#ffffff"
                strokeWidth="3.6"
                strokeLinecap="round"
                opacity="0.95"
              />
              <path
                d="M73 74c-8 4-17 5-25 3"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </div>

          <div className="min-w-0 leading-none">
            <div className="truncate font-display text-[1.05rem] font-extrabold tracking-[-0.04em] text-foreground">
              OMSUN
            </div>
            <div className="mt-1 truncate text-[0.64rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Nepal Private Limited
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
