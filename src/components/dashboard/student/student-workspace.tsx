import { BookOpenText, CalendarDays, ClipboardList, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type StudentWorkspaceData = {
  user: CurrentUser;
  academicYear: string | null;
  today: string;
  attendanceRate?: number | null;
  totalMarks?: number | null;
  presentMarks?: number | null;
  yearGroup?: string | null;
  form?: string | null;
  recentAttendance?: Array<{
    attendanceCode: string;
    markedAt: string;
    session: { sessionDate: string; sessionType: string };
    code: { description: string; markType: string };
  }> | null;
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

export function StudentWorkspace({
  user,
  academicYear,
  today,
  attendanceRate,
  totalMarks,
  presentMarks,
  yearGroup,
  form,
  recentAttendance,
}: StudentWorkspaceData) {
  const school = user.schools[0];
  const displayName = accountName(user.email);
  const firstName = displayName.split(" ")[0] || "Student";
  const attendanceDisplay = typeof attendanceRate === "number" ? `${attendanceRate.toFixed(1)}%` : "—";
  const attendanceMeta = totalMarks ? `${presentMarks ?? 0} of ${totalMarks} marks recorded as present` : "Secure attendance record unavailable";

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: displayName,
        role: "Student",
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
      systemStatusLabel="Student portal active"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">Student</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · Student portal · {formatDate(today)}
            </p>
          </div>
          <StatusPill tone="info" icon={<CalendarDays className="h-3.5 w-3.5" />} className="self-start">
            {academicYear ? `Academic year ${academicYear}` : "Academic year unavailable"}
          </StatusPill>
        </header>

        <section aria-label="Student overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Academic year"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{academicYear ? academicYear.replace("/", "–") : "—"}</span>}
            meta={<span>Current school year</span>}
            accent="bg-brand"
          />
          <KpiCard
            label="Attendance"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{attendanceDisplay}</span>}
            meta={<span>{attendanceMeta}</span>}
            accent="bg-warning-text"
          />
          <KpiCard
            label="Homework"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">—</span>}
            meta={<span>Upcoming tasks are managed in the learning workspace</span>}
            accent="bg-info-text"
          />
          <KpiCard
            label="Status"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">Live</span>}
            meta={<span>Your school record is active and protected</span>}
            accent="bg-success-text"
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
          <SectionCard
            icon={<BookOpenText className="h-5 w-5" />}
            title="Learning overview"
            subtitle="Your current student workspace"
          >
            <div className="space-y-3">
              <p className="rounded-lg border border-brand/20 bg-brand-tint px-3 py-2.5 text-sm text-foreground">
                Your school record is limited to your own learning information. Attendance history below shows your most recent marks.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Year group</p>
                  <p className="mt-1 font-medium text-foreground">{yearGroup ?? "Not assigned"}</p>
                </div>
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Form</p>
                  <p className="mt-1 font-medium text-foreground">{form ?? "Not assigned"}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Access notes"
            subtitle="What this area is for"
          >
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Personal records remain restricted to the authorised student and parent/carer workflows that the school enables for your account.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  This dashboard confirms access is active and routes you into the student-facing area without exposing wider staff-only information.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          icon={<ClipboardList className="h-5 w-5" />}
          title="Recent attendance"
          subtitle="Your latest attendance marks"
        >
          {recentAttendance === null || recentAttendance === undefined ? (
            <p className="py-2 text-sm text-muted-foreground">Your attendance record is currently unavailable.</p>
          ) : recentAttendance.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">No attendance marks have been recorded yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentAttendance.slice(0, 10).map((record, index) => (
                <div key={`${record.session.sessionDate}-${record.session.sessionType}-${record.attendanceCode}-${index}`} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{record.code.description}</p>
                    <p className="text-xs text-muted-foreground">{record.session.sessionType} session</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill tone={record.code.markType === "present" || record.code.markType === "late" ? "success" : "warning"}>
                      {record.attendanceCode}
                    </StatusPill>
                    <time className="text-xs tabular-nums text-muted-foreground">
                      {formatDate(record.session.sessionDate.slice(0, 10))}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
