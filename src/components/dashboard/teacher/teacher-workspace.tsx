import {
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type TeacherClass = {
  id: string;
  code: string;
  academicYearId: string;
  yearGroup: { id: string; code: string; name: string; keyStage: string };
  subject: { id: string; code: string; name: string };
  teacher: {
    id: string;
    staffNumber: string;
    person: { legalFirstName: string; lastName: string };
  };
  _count: { memberships: number; timetableSlots: number };
};

export type TeacherCurriculumPlan = {
  id: string;
  title: string;
  overview: string;
  academicYear: { code: string };
  yearGroup: { code: string; name: string; keyStage: string };
  subject: { code: string; name: string };
  schemes: Array<{ id: string; title: string; summary: string; sequence: number }>;
};

export type TeacherWorkspaceData = {
  user: CurrentUser;
  classes: TeacherClass[] | null;
  curriculumPlans: TeacherCurriculumPlan[] | null;
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

export function TeacherWorkspace({
  user,
  classes,
  curriculumPlans,
  academicYear,
  today,
}: TeacherWorkspaceData) {
  const school = user.schools[0];
  const teacher = classes?.[0]?.teacher.person;
  const displayTeacherName = teacher
    ? `${teacher.legalFirstName} ${teacher.lastName}`.trim()
    : accountName(user.email);
  const firstName = displayTeacherName.split(" ")[0] || "Teacher";
  const assignedClasses = classes ?? [];
  const classMemberships = assignedClasses.reduce(
    (total, item) => total + item._count.memberships,
    0,
  );
  const timetableSlots = assignedClasses.reduce(
    (total, item) => total + item._count.timetableSlots,
    0,
  );
  const yearGroups = new Set(assignedClasses.map((item) => item.yearGroup.code));

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: displayTeacherName,
        role: "Teacher",
        initials: displayTeacherName
          .split(" ")
          .map((part) => part[0]?.toUpperCase() ?? "")
          .slice(0, 2)
          .join(""),
      }}
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
              <span className="font-semibold text-brand">Teacher</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {school?.name ?? "Your school"} · Teaching workspace · {formatDate(today)}
            </p>
          </div>
          <StatusPill tone="info" icon={<CalendarDays className="h-3.5 w-3.5" />} className="self-start">
            {academicYear ? `Academic year ${academicYear}` : "Academic year unavailable"}
          </StatusPill>
        </header>

        <section aria-label="Teaching overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Assigned classes"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{classes?.length ?? "—"}</span>}
            meta={<span>Classes assigned to your account</span>}
          />
          <KpiCard
            label="Class memberships"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{classes ? classMemberships : "—"}</span>}
            meta={<span>Total places across assigned classes</span>}
          />
          <KpiCard
            label="Year groups"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{classes ? yearGroups.size : "—"}</span>}
            meta={<span>Across your teaching groups</span>}
          />
          <KpiCard
            label="Curriculum plans"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{curriculumPlans?.length ?? "—"}</span>}
            meta={<span>For your assigned subjects and year groups</span>}
          />
        </section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <SectionCard
            icon={<Users className="h-5 w-5" />}
            title="Your teaching groups"
            subtitle="Class assignments returned for your account"
            action={classes ? <StatusPill tone="success">{classes.length} assigned</StatusPill> : <StatusPill tone="warning">Data unavailable</StatusPill>}
          >
            {classes === null ? (
              <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
                Assigned classes could not be loaded. Try again later or contact your school administrator.
              </p>
            ) : classes.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">
                No classes are currently assigned to this account.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {classes.map((item) => (
                  <article key={item.id} className="flex flex-col gap-2 py-3 first:pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{item.subject.name}</h3>
                        <StatusPill tone="brand">Year {item.yearGroup.code}</StatusPill>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.code} · {item.yearGroup.keyStage} · {item.subject.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {item._count.memberships} pupils
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {item._count.timetableSlots} timetable slots
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={<CalendarDays className="h-5 w-5" />}
            title="Timetable coverage"
            subtitle="Scheduled slots linked to your assigned classes"
          >
            {classes === null ? (
              <p className="py-2 text-sm text-muted-foreground">Class timetable data could not be loaded.</p>
            ) : timetableSlots > 0 ? (
              <div className="flex items-baseline gap-2 py-2">
                <span className="font-heading text-3xl font-bold tabular-nums text-foreground">{timetableSlots}</span>
                <span className="text-sm text-muted-foreground">assigned timetable slots</span>
              </div>
            ) : (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                No timetable slots are recorded for your assigned classes yet. Individual daily periods are not available in the current workspace API.
              </p>
            )}
          </SectionCard>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-2">
          <SectionCard
            icon={<BookOpenCheck className="h-5 w-5" />}
            title="Curriculum plans"
            subtitle="Plans for your assigned subjects and year groups"
            action={curriculumPlans ? <StatusPill tone="neutral">{curriculumPlans.length} plans</StatusPill> : <StatusPill tone="warning">Data unavailable</StatusPill>}
          >
            {curriculumPlans === null ? (
              <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
                Curriculum plans could not be loaded.
              </p>
            ) : curriculumPlans.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">
                No curriculum plans are currently recorded for your teaching assignments.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {curriculumPlans.slice(0, 8).map((plan) => (
                  <article key={plan.id} className="py-3 first:pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{plan.title}</h3>
                      <span className="text-xs text-muted-foreground">{plan.academicYear.code}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {plan.subject.name} · Year {plan.yearGroup.code} · {plan.schemes.length} schemes
                    </p>
                    {plan.overview ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{plan.overview}</p> : null}
                  </article>
                ))}
                {curriculumPlans.length > 8 ? (
                  <p className="pt-3 text-xs text-muted-foreground">Showing 8 of {curriculumPlans.length} plans.</p>
                ) : null}
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Teaching day"
            subtitle="Class assignments and available tools"
          >
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Your classes are limited to groups assigned to your staff account. Use the school records area to open pupil profiles where permitted.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Homework, marking, classroom behaviour, and daily register actions are not yet connected to this workspace.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
