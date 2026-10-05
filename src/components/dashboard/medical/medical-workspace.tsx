import {
  Activity,
  CalendarDays,
  HeartPulse,
  ShieldPlus,
  Stethoscope,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type MedicalWorkspaceData = {
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

export function MedicalWorkspace({ user, pupilCount, academicYear, today }: MedicalWorkspaceData) {
  const school = user.schools[0];
  const displayName = accountName(user.email);
  const firstName = displayName.split(" ")[0] || "Medical";

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: displayName,
        role: "Medical staff",
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
      systemStatusLabel="Medical access verified"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">Medical</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · Medical staff workspace · {formatDate(today)}
            </p>
          </div>
          <StatusPill tone="info" icon={<CalendarDays className="h-3.5 w-3.5" />} className="self-start">
            {academicYear ? `Academic year ${academicYear}` : "Academic year unavailable"}
          </StatusPill>
        </header>

        <section aria-label="Medical overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Pupil population"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{pupilCount ?? "—"}</span>}
            meta={<span>Students in the current school roll</span>}
            accent="bg-brand"
          />
          <KpiCard
            label="Medical alerts"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">—</span>}
            meta={<span>Detailed clinical notes are reviewed at pupil level</span>}
            accent="bg-warning-text"
          />
          <KpiCard
            label="Care plans"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">—</span>}
            meta={<span>Healthcare plans remain under secure pupil access</span>}
            accent="bg-danger-text"
          />
          <KpiCard
            label="Status"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">Live</span>}
            meta={<span>Medical access is restricted to permitted staff</span>}
            accent="bg-success-text"
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
          <SectionCard
            icon={<HeartPulse className="h-5 w-5" />}
            title="Clinical record access"
            subtitle="Current medical-team working assumptions"
          >
            <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
              Medical information is held in secure pupil-level records and should only be accessed through the authorised clinical record workflow. This summary intentionally avoids exposing sensitive personal health data in the dashboard overview.
            </p>
          </SectionCard>

          <SectionCard
            icon={<Stethoscope className="h-5 w-5" />}
            title="Operational focus"
            subtitle="Current medical priorities"
          >
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <ShieldPlus className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Review pupil care plans and medication records in the secure school medical record set when those records are authorised for this account.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  The dashboard remains intentionally summary-led and keeps clinical detail behind the permissioned medical workflows.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
