"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CalendarDays, ClipboardCheck, Users } from "lucide-react";

import {
  createAttendanceSession,
  saveAttendanceMarks,
  type AttendanceActionState,
} from "@/app/(erp)/attendance/actions";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import type { CurrentUser } from "@/lib/session";

export type AttendanceClassGroup = {
  id: string;
  code: string;
  yearGroup: { code: string; name: string };
  subject: { code: string; name: string };
};

export type AttendanceCode = {
  code: string;
  description: string;
  markType: string;
  countsAsPresent: boolean;
};

export type AttendanceSession = {
  id: string;
  sessionDate: string;
  sessionType: string;
  classGroupId: string | null;
  lessonPeriod: string | null;
  _count: { records: number };
};

export type AttendanceRegister = {
  session: {
    id: string;
    sessionDate: string;
    sessionType: string;
    classGroupId: string | null;
    lessonPeriod: string | null;
  };
  items: Array<{
    pupilId: string;
    admissionNumber: string;
    name: string;
    attendanceCode: string | null;
    reason: string | null;
    authorizationStatus: string | null;
  }>;
};

const initialState: AttendanceActionState = { status: "idle", message: "" };

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "UTC" })
    .format(new Date(`${value.slice(0, 10)}T12:00:00Z`));
}

function accountName(email: string): string {
  return (email.split("@")[0] ?? email)
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ActionMessage({ state }: { state: AttendanceActionState }) {
  if (!state.message) return null;
  return (
    <p className={`text-sm ${state.status === "error" ? "text-destructive" : "text-success-text"}`} role={state.status === "error" ? "alert" : "status"}>
      {state.message}
    </p>
  );
}

function CreateSessionForm({
  classes,
  reportDate,
  teacherOnly,
}: {
  classes: AttendanceClassGroup[] | null;
  reportDate: string;
  teacherOnly: boolean;
}) {
  const [state, action, pending] = useActionState(createAttendanceSession, initialState);

  return (
    <form action={action} className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.2fr_0.8fr_0.8fr_auto] xl:items-end">
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Session date
        <input className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground" type="date" name="sessionDate" defaultValue={reportDate} required />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Session type
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground" name="sessionType" defaultValue={teacherOnly ? "lesson" : "morning"}>
          {teacherOnly ? <option value="lesson">Lesson</option> : <>
            <option value="morning">Morning registration</option>
            <option value="afternoon">Afternoon registration</option>
            <option value="lesson">Lesson</option>
          </>}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Class group
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground" name="classGroupId" defaultValue="">
          <option value="">{teacherOnly ? "Select an assigned class" : "School-wide registration"}</option>
          {(classes ?? []).map((classGroup) => (
            <option key={classGroup.id} value={classGroup.id}>
              {classGroup.code} · {classGroup.subject.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Lesson period
        <input className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground" type="text" name="lessonPeriod" maxLength={32} placeholder="e.g. P1" />
      </label>
      <button className="h-10 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending || (teacherOnly && (!classes || classes.length === 0))}>
        {pending ? "Opening…" : "Open register"}
      </button>
      <div className="md:col-span-2 xl:col-span-5">
        {classes === null ? <p className="text-sm text-warning-text">{teacherOnly ? "Assigned class groups are unavailable; a lesson register cannot be opened." : "Class groups are unavailable. School-wide registration may still be available to your role."}</p> : null}
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

function RegisterForm({ register, codes }: { register: AttendanceRegister; codes: AttendanceCode[] }) {
  const [state, action, pending] = useActionState(saveAttendanceMarks, initialState);
  const defaultPresentCode = codes.find((code) => code.markType === "present")?.code ?? "";

  return (
    <form action={action}>
      <input type="hidden" name="sessionId" value={register.session.id} />
      <div className="divide-y divide-border">
        {register.items.map((pupil) => (
          <div key={pupil.pupilId} className="grid gap-2 py-3 first:pt-1 sm:grid-cols-[minmax(0,1fr)_minmax(190px,0.8fr)_minmax(160px,0.8fr)] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{pupil.name}</p>
              <p className="text-xs text-muted-foreground">{pupil.admissionNumber}</p>
            </div>
            <label className="grid gap-1 text-xs font-medium text-muted-foreground">
              Mark
              <select className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" name={`mark_${pupil.pupilId}`} defaultValue={pupil.attendanceCode ?? defaultPresentCode} required>
                <option value="" disabled>Select a mark</option>
                {codes.map((code) => (
                  <option key={code.code} value={code.code}>{code.code} · {code.description}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-xs font-medium text-muted-foreground">
              Absence reason
              <input className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" type="text" name={`reason_${pupil.pupilId}`} maxLength={200} defaultValue={pupil.reason ?? ""} placeholder="Optional" />
            </label>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <ActionMessage state={state} />
        <button className="h-10 shrink-0 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending || register.items.length === 0 || codes.length === 0}>
          {pending ? "Saving marks…" : "Save attendance"}
        </button>
      </div>
    </form>
  );
}

export function AttendanceWorkspace({
  user,
  classes,
  codes,
  sessions,
  register,
  reportDate,
  selectedSessionId,
}: {
  user: CurrentUser;
  classes: AttendanceClassGroup[] | null;
  codes: AttendanceCode[];
  sessions: AttendanceSession[];
  register: AttendanceRegister | null;
  reportDate: string;
  selectedSessionId?: string;
}) {
  const school = user.schools[0];
  const teacherOnly = user.roles.includes("TEACHER") && !user.roles.some((role) => ["SUPER_ADMIN", "HEADTEACHER", "SLT", "ADMIN", "ATTENDANCE_OFFICER"].includes(role));
  const name = accountName(user.email);

  return (
    <AppShell
      activePath="/attendance"
      user={{ name, role: teacherOnly ? "Teacher" : "Attendance staff", initials: name.split(" ").map((part) => part[0] ?? "").slice(0, 2).join("").toUpperCase() }}
      academicYear=""
      academicTerm=""
      schoolName={school?.name ?? "School workspace"}
      schoolContext={school?.code ?? "Attendance"}
      systemStatusLabel="Attendance access active"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand">Attendance register</h1>
            <p className="mt-1 text-sm text-muted-foreground">Open a registration or lesson session, mark pupils, and save an audited register.</p>
          </div>
          <StatusPill tone="info" icon={<CalendarDays className="h-3.5 w-3.5" />}>{formatDate(reportDate)}</StatusPill>
        </header>

        <SectionCard icon={<ClipboardCheck className="h-5 w-5" />} title="Open a session" subtitle={teacherOnly ? "Only lesson sessions for your assigned classes are available." : "Choose a date and session type to start a school register."}>
          <CreateSessionForm classes={classes} reportDate={reportDate} teacherOnly={teacherOnly} />
        </SectionCard>

        {register ? (
          <SectionCard
            icon={<Users className="h-5 w-5" />}
            title={register.session.sessionType === "lesson" ? "Lesson register" : `${register.session.sessionType === "morning" ? "Morning" : "Afternoon"} registration`}
            subtitle={`${formatDate(register.session.sessionDate)}${register.session.lessonPeriod ? ` · ${register.session.lessonPeriod}` : ""} · ${register.items.length} pupils`}
            action={<StatusPill tone="info">{register.items.filter((pupil) => pupil.attendanceCode).length} marked</StatusPill>}
          >
            {register.items.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">No enrolled pupils are available for this session.</p>
            ) : codes.length === 0 ? (
              <p className="py-2 text-sm text-warning-text">Attendance codes are unavailable. Marks cannot be saved.</p>
            ) : (
              <RegisterForm register={register} codes={codes} />
            )}
          </SectionCard>
        ) : selectedSessionId ? (
          <p className="rounded-md border border-warning-border bg-warning-bg p-3 text-sm text-warning-text">This register is unavailable to your account or no longer exists.</p>
        ) : null}

        <SectionCard icon={<CalendarDays className="h-5 w-5" />} title="Sessions for this date" subtitle="Open a saved register to review or correct marks">
          {sessions.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">No sessions have been opened for this date.</p>
          ) : (
            <div className="divide-y divide-border">
              {sessions.map((session) => (
                <Link key={session.id} href={`/attendance?date=${encodeURIComponent(reportDate)}&sessionId=${encodeURIComponent(session.id)}`} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="font-medium capitalize text-foreground">{session.sessionType}{session.lessonPeriod ? ` · ${session.lessonPeriod}` : ""}</span>
                  <span className="text-xs text-muted-foreground">{session._count.records} marks recorded</span>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
