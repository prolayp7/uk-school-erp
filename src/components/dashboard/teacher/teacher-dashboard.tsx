"use client";

import { useState } from "react";
import {
  Airplay,
  Award,
  BookOpenCheck,
  Calendar,
  Camera,
  Check,
  ClipboardList,
  Ear,
  FileWarning,
  Flag,
  FlaskConical,
  MessageSquareWarning,
  Pin,
  Plus,
  Printer,
  Sparkles,
  Star,
  Stethoscope,
  Wind,
} from "lucide-react";

import { AppShell } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill, type PillTone } from "@/components/dashboard/status-pill";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PERIODS = [
  {
    tag: "Form Time",
    time: "08:35 – 09:00",
    title: "Form Registration 10B",
    status: "Register due",
    statusTone: "warning" as PillTone,
    meta: ["Room S04", "28 Pupils"],
    note: "Notices for form tutor: collect Y10 consent slips",
    highlight: true,
    actionLabel: "Take AM register",
  },
  {
    tag: "Period 1",
    time: "09:05 – 10:05",
    title: "Year 11 GCSE Biology",
    status: "Unmarked",
    statusTone: "neutral" as PillTone,
    meta: ["Lab 3", "Set 11A/Bi1", "29 pupils"],
    note: "Unit B2.1 Cellular Respiration · gas syringe equipment prep ordered",
    actionLabel: "Register",
  },
  {
    tag: "Period 2",
    time: "10:10 – 11:10",
    title: "Year 9 Combined Science",
    status: "Unmarked",
    statusTone: "neutral" as PillTone,
    meta: ["Lab 2", "Set 9C/Sc2", "28 pupils"],
    note: "Unit C1.4 Rates of Reaction · 1 pupil needs front-row seating",
    actionLabel: "Register",
  },
  {
    tag: "Break",
    time: "11:10 – 11:30",
    title: "Science Quad Supervision",
    status: "Duty roster",
    statusTone: "info" as PillTone,
    meta: ["Staff base"],
    note: "High-visibility vest in staff base. Co-duty: Ms A. Jenkins (English).",
    muted: true,
  },
  {
    tag: "Period 3",
    time: "11:30 – 12:30",
    title: "Planning & Assessment (PPA)",
    status: "PPA allocated",
    statusTone: "neutral" as PillTone,
    meta: ["Science Prep Room", "60 mins"],
    note: "Scheduled task: Year 11 mock exam paper moderation.",
  },
  {
    tag: "Period 4 & 5",
    time: "13:25 – 14:50",
    title: "PM Register + Y10 Triple Biology",
    status: "Upcoming",
    statusTone: "neutral" as PillTone,
    meta: ["S04 & Lab 3", "Set 10A/Bi"],
    note: "Topic: Genetics — Punnett squares",
    actionLabel: "View group",
  },
];

const HOMEWORK = [
  {
    icon: FileWarning,
    tone: "danger" as PillTone,
    title: "Osmosis Required Practical Write-up",
    group: "Year 11 GCSE",
    detail: "Due 11/10 (past deadline) • 27/29 submitted",
    warn: "2 missing",
    action: "Review (27)",
    actionVariant: "default" as const,
  },
  {
    icon: BookOpenCheck,
    tone: "warning" as PillTone,
    title: "Periodic Table Trends Quiz & Summary",
    group: "Year 9 Combined",
    detail: "Due today, 16:00 • 15/28 submitted",
    action: "Track progress",
    actionVariant: "outline" as const,
  },
  {
    icon: ClipboardList,
    tone: "neutral" as PillTone,
    title: "Enzyme Substrate Activity Worksheet",
    group: "Year 10 Triple",
    detail: "Assigned 10/10 • Due 18/10 • 9 turned in early",
    action: "Feedback",
    actionVariant: "outline" as const,
  },
];

const CONDUCT = [
  {
    initials: "CS",
    name: "Chloe Simmons",
    group: "Year 10 (10A/Bi)",
    note: "Outstanding participation in enzyme lab investigation",
    tag: "+2 Merits",
    tone: "success" as PillTone,
    date: "Fri 11/10",
  },
  {
    initials: "LG",
    name: "Lucas Green",
    group: "Year 11 (11A/Bi1)",
    note: "Forgotten homework planner (1st instance this term)",
    tag: "C1 warning",
    tone: "warning" as PillTone,
    date: "Thu 10/10",
  },
  {
    initials: "FA",
    name: "Fatima Al-Mansoor",
    group: "Year 9 (9C/Sc2)",
    note: "Exceptional team collaboration in acid titration setup",
    tag: "+3 Merits",
    tone: "success" as PillTone,
    date: "Wed 09/10",
  },
];

