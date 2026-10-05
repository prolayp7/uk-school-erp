import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionCard({
  icon,
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("flex flex-col rounded-xl bg-card p-5 shadow-sm", className)}>
      <div className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {icon ? (
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
              {icon}
            </span>
          ) : null}
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </div>
      <div className={cn("flex flex-1 flex-col", contentClassName)}>{children}</div>
    </section>
  );
}
