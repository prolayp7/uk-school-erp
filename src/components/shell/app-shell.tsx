"use client";

import { useState, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/shell/sidebar-content";
import { Topbar, type TopbarUser } from "@/components/shell/topbar";

export function AppShell({
  activePath,
  user,
  academicYear = "2025–2026",
  academicTerm = "Autumn Term",
  schoolName = "St Jude & St Bede",
  schoolContext = "Church of England Trust",
  systemStatusLabel = "DfE Sync Active",
  showNavigationBadges = true,
  showSystemVersion = true,
  children,
}: {
  activePath: string;
  user: TopbarUser;
  academicYear?: string;
  academicTerm?: string;
  schoolName?: string;
  schoolContext?: string;
  systemStatusLabel?: string;
  showNavigationBadges?: boolean;
  showSystemVersion?: boolean;
  children: ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card lg:block">
        <SidebarContent
          activePath={activePath}
          academicYear={academicYear}
          schoolName={schoolName}
          schoolContext={schoolContext}
          systemStatusLabel={systemStatusLabel}
          showNavigationBadges={showNavigationBadges}
          showSystemVersion={showSystemVersion}
        />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent
            activePath={activePath}
            academicYear={academicYear}
            schoolName={schoolName}
            schoolContext={schoolContext}
            systemStatusLabel={systemStatusLabel}
            showNavigationBadges={showNavigationBadges}
            showSystemVersion={showSystemVersion}
            onNavigate={() => setMobileNavOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Topbar
        user={user}
        academicYear={academicYear}
        academicTerm={academicTerm}
        onOpenNav={() => setMobileNavOpen(true)}
      />

      <main className="min-h-screen bg-background pt-14 lg:pl-64">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