const ANNOUNCEMENTS = [
  {
    icon: Pin,
    tag: "Whole-school notice",
    date: "13/10/2025",
    title: "Autumn Term Open Evening: Wed 15/10/2025",
    body: "Science dept practical demonstration setup in Labs 1–4 from 15:30. Early pupil dismissal at 14:15. Staff briefing in the Great Hall at 16:00.",
    tone: "info" as PillTone,
  },
  {
    icon: FlaskConical,
    tag: "Science faculty notice",
    date: "12/10/2025",
    title: "KS4 Assessment Moderation Window",
    body: "Moderation sample submissions for Year 10 and 11 autumn progress tests open next Monday. Ensure marks are registered in the MIS by Friday 17:00.",
    tone: "brand" as PillTone,
  },
];

const EVENTS = [
  { day: "Wed", date: "15", title: "Year 7 Settling-in Parents' Evening", meta: "16:30 – 19:30 • Main Auditorium & Dining Hall", tone: "brand" as PillTone },
  { day: "Fri", date: "17", title: "Wear Yellow for Mental Health Day", meta: "Whole-school non-uniform (£1 donation to YoungMinds)", tone: "warning" as PillTone },
  { day: "Thu", date: "23", title: "KS4 GCSE Science Field Trip", meta: "Natural History Museum • 45 pupils • Coach departs 08:45", tone: "neutral" as PillTone },
];

const PROVISIONS = [
  { icon: Wind, label: "Medical protocol (asthma)", meta: "2 pupils (10B, 11A)" },
  { icon: Ear, label: "Hearing loop / front row", meta: "1 pupil (set 9C)" },
  { icon: Stethoscope, label: "Pupil premium resource pack", meta: "Issued for KS4 practical" },
];

function PillDot({ tone }: { tone: PillTone }) {
  const dotClass =
    tone === "success"
      ? "bg-success-text"
      : tone === "warning"
        ? "bg-warning-text"
        : tone === "danger"
          ? "bg-danger-text"
          : tone === "info"
            ? "bg-info-text"
            : tone === "brand"
              ? "bg-brand"
              : "bg-muted-foreground";
  return <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />;
}

