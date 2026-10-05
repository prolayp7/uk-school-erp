import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  badge,
  value,
  meta,
  footer,
  tone = "default",
  accent,
  className,
}: {
  label: string;
  badge?: ReactNode;
  value: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  tone?: "default" | "brand";
  /** Optional left accent bar color, e.g. "bg-warning-text" */
  accent?: string;
  className?: string;
}) {
  const isBrand = tone === "brand";

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md",
        isBrand ? "bg-brand text-white" : "bg-card",
        className
      )}
    >
      {accent ? <div className={cn("absolute inset-y-0 left-0 w-1", accent)} /> : null}
      {isBrand ? (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-hover opacity-40" />
      ) : null}

      <div className="relative flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            isBrand ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        {badge}
      </div>

      <div className="relative mt-2">{value}</div>

      {meta ? (
        <div
          className={cn(
            "relative mt-2 flex items-center justify-between gap-2 text-sm",
            isBrand ? "text-white/85" : "text-muted-foreground"
          )}
        >
          {meta}
        </div>
      ) : null}

      {footer ? (
        <div
          className={cn(
            "relative mt-2 flex items-center justify-between gap-2 pt-2 text-sm",
            isBrand ? "text-white/85" : "text-muted-foreground"
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
