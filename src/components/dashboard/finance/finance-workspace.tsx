import {
  ArrowRight,
  Banknote,
  CalendarDays,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type FinanceBalanceItem = {
  invoiceId: string;
  reference: string;
  status: "issued" | "partially_paid" | "overdue" | string;
  total: number | string | null;
  paid: number | string | null;
  outstanding: number | string | null;
};

export type FinanceBalanceReport = {
  items: FinanceBalanceItem[];
  totalOutstanding: number | string | null;
};

export type FinanceWorkspaceData = {
  user: CurrentUser;
  report: FinanceBalanceReport | null;
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

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }
  return 0;
}

function formatCurrency(value: number | string | null | undefined): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(toNumber(value));
}

export function FinanceWorkspace({ user, report, academicYear, today }: FinanceWorkspaceData) {
  const school = user.schools[0];
  const displayName = accountName(user.email);
  const firstName = displayName.split(" ")[0] || "Finance";
  const items = report?.items ?? [];
  const overdueCount = items.filter((item) => item.status === "overdue").length;
  const totalOutstanding = report?.totalOutstanding ?? 0;

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: displayName,
        role: "Finance",
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
      systemStatusLabel="Finance access verified"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">Finance</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · Finance workspace · {formatDate(today)}
            </p>
          </div>
          <StatusPill tone="info" icon={<CalendarDays className="h-3.5 w-3.5" />} className="self-start">
            {academicYear ? `Academic year ${academicYear}` : "Academic year unavailable"}
          </StatusPill>
        </header>

        <section aria-label="Finance overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Outstanding"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{formatCurrency(totalOutstanding)}</span>}
            meta={<span>Across live finance balances</span>}
            accent="bg-brand"
          />
          <KpiCard
            label="Invoice lines"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{items.length}</span>}
            meta={<span>Current balances in scope</span>}
            accent="bg-warning-text"
          />
          <KpiCard
            label="Overdue"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{overdueCount}</span>}
            meta={<span>Invoices past their expected payment date</span>}
            accent="bg-danger-text"
          />
          <KpiCard
            label="Status"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{report ? "Live" : "—"}</span>}
            meta={<span>{report ? "Balance report available" : "No finance report loaded"}</span>}
            accent="bg-success-text"
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
          <SectionCard
            icon={<Banknote className="h-5 w-5" />}
            title="Outstanding invoice balances"
            subtitle="Current school finance balances from the secure report endpoint"
          >
            {!report ? (
              <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
                The finance report could not be loaded. Try again later or contact the school administrator.
              </p>
            ) : items.length === 0 ? (
              <p className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                No active invoice balances are currently available for this school.
              </p>
            ) : (
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div key={item.invoiceId} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/60 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{item.reference}</span>
                        <StatusPill tone={item.status === "overdue" ? "danger" : item.status === "partially_paid" ? "warning" : "neutral"} className="text-[10px]">
                          {item.status}
                        </StatusPill>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Total {formatCurrency(item.total)} · Paid {formatCurrency(item.paid)}
                      </p>
                    </div>
                    <span className="shrink-0 text-right text-sm font-semibold text-foreground">
                      {formatCurrency(item.outstanding)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={<ChartNoAxesCombined className="h-5 w-5" />}
            title="Finance focus"
            subtitle="Operational working assumptions"
          >
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  This workspace is intentionally limited to summary cashflow and balance data for the current school.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Detailed invoice creation, refunds, and payment-processing tasks remain in the protected finance operations layer.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