export function TeacherDashboard() {
  const [registerTaken, setRegisterTaken] = useState(false);
  const [homeworkFilter, setHomeworkFilter] = useState<"due" | "overdue" | "drafts">("due");

  return (
    <AppShell
      activePath="/dashboard"
      user={{ name: "Mr Daniel Patel", role: "Form Tutor 10B · Science", initials: "DP" }}
    >
      {/* Compliance strip */}
      <div className="flex flex-col items-start justify-between gap-2 rounded-lg bg-card p-3 shadow-sm sm:flex-row sm:items-center">
        <p className="flex items-start gap-2.5 text-sm text-muted-foreground sm:items-center">
          <Camera className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-brand sm:mt-0" />
          <span>
            <strong className="font-medium text-brand">Teacher Level 1 access verified:</strong> session scoped to{" "}
            <span className="font-medium text-foreground">Form 10B</span> and timetabled KS3/KS4 Science groups.
            Pastoral & safeguarding data are held securely off-screen under DSL protocols.
          </span>
        </p>
        <div className="flex flex-shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-info-bg px-2 py-0.5 font-mono uppercase text-info-text">MIS node #748</span>
          <span className="h-2 w-2 rounded-full bg-success-text" />
          <span className="font-medium">Audit trail active</span>
        </div>
      </div>

      {/* Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Overview</span>
            <span>/</span>
            <span>Teacher Workspace</span>
            <span>/</span>
            <span className="font-semibold text-brand">Daily Overview</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Good morning, Mr Patel
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <Calendar className="h-4 w-4 text-brand" />
              Monday, 13/10/2025
              <span className="text-border">•</span>
              <span className="font-medium text-foreground">Autumn Term (Week 7)</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Form Tutor 10B • Head of Key Stage 4 Science / Biology</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4 text-muted-foreground" />
            Set homework
          </Button>
          <Button variant="outline" className="gap-2">
            <Star className="h-4 w-4 text-warning-text" />
            Log merit / behaviour
          </Button>
          <Button
            onClick={() => setRegisterTaken(true)}
            disabled={registerTaken}
            className="gap-2.5 bg-brand text-white hover:bg-brand-hover disabled:opacity-100"
          >
            {registerTaken ? (
              <>
                <Check className="h-[18px] w-[18px]" />
                Roll session open
              </>
            ) : (
              <>
                <ClipboardList className="h-[18px] w-[18px]" />
                Take AM register (10B)
                <span className="animate-pulse rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                  Due in 12m
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          accent="bg-warning-text"
          label="AM roll call"
          badge={<StatusPill tone="warning">Pending</StatusPill>}
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-foreground">
                <NumberTicker value={28} className="text-foreground" />
              </span>
              <span className="text-sm text-muted-foreground">on roll</span>
            </div>
          }
          meta={
            <span className="flex items-center gap-1.5 text-xs font-medium text-info-text">
              <Airplay className="h-3.5 w-3.5" /> 2 approved music passes
            </span>
          }
          footer={
            <>
              <span>Room S04</span>
              <span className="font-semibold text-brand">Open form sheet →</span>
            </>
          }
        />
        <KpiCard
          label="Teaching load"
          badge={<FlaskConical className="h-[18px] w-[18px] text-brand" />}
          value={<span className="font-heading text-2xl font-bold text-foreground">5 periods</span>}
          meta={<span>132 pupils timetabled today</span>}
          footer={
            <>
              <span className="flex items-center gap-1 text-success-text">
                <PillDot tone="success" /> Labs 2 & 3 booked
              </span>
              <span className="font-mono font-semibold text-foreground">08:35–15:00</span>
            </>
          }
        />
        <KpiCard
          label="Marking queue"
          badge={<StatusPill tone="brand">42 pending</StatusPill>}
          value={<span className="font-heading text-2xl font-bold text-foreground">2 sets</span>}
          meta={<span className="truncate">Y11 Osmosis & Y9 Periodic</span>}
          footer={
            <>
              <span className="font-medium text-warning-text">1 overdue batch</span>
              <span className="font-semibold text-brand">Grade submissions →</span>
            </>
          }
        />
        <KpiCard
          label="Pupil provisions"
          badge={<Stethoscope className="h-[18px] w-[18px] text-muted-foreground" />}
          value={<span className="font-heading text-2xl font-bold text-foreground">4 alerts</span>}
          meta={<span>Non-sensitive daily notes</span>}
          footer={
            <>
              <span>Asthma / hearing / PP</span>
              <span className="font-semibold text-brand">View seating →</span>
            </>
          }
        />
        <KpiCard
          label="House merits"
          badge={<StatusPill tone="success">+18 this wk</StatusPill>}
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-brand">
                <NumberTicker value={142} className="text-brand" />
              </span>
              <span className="text-sm text-muted-foreground">term to date</span>
            </div>
          }
          meta={<span>Leading: Bede House (+46)</span>}
          footer={
            <>
              <span className="font-medium text-success-text">92% positive ratio</span>
              <span className="font-semibold text-brand">House standings →</span>
            </>
          }
        />
      </div>

      {/* Timetable */}
      <SectionCard
        icon={<Calendar className="h-5 w-5" />}
        title="Today's timetable & registration control"
        subtitle="6 discrete teaching & duty blocks scheduled for Monday, 13/10/2025"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Printer className="h-4 w-4 text-muted-foreground" />
              Print cover slip
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              Full 2-week cycle
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3.5 pt-2 md:grid-cols-2 xl:grid-cols-3">
          {PERIODS.map((period) => (
            <div
              key={period.tag + period.time}
              className={
                period.highlight
                  ? "relative flex flex-col justify-between overflow-hidden rounded-xl bg-background p-4 shadow-sm before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-brand"
                  : period.muted
                    ? "flex flex-col justify-between rounded-xl bg-muted/60 p-4 shadow-sm"
                    : "flex flex-col justify-between rounded-xl bg-card p-4 shadow-sm"
              }
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={
                        period.highlight
                          ? "rounded bg-brand-tint px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-brand"
                          : "rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-muted-foreground"
                      }
                    >
                      {period.tag}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{period.time}</span>
                  </div>
                  <StatusPill tone={period.statusTone} icon={period.highlight ? <span className="h-1.5 w-1.5 animate-ping rounded-full bg-warning-text" /> : undefined}>
                    {period.status}
                  </StatusPill>
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground">{period.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {period.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
                <p className="mt-3 rounded-lg bg-muted px-2.5 py-2 text-xs text-muted-foreground">{period.note}</p>
              </div>
              {period.actionLabel ? (
                <div className="mt-4 flex items-center justify-end pt-3">
                  <Button size="sm" variant={period.highlight ? "default" : "outline"} className={period.highlight ? "gap-1.5 bg-brand text-white hover:bg-brand-hover" : "gap-1.5"}>
                    {period.actionLabel}
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <SectionCard
            title="Homework submissions & marking"
            subtitle="Key Stage 4 Biology assignments awaiting assessment"
            action={
              <button type="button" className="text-sm font-semibold text-brand hover:underline">
                All assignments →
              </button>
            }
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1">
              {(
                [
                  { key: "due", label: "Due this week (2)" },
                  { key: "overdue", label: "Overdue marking (1)" },
                  { key: "drafts", label: "Drafts & scheduled (1)" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setHomeworkFilter(tab.key)}
                  className={
                    homeworkFilter === tab.key
                      ? "flex-shrink-0 rounded-lg bg-brand-tint px-3 py-1.5 text-sm font-medium text-brand"
                      : "flex-shrink-0 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/70"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {HOMEWORK.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-lg bg-background p-3.5 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={
                        item.tone === "danger"
                          ? "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-danger-bg text-danger-text"
                          : item.tone === "warning"
                            ? "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-warning-bg text-warning-text"
                            : "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-muted text-muted-foreground"
                      }
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{item.title}</span>
                        <StatusPill tone="brand">{item.group}</StatusPill>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.detail}</span>
                        {item.warn ? <span className="font-medium text-danger-text">({item.warn})</span> : null}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={item.actionVariant}
                    className={item.actionVariant === "default" ? "flex-shrink-0 self-end bg-brand text-white hover:bg-brand-hover md:self-center" : "flex-shrink-0 self-end md:self-center"}
                  >
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            icon={<Award className="h-5 w-5" />}
            title="Classroom behaviour & merits"
            subtitle="Recent reward points and conduct logs for Mr Patel's classes"
            action={
              <Button size="sm" className="gap-1.5 bg-brand text-white hover:bg-brand-hover">
                <Plus className="h-4 w-4" />
                Quick log
              </Button>
            }
          >
            <div className="overflow-x-auto pt-2">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Pupil</TableHead>
                    <TableHead>Year / group</TableHead>
                    <TableHead>Incident / recognition</TableHead>
                    <TableHead>Type & points</TableHead>
                    <TableHead className="text-right">Recorded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CONDUCT.map((row) => (
                    <TableRow key={row.initials + row.date}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium text-foreground">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-brand">
                            {row.initials}
                          </span>
                          {row.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">{row.group}</TableCell>
                      <TableCell className="max-w-xs whitespace-normal text-foreground">{row.note}</TableCell>
                      <TableCell>
                        <StatusPill tone={row.tone} icon={row.tone === "success" ? <Star className="h-3.5 w-3.5" /> : <MessageSquareWarning className="h-3.5 w-3.5" />}>
                          {row.tag}
                        </StatusPill>
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-5">
          <SectionCard icon={<Sparkles className="h-5 w-5" />} title="Staff notices & briefings" action={<StatusPill tone="brand">Autumn W7</StatusPill>}>
            <div className="flex flex-col gap-3 pt-1">
              {ANNOUNCEMENTS.map((note) => (
                <div key={note.title} className={note.tone === "info" ? "rounded-lg bg-info-bg p-3.5 shadow-sm" : "rounded-lg bg-background p-3.5 shadow-sm"}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <note.icon className={note.tone === "info" ? "h-4 w-4 text-info-text" : "h-4 w-4 text-brand"} />
                    <span className={note.tone === "info" ? "text-[11px] font-bold uppercase tracking-wide text-info-text" : "text-[11px] font-bold uppercase tracking-wide text-brand"}>
                      {note.tag}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">{note.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{note.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{note.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            icon={<Calendar className="h-5 w-5" />}
            title="Upcoming key dates"
            action={
              <button type="button" className="text-sm font-medium text-brand hover:underline">
                Academic diary
              </button>
            }
          >
            <div className="flex flex-col gap-1 pt-1">
              {EVENTS.map((event) => (
                <div key={event.title} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50">
                  <div
                    className={
                      event.tone === "brand"
                        ? "flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-brand-tint text-brand"
                        : event.tone === "warning"
                          ? "flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-warning-bg text-warning-text"
                          : "flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-foreground"
                    }
                  >
                    <span className="text-[10px] font-bold uppercase leading-none">{event.day}</span>
                    <span className="mt-0.5 text-[15px] font-bold leading-none">{event.date}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            icon={<Flag className="h-[18px] w-[18px]" />}
            title="Classroom support summaries"
            subtitle="Permitted accommodations for pupils in today's classes. For formal EHCP documentation, contact SENCO."
            action={<StatusPill tone="neutral">Active</StatusPill>}
          >
            <div className="flex flex-col gap-2.5 pt-1">
              {PROVISIONS.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-background p-2.5 text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.meta}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
