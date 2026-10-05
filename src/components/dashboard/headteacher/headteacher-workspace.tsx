import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type AttendanceReport = {
  period: "day" | "week" | "month";
  startsOn: string;
  endsOn: string;
  totalMarks: number;
  byCode: Array<{ code: string; count: number }>;
  persistentAbsenceThreshold: number;
  persistentAbsence: Array<{
    pupilId: string;
    admissionNumber: string;
    name: string;
    present: number;
    total: number;
    attendanceRate: number;
  }>;
};

export type AttendanceCode = {
  code: string;
  description: string;
  markType: string;
  countsAsPresent: boolean;
};

export type HeadteacherWorkspaceData = {
  user: CurrentUser;
  attendanceReport: AttendanceReport | null;
  attendanceCodes: AttendanceCode[];
  pupilCount: number | null;
  yearGroupCount: number | null;
  formCount: number | null;
  subjectCount: number | null;
  academicYear: string | null;
  reportDate: string;
};

function formatDate(value: string, options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }): string {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(
    new Date(`${value}T12:00:00Z`),
  );
}

function displayName(email: string): string {
  return (email.split("@")[0] ?? email)
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatPercent(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export function HeadteacherWorkspace({
  user,
  attendanceReport,
  attendanceCodes,
  pupilCount,
  yearGroupCount,
  formCount,
  subjectCount,
  academicYear,
  reportDate,
}: HeadteacherWorkspaceData) {
  const school = user.schools[0];
  const presentCodes = new Set(
    attendanceCodes.filter((code) => code.countsAsPresent).map((code) => code.code),
  );
  const presentMarks = attendanceReport?.byCode
    .filter(({ code }) => presentCodes.has(code))
    .reduce((total, item) => total + item.count, 0) ?? 0;
  const attendanceRate = attendanceReport?.totalMarks && attendanceCodes.length > 0
    ? (presentMarks / attendanceReport.totalMarks) * 100
    : null;
  const belowThreshold = attendanceReport?.totalMarks
    ? attendanceReport.persistentAbsence.length
    : null;
  const firstName = displayName(user.email).split(" ")[0] || "Headteacher";

  return (
    <AppShell
      activePath="/dashboard"
      user={{ name: displayName(user.email), role: "Headteacher & SLT", initials: firstName.slice(0, 1) }}
      academicYear={academicYear?.replace("/", "–") ?? ""}
      academicTerm=""
      schoolName={school?.name ?? "School workspace"}
      schoolContext={school?.code ?? "No active school"}
      systemStatusLabel="Session verified"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">Headteacher</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · School operations overview · {formatDate(reportDate, { dateStyle: "full" })}
            </p>
          </div>
          <StatusPill tone={attendanceReport ? "info" : "warning"} icon={<CalendarDays className="h-3.5 w-3.5" />} className="self-start">
            {attendanceReport ? `Week of ${formatDate(attendanceReport.startsOn)}` : "Attendance data unavailable"}
          </StatusPill>
        </header>

        <section aria-label="School overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Pupils on roll"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{pupilCount ?? "—"}</span>}
            meta={<span>School pupil records</span>}
          />
          <KpiCard
            label="Attendance, week to date"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{formatPercent(attendanceRate)}</span>}
            meta={
              <span>
                {!attendanceReport?.totalMarks
                  ? "No attendance marks recorded yet"
                  : attendanceCodes.length > 0
                    ? `${presentMarks.toLocaleString("en-GB")} present marks of ${attendanceReport.totalMarks.toLocaleString("en-GB")}`
                    : "Attendance code definitions unavailable"}
              </span>
            }
          />
          <KpiCard
            label="Below 90% this period"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{belowThreshold ?? "—"}</span>}
            meta={<span>{attendanceReport?.totalMarks ? "Based on marks in this reporting week" : "No attendance marks recorded yet"}</span>}
          />
          <KpiCard
            label="Year groups"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{yearGroupCount ?? "—"}</span>}
            meta={<span>{formCount ?? "—"} forms · {subjectCount ?? "—"} subjects</span>}
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <SectionCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Attendance by code"
            subtitle="Recorded marks for the current reporting week"
          >
            {attendanceReport?.totalMarks ? (
              <div className="flex flex-col gap-3 pt-1">
                {attendanceReport.byCode.map(({ code, count }) => {
                  const definition = attendanceCodes.find((item) => item.code === code);
                  const percent = (count / attendanceReport.totalMarks) * 100;
                  return (
                    <div key={code} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_3rem_3.5rem]">
                      <div className="flex min-w-0 items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          <span className="mr-2 inline-flex min-w-7 justify-center rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{code}</span>
                          {definition?.description ?? "Unmapped code"}
                        </span>
                        <span className="text-xs text-muted-foreground">{count.toLocaleString("en-GB")}</span>
                      </div>
                      <div className="col-span-2 h-2 overflow-hidden rounded-full bg-muted sm:col-span-1">
                        <div
                          className={definition?.countsAsPresent ? "h-full rounded-full bg-success-text" : "h-full rounded-full bg-warning-text"}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="hidden text-right font-mono text-xs tabular-nums text-muted-foreground sm:block">{percent.toFixed(1)}%</span>
                    </div>
                  );
                })}
                <p className="border-t border-border pt-3 text-xs text-muted-foreground">
                  {attendanceReport.totalMarks.toLocaleString("en-GB")} marks recorded · Reporting period {formatDate(attendanceReport.startsOn)} to {formatDate(attendanceReport.endsOn)}
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <CircleHelp className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>No attendance marks are available for this reporting week yet.</p>
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Safeguarding overview"
            subtitle="Sensitive case details are role-restricted"
          >
            <div className="flex items-start gap-3 rounded-lg border border-info-border bg-info-bg p-3 text-sm text-info-text">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>Individual safeguarding records are not shown in this workspace. Contact the designated safeguarding lead for case access.</p>
            </div>
          </SectionCard>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-2">
          <SectionCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Academic structure"
            subtitle={academicYear ?? "Current school setup"}
          >
            {yearGroupCount !== null ? (
              <dl className="grid grid-cols-2 gap-4 py-2 sm:grid-cols-4">
                {[
                  ["Year groups", yearGroupCount],
                  ["Forms", formCount ?? 0],
                  ["Subjects", subjectCount ?? 0],
                  ["Pupils", pupilCount ?? 0],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-heading text-2xl font-bold tabular-nums text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">Academic structure could not be loaded.</p>
            )}
          </SectionCard>

          <SectionCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="School records"
            subtitle="Open a module available in this ERP rollout"
          >
            <nav aria-label="School records" className="divide-y divide-border">
              {[
                { href: "/pupils", title: "Pupil records", icon: Users },
                { href: "/admissions", title: "Admissions", icon: GraduationCap },
                { href: "/parents-and-carers", title: "Parents & carers", icon: Users },
              ].map(({ href, title, icon: Icon }) => (
                <Link key={href} href={href} className="group flex items-center justify-between gap-3 py-3 first:pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-brand" />
                    <span className="text-sm font-medium text-foreground">{title}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </nav>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
