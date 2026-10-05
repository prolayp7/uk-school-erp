import {
  Activity,
  CalendarDays,
  GraduationCap,
  HeartPulse,
  Users,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type SencoWorkspaceData = {
  user: CurrentUser;
  pupilCount: number | null;
  academicYear: string | null;
  today: string;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function accountName(email: string): string {
  return (email.split("@")[0] ?? email)
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SencoWorkspace({ user, pupilCount, academicYear, today }: SencoWorkspaceData) {
  const school = user.schools[0];
  const displayName = accountName(user.email);
  const firstName = displayName.split(" ")[0] || "SENCO";

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: displayName,
        role: "SENCO",
        initials: displayName
          .split(" ")
          .map((part) => part[0]?.toUpperCase() ?? "")
          .slice(0, 2)
          .join(""),
      }}
      academicYear={academicYear?.replace("/", "–") ?? ""}
      academicTerm=""
      schoolName={school?.name ?? "School workspace"}
      schoolContext={school?.code ?? "No active school"}
      systemStatusLabel="SEND access verified"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">SEND</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · SENCO workspace · {formatDate(today)}
            </p>
          </div>
          <StatusPill tone="info" icon={<CalendarDays className="h-3.5 w-3.5" />} className="self-start">
            {academicYear ? `Academic year ${academicYear}` : "Academic year unavailable"}
          </StatusPill>
        </header>

        <section aria-label="SEND overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Pupil population"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{pupilCount ?? "—"}</span>}
            meta={<span>Students in the current school roll</span>}
            accent="bg-brand"
          />
          <KpiCard
            label="SEND status"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">—</span>}
            meta={<span>Support profiles require pupil-level review</span>}
            accent="bg-warning-text"
          />
          <KpiCard
            label="Plans due"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">—</span>}
            meta={<span>Target review dates are managed at pupil level</span>}
            accent="bg-danger-text"
          />
          <KpiCard
            label="Support needs"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">—</span>}
            meta={<span>Profiles and interventions are not exposed in this summary</span>}
            accent="bg-success-text"
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <SectionCard
            icon={<HeartPulse className="h-5 w-5" />}
            title="SEND case summary"
            subtitle="Support and inclusion review access for the current school"
            action={<StatusPill tone="neutral">No live SEND list</StatusPill>}
          >
            <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
              The current workspace API exposes pupil totals and school structure, but detailed SEND profiles and support-plan records are not yet returned in a summary endpoint for this dashboard.
            </p>
          </SectionCard>

          <SectionCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Operational focus"
            subtitle="Current support priorities"
          >
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Use the pupil records and SEND review tools to capture support needs, interventions, and review dates as they are made available by the API layer.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                At present, the SENCO workspace remains intentionally conservative and avoids inventing support-plan counts or personalised pupil data.
              </p>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          icon={<Users className="h-5 w-5" />}
          title="School inclusion notes"
          subtitle="Role-specific working assumptions"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Review individual pupil SEND records through the school records system once the formal SEND access endpoint is connected to this workspace.
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Targeted intervention planning, annual review tracking, and provision monitoring are treated as pupil-level tasks outside this high-level dashboard summary.
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
