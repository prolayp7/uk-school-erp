import { GraduationCap } from "lucide-react";

import { SidebarNav } from "@/components/shell/sidebar-nav";

export function SidebarContent({
  activePath,
  academicYear,
  schoolName = "St Jude & St Bede",
  schoolContext = "Church of England Trust",
  systemStatusLabel = "DfE Sync Active",
  showNavigationBadges = true,
  showSystemVersion = true,
  onNavigate,
}: {
  activePath: string;
  academicYear: string;
  schoolName?: string;
  schoolContext?: string;
  systemStatusLabel?: string;
  showNavigationBadges?: boolean;
  showSystemVersion?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 p-5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold leading-none text-brand">
              {schoolName}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{schoolContext}</p>
          </div>
        </div>
        <div className="px-5 pb-2">
          <div className="flex items-center justify-between rounded-lg bg-muted px-2.5 py-1.5">
            <span className="text-xs text-muted-foreground">Academic Session</span>
            <span className="rounded bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand">
              {academicYear}
            </span>
          </div>
        </div>
        <SidebarNav
          activePath={activePath}
          onNavigate={onNavigate}
          showBadges={showNavigationBadges}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between rounded-lg bg-muted p-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success-text" />
            <span className="text-xs text-muted-foreground">{systemStatusLabel}</span>
          </div>
          {showSystemVersion ? (
            <span className="font-mono text-xs text-muted-foreground">v2.8.4</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
