"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "@/lib/nav";

// Only the modules actually built so far are live links — the rest of the
// shell renders per the design system so the full IA reads correctly while
// later modules are built out (design.md §9: module-by-module rollout).
const ENABLED_ROUTES = new Set(["/dashboard", "/pupils", "/admissions", "/parents-and-carers"]);

export function SidebarNav({
  activePath,
  onNavigate,
  showBadges = true,
}: {
  activePath: string;
  onNavigate?: () => void;
  showBadges?: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1 px-3 py-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground first:pt-0">
            {group.label}
          </div>
          {group.items.map((item) => {
            const isActive = item.href === activePath;
            const isEnabled = ENABLED_ROUTES.has(item.href);
            const Icon = item.icon;

            if (!isEnabled) {
              return (
                <div
                  key={item.href}
                  className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-muted-foreground/60"
                  title="Coming soon"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <span className="truncate text-sm">{item.label}</span>
                  </div>
                  {item.restricted ? (
                    <LockKeyhole className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : showBadges && item.badge ? (
                    <span className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-brand-tint font-semibold text-brand"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {showBadges && item.badge ? (
                  <span className="rounded-full border border-info-border bg-info-bg px-1.5 py-0.5 text-[11px] font-medium text-info-text">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
