import {
  AlertTriangle,
  ArrowRight,
  Award,
  Gavel,
  ShieldCheck,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type BehaviourSummary = {
  periodLabel: string;
  totalIncidents: number;
  totalRewards: number;
  activeSanctions: number;
  detentionCount: number;
  totalPoints: number;
  categoryBreakdown: Array<{ category: string; count: number }>;
  recentIncidents: Array<{
    id: string;
    category: string;
    title: string;
    points: number;
    occurredAt: string;
    parentVisible: boolean;
    pupilId: string;
  }>;
};

export type BehaviourWorkspaceData = {
  user: CurrentUser;
  summary: BehaviourSummary | null;
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

function formatCategory(value: string): string {
  return value
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function BehaviourWorkspace({ user, summary, academicYear, today }: BehaviourWorkspaceData) {
  const school = user.schools[0];
  const displayName = accountName(user.email);
  const firstName = displayName.split(" ")[0] || "Behaviour";
  const incidents = summary?.recentIncidents ?? [];
  const categoryBreakdown = summary?.categoryBreakdown ?? [];

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: displayName,
        role: "Pastoral",
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
      systemStatusLabel="Behaviour access verified"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">Behaviour</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · Behaviour & pastoral overview · {formatDate(today)}
            </p>
          </div>
          <StatusPill tone="info" icon={<ShieldCheck className="h-3.5 w-3.5" />} className="self-start">
            {summary ? summary.periodLabel : "No summary loaded"}
          </StatusPill>
        </header>

        <section aria-label="Behaviour overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Incidents"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{summary?.totalIncidents ?? 0}</span>}
            meta={<span>In the last 30 days</span>}
            accent="bg-brand"
          />
          <KpiCard
            label="Rewards"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{summary?.totalRewards ?? 0}</span>}
            meta={<span>Positive interventions logged</span>}
            accent="bg-success-text"
          />
          <KpiCard
            label="Sanctions"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{summary?.activeSanctions ?? 0}</span>}
            meta={<span>Active cases requiring follow-up</span>}
            accent="bg-warning-text"
          />
          <KpiCard
            label="Detentions"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{summary?.detentionCount ?? 0}</span>}
            meta={<span>Scheduled detention actions</span>}
            accent="bg-danger-text"
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
          <SectionCard
            icon={<Gavel className="h-5 w-5" />}
            title="Recent behaviour incidents"
            subtitle="Most recent events in the current behaviour window"
          >
            {!summary ? (
              <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
                The behaviour summary could not be loaded. Try again later or contact the school administrator.
              </p>
            ) : incidents.length === 0 ? (
              <p className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                No behaviour incidents have been recorded in the active review window.
              </p>
            ) : (
              <div className="space-y-2.5">
                {incidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/60 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{incident.title}</span>
                        <StatusPill tone={incident.points < 0 ? "danger" : "success"} className="text-[10px]">
                          {incident.points > 0 ? `+${incident.points}` : incident.points}
                        </StatusPill>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCategory(incident.category)} · {new Date(incident.occurredAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="shrink-0 text-right text-xs text-muted-foreground">
                      {incident.parentVisible ? "Parent-visible" : "Internal only"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={<Award className="h-5 w-5" />}
            title="Behaviour profile"
            subtitle="Current patterns in the school"
          >
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-sm text-muted-foreground">
                  {summary ? `${summary.totalPoints} net points recorded across the latest review window.` : "No behaviour points are currently available."}
                </p>
              </div>
              {categoryBreakdown.length > 0 ? (
                <div className="space-y-2">
                  {categoryBreakdown.map((entry) => (
                    <div key={entry.category} className="flex items-center justify-between rounded-md border border-border bg-muted/50 px-2.5 py-2 text-sm">
                      <span className="text-foreground">{formatCategory(entry.category)}</span>
                      <span className="font-semibold text-brand">{entry.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No category breakdown is available yet.</p>
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          icon={<ArrowRight className="h-5 w-5" />}
          title="Pastoral guidance"
          subtitle="Operational assumptions for this sprint"
        >
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="rounded-lg bg-muted p-3">
              This workspace is intentionally limited to school-level behaviour summaries, recent incidents, and active sanctions.
            </div>
            <div className="rounded-lg bg-muted p-3">
              Sensitive pupil-level details remain behind the protected pupil behaviour and safeguarding workflows.
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
