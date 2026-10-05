import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PillTone = "success" | "warning" | "danger" | "info" | "neutral" | "brand";

const TONE_CLASSES: Record<PillTone, string> = {
  success: "bg-success-bg text-success-text border-success-border",
  warning: "bg-warning-bg text-warning-text border-warning-border",
  danger: "bg-danger-bg text-danger-text border-danger-border",
  info: "bg-info-bg text-info-text border-info-border",
  neutral: "bg-muted text-muted-foreground border-border",
  brand: "bg-brand-tint text-brand border-brand-border",
};

export function StatusPill({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: PillTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold",
        TONE_CLASSES[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
