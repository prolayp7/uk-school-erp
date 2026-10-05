import {
  AlertTriangle,
  CalendarDays,
  ShieldCheck,
  Users,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type SafeguardingCaseSummary = {
  id: string;
  pupilId: string;
  status: "open" | "under_review" | "closed";
  openedAt: string | null;
  closedAt: string | null;
};

export type DslWorkspaceData = {
  user: CurrentUser;
  cases: SafeguardingCaseSummary[] | null;
  academicYear: string | null;
  today: string;
};

const CASE_STATUS_META: Record<
  SafeguardingCaseSummary["status"],
  { label: string; tone: "danger" | "warning" | "success" }
> = {
  open: { label: "Open", tone: "danger" },
  under_review: { label: "Under review", tone: "warning" },
  closed: { label: "Closed", tone: "success" },
};

function formatDate(value: string | null): string {
  if (!value) return "—";

  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parsed);
}

function accountName(email: string): string {
  return (email.split("@")[0] ?? email)
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function DslWorkspace({ user, cases, academicYear, today }: DslWorkspaceData) {
  const school = user.schools[0];
  const displayName = accountName(user.email);
  const firstName = displayName.split(" ")[0] || "DSL";
  const formattedToday = formatDate(today);
  const allCases = cases ?? [];
  const openCases = allCases.filter((item) => item.status === "open").length;
  const underReviewCases = allCases.filter((item) => item.status === "under_review").length;
  const closedCases = allCases.filter((item) => item.status === "closed").length;
  const activeCases = openCases + underReviewCases;

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: displayName,
        role: "Designated Safeguarding Lead",
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
      systemStatusLabel="Safeguarding access verified"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">Safeguarding</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · Designated safeguarding lead workspace · {formattedToday}
            </p>
          </div>
          <StatusPill tone="info" icon={<CalendarDays className="h-3.5 w-3.5" />} className="self-start">
            {academicYear ? `Academic year ${academicYear}` : "Academic year unavailable"}
          </StatusPill>
        </header>

        <section aria-label="Safeguarding overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Open cases"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{cases === null ? "—" : openCases}</span>}
            meta={<span>New safeguarding cases requiring attention</span>}
            accent="bg-danger-text"
          />
          <KpiCard
            label="Under review"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{cases === null ? "—" : underReviewCases}</span>}
            meta={<span>Current casework in progress</span>}
            accent="bg-warning-text"
          />
          <KpiCard
            label="Active casework"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{cases === null ? "—" : activeCases}</span>}
            meta={<span>Open and in-review cases across the school</span>}
            accent="bg-brand"
          />
          <KpiCard
            label="Closed cases"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{cases === null ? "—" : closedCases}</span>}
            meta={<span>Resolved safeguarding records</span>}
            accent="bg-success-text"
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <SectionCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Case list"
            subtitle="Restricted safeguarding records available to this DSL account"
            action={
              cases ? (
                <StatusPill tone="neutral">{allCases.length} records</StatusPill>
              ) : (
                <StatusPill tone="warning">Data unavailable</StatusPill>
              )
            }
          >
            {cases === null ? (
              <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
                Safeguarding case records could not be loaded. Try again later or contact the school administrator.
              </p>
            ) : allCases.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">
                No safeguarding cases are currently assigned to this DSL account.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {allCases.slice(0, 8).map((caseItem) => {
                  const meta = CASE_STATUS_META[caseItem.status];

                  return (
                    <article key={caseItem.id} className="flex flex-col gap-2 py-3 first:pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">Case {caseItem.id.slice(0, 8)}</h3>
                          <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Pupil record {caseItem.pupilId.slice(0, 8)} · Opened {formatDate(caseItem.openedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {caseItem.status === "closed" ? "Closed" : "Active"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {caseItem.closedAt ? `Closed ${formatDate(caseItem.closedAt)}` : "Ongoing review"}
                        </span>
                      </div>
                    </article>
                  );
                })}
                {allCases.length > 8 ? (
                  <p className="pt-3 text-xs text-muted-foreground">Showing 8 of {allCases.length} safeguarding records.</p>
                ) : null}
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Case response guidance"
            subtitle="High-risk information is intentionally kept limited"
          >
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Safeguarding cases are restricted to authorised DSL and deputy DSL access only. Individual detail pages remain accessible only to approved case access grants.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                This workspace surfaces summaries and status levels without exposing confidential case detail to unauthorised roles.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
