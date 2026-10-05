"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BookMarked,
  Download,
  FileCheck2,
  Flag,
  Gavel,
  History,
  Lock,
  Megaphone,
  PersonStanding,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";

import { AppShell } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { TrendChart, type TrendWeek } from "@/components/dashboard/trend-chart";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const YEAR_ATTENDANCE = [
  { year: "Year 7", pct: 97.1, present: 210, roll: 216, flag: false },
  { year: "Year 8", pct: 96.4, present: 208, roll: 215, flag: false },
  { year: "Year 9", pct: 95.0, present: 202, roll: 212, flag: false },
  { year: "Year 10", pct: 93.8, present: 197, roll: 210, flag: true },
  { year: "Year 11", pct: 95.2, present: 196, roll: 206, flag: false },
  { year: "Year 12", pct: 94.9, present: 85, roll: 90, flag: false },
  { year: "Year 13", pct: 95.8, present: 82, roll: 86, flag: false },
] as const;

const TREND_WEEKS: TrendWeek[] = [
  { label: "Wk 2", date: "09 Sep", attendance: 94.6, incidents: 42 },
  { label: "Wk 3", date: "16 Sep", attendance: 95.1, incidents: 38 },
  { label: "Wk 4", date: "23 Sep", attendance: 95.8, incidents: 31 },
  { label: "Wk 5", date: "30 Sep", attendance: 95.2, incidents: 28 },
  { label: "Wk 6", date: "07 Oct", attendance: 95.5, incidents: 24 },
  { label: "Wk 7", date: "14 Oct", attendance: 96.2, incidents: 19, isCurrent: true },
];

const ACTIONS = [
  {
    icon: FileCheck2,
    label: "Inspect AM Registers",
    meta: "48 of 50 forms submitted (96%)",
    tag: "2 Missing",
    tone: "warning" as const,
  },
  {
    icon: PersonStanding,
    label: "Persistent Absence Cohort",
    meta: "Filter Year 9 & Year 10 cases",
    tag: "Cohort 139",
    tone: "brand" as const,
  },
  {
    icon: Megaphone,
    label: "Trust Broadcast Notice",
    meta: "Direct parent & staff notification",
    tag: "Push Broadcast",
    tone: "neutral" as const,
  },
  {
    icon: BookMarked,
    label: "Ofsted Inspection Dossier",
    meta: "1-click statutory evidence pack",
    tag: "Ready",
    tone: "success" as const,
  },
];

const SAFEGUARDING_QUEUE = [
  {
    initials: "JD",
    name: "Pupil J. D.",
    context: "Year 10 • Form 10B",
    level: "Level 3",
    detail: "Consecutive unexplained absence (Day 3) • MASH referral drafted",
    action: "Review case",
    tone: "danger" as const,
  },
  {
    initials: "MW",
    name: "Pupil M. W.",
    context: "Year 8 • Form 8F",
    level: "CPOMS",
    detail: "External agency social care log update received • 08:24",
    action: "View log",
    tone: "warning" as const,
  },
  {
    initials: "TK",
    name: "Pupil T. K.",
    context: "Year 11 • Form 11A",
    level: "Low-level",
    detail: "Peer friction report logged by Form Tutor (Mr Patel) • 09:15",
    action: "Acknowledge",
    tone: "neutral" as const,
  },
];

const PUPILS_REQUIRING_ACTION = [
  {
    initials: "LT",
    name: "Liam Turner",
    form: "10B",
    upn: "W801202319044",
    tag: "3x U-code",
    tone: "danger" as const,
    detail: "Late after register closed on Monday, Thursday, and today.",
    lead: "Lead: Mr J. Evans (HoY 10)",
    action: "Contact parent",
  },
  {
    initials: "MK",
    name: "Maya Kapoor",
    form: "9H",
    upn: "E801202410882",
    tag: "88.4% PA",
    tone: "warning" as const,
    detail: "Fell below 90% statutory threshold. Target attendance contract needed.",
    lead: "Lead: Ms H. Crawford",
    action: "Issue notice",
  },
  {
    initials: "ES",
    name: "Ethan Sinclair",
    form: "11C",
    upn: "K801202298711",
    tag: "C3 behaviour",
    tone: "brand" as const,
    detail: "Defiance in Science Block P2. After-school detention scheduled.",
    lead: "Lead: Mrs K. Wright",
    action: "View log",
  },
];

const DEADLINES = [
  {
    title: "Autumn School Census (DfE Return)",
    meta: "Statutory deadline: 31/10/2024",
    due: "17 days left",
    tone: "warning" as const,
    progress: 82,
    note: "2 missing UPNs • 0 errors",
  },
  {
    title: "Full Governing Body (FGB) Standards Review",
    meta: "Thursday, 17/10/2024 • 18:00 (Boardroom)",
    due: "3 days",
    tone: "neutral" as const,
  },
  {
    title: "Year 11 Mock Exam Timetable Sign-off",
    meta: "Tomorrow, 15/10/2024 • 15:30",
    due: "Tomorrow",
    tone: "brand" as const,
    note: "Room allocations verified",
  },
  {
    title: "SEND Information Report Trust Publication",
    meta: "Friday, 18/10/2024 • statutory website requirement",
    due: "4 days",
    tone: "neutral" as const,
  },
];

const AUDIT_EVENTS = [
  {
    title: "AM register finalised: Form 11A",
    time: "09:12",
    detail: "Submitted by Mr D. Patel. 28 present, 2 late, 0 unauthorised.",
    tone: "success" as const,
  },
  {
    title: "Emergency contact updated",
    time: "08:55",
    detail: "Pupil Sophie Robinson (Year 7) — priority contact revised via Parent Portal.",
    tone: "brand" as const,
  },
  {
    title: "Batch communication dispatched",
    time: "08:30",
    detail: "Year 9 parents' evening invitation sent to 212 priority contacts.",
    tone: "neutral" as const,
  },
  {
    title: "DfE GIAP synchronisation",
    time: "07:45",
    detail: "Automated sync: 2 joiner records ingested for mid-term admissions.",
    tone: "muted" as const,
  },
];

const DOT_TONE: Record<string, string> = {
  success: "bg-success-text",
  brand: "bg-brand",
  neutral: "bg-muted-foreground",
  muted: "bg-border",
};

export function HeadteacherDashboard() {
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);

  return (
    <AppShell
      activePath="/dashboard"
      user={{ name: "Dr Rachel Holloway", role: "Headteacher & SLT", initials: "RH" }}
    >
      {/* Page header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Overview</span>
            <span>/</span>
            <span className="font-semibold text-brand">Executive Overview</span>
            <StatusPill tone="success" icon={<span className="h-1.5 w-1.5 rounded-full bg-success-text" />}>
              Live MIS sync active
            </StatusPill>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
            Senior Leadership Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Academy trust executive overview & statutory operations • Academic Year 2025–2026 • Monday, 13/10/2025
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
            <span className="font-medium text-foreground">Autumn Term • Week 7</span>
          </div>
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export summary
          </Button>
          <Dialog
            open={noticeOpen}
            onOpenChange={(open) => {
              setNoticeOpen(open);
              if (!open) setNoticeSent(false);
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-1.5 bg-brand text-white hover:bg-brand-hover">
                <Megaphone className="h-4 w-4" />
                Record whole-school notice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-brand" />
                  Record whole-school notice
                </DialogTitle>
                <DialogDescription>
                  Publish an official academy-wide notice to staff briefings, guardian app feeds, and classroom
                  digital registers.
                </DialogDescription>
              </DialogHeader>
              {noticeSent ? (
                <div className="flex items-start gap-2.5 rounded-lg border border-success-border bg-success-bg p-3 text-sm text-success-text">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <strong className="block font-semibold">Notice published</strong>
                    Added to register briefings and the guardian feed.
                  </div>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setNoticeSent(true);
                  }}
                >
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="notice-title">Notice title</Label>
                    <Input id="notice-title" placeholder="e.g. Severe weather advisory" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="notice-body">Notice content</Label>
                    <textarea
                      id="notice-body"
                      required
                      rows={3}
                      placeholder="Enter the official text for dissemination…"
                      className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-brand text-white hover:bg-brand-hover">
                      Publish notice
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Attendance (AM)"
          badge={
            <StatusPill tone="success" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
              +0.3%
            </StatusPill>
          }
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-foreground">
                <NumberTicker value={95.4} decimalPlaces={1} className="text-foreground" />%
              </span>
              <span className="text-xs text-muted-foreground">Target 96.0%</span>
            </div>
          }
          footer={
            <>
              <span>1,182 of 1,239 on site</span>
              <span className="h-2 w-2 rounded-full bg-success-text" />
            </>
          }
        />
        <KpiCard
          label="Persistent absence"
          badge={
            <StatusPill tone="info" icon={<TrendingDown className="h-3.5 w-3.5" />}>
              -0.8%
            </StatusPill>
          }
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-foreground">
                <NumberTicker value={11.2} decimalPlaces={1} className="text-foreground" />%
              </span>
              <span className="text-xs text-muted-foreground">139 pupils &lt;90%</span>
            </div>
          }
          footer={
            <>
              <span className="font-medium text-warning-text">18 critical cases (&lt;80%)</span>
              <AlertTriangle className="h-4 w-4 text-warning-text" />
            </>
          }
        />
        <KpiCard
          label="Late arrivals (AM)"
          badge={<StatusPill tone="warning">24 total</StatusPill>}
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-foreground">
                <NumberTicker value={24} className="text-foreground" />
              </span>
              <span className="text-xs text-muted-foreground">14 unexcused</span>
            </div>
          }
          footer={
            <>
              <span>8 concentrated in Y10</span>
              <span className="font-medium text-brand">L: 10 • U: 14</span>
            </>
          }
        />
        <KpiCard
          label="Behaviour logs"
          badge={<StatusPill tone="success">-33% vs avg</StatusPill>}
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-foreground">
                <NumberTicker value={6} className="text-foreground" />
              </span>
              <span className="text-xs text-muted-foreground">Today (0 excl.)</span>
            </div>
          }
          footer={
            <>
              <span>4 C1/C2 • 2 detentions</span>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </>
          }
        />
        <KpiCard
          label="SEND reviews due"
          badge={<StatusPill tone="neutral">Fortnight</StatusPill>}
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-foreground">
                <NumberTicker value={9} className="text-foreground" />
              </span>
              <span className="text-xs text-muted-foreground">3 EHCP • 6 K-code</span>
            </div>
          }
          footer={<span className="truncate">SENCO: Mrs C Morris</span>}
        />
        <KpiCard
          tone="brand"
          label="DSL restricted"
          badge={
            <span className="rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
              Level 3 (1)
            </span>
          }
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-white">
                <NumberTicker value={3} className="text-white" />
              </span>
              <span className="text-xs text-white/80">Active alerts</span>
            </div>
          }
          footer={
            <>
              <span className="truncate">DSL lead: Mr T Henderson</span>
              <span className="cursor-pointer text-white underline">Review</span>
            </>
          }
        />
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <SectionCard
            title="Statutory attendance by year group"
            subtitle={
              <>
                Whole-academy average today: <strong className="text-foreground">95.4%</strong> vs national
                secondary benchmark <strong className="text-foreground">94.8%</strong>
              </>
            }
          >
            <div className="flex flex-col gap-3 pt-2">
              {YEAR_ATTENDANCE.map((row) => (
                <div
                  key={row.year}
                  className={
                    row.flag
                      ? "flex items-center gap-3 rounded-lg bg-warning-bg p-1.5"
                      : "flex items-center gap-3"
                  }
                >
                  <span
                    className={
                      row.flag
                        ? "flex w-20 flex-shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-warning-text"
                        : "w-20 flex-shrink-0 whitespace-nowrap text-sm font-medium text-foreground"
                    }
                  >
                    {row.flag ? <Flag className="h-3.5 w-3.5 flex-shrink-0" /> : null}
                    {row.year}
                  </span>
                  <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-muted">
                    <div
                      className={row.flag ? "h-full rounded-md bg-brand/70" : "h-full rounded-md bg-brand"}
                      style={{ width: `${row.pct}%` }}
                    />
                    <div className="absolute inset-y-0 left-[96%] w-0.5 bg-warning-text opacity-70" />
                  </div>
                  <span
                    className={
                      row.flag
                        ? "w-14 text-right font-mono text-sm font-bold text-warning-text"
                        : "w-14 text-right font-mono text-sm font-semibold text-foreground"
                    }
                  >
                    {row.pct.toFixed(1)}%
                  </span>
                  <span className="w-16 text-right text-xs text-muted-foreground">
                    {row.present}/{row.roll}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                <strong className="font-semibold text-foreground">Intervention note:</strong> Y10 pastoral lead
                (Mr J Evans) conducting home visits this afternoon for 6 persistent lateness cases.
              </span>
              <button type="button" className="flex flex-shrink-0 items-center gap-1 font-semibold text-brand hover:underline">
                Filter cohort <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </SectionCard>

          <SectionCard
            title="6-week trust trend: attendance & behaviour incidents"
            subtitle="Weekly statutory tracking vs Department for Education 96.0% quality standard"
            action={
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className="h-3 w-3 rounded-full bg-brand" /> Attendance %
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-3 w-3 rounded bg-muted-foreground/40" /> Incidents
                </span>
              </div>
            }
          >
            <TrendChart weeks={TREND_WEEKS} yMin={92} yMax={98} targetValue={96} />
          </SectionCard>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-5">
          <SectionCard title="Immediate SLT actions" action={<StatusPill tone="info">Session AM</StatusPill>}>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {ACTIONS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="group flex flex-col justify-between rounded-lg bg-background p-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-tint text-brand">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <StatusPill tone={item.tone}>{item.tag}</StatusPill>
                  </div>
                  <div className="mt-2.5">
                    <span className="block text-sm font-medium text-foreground group-hover:text-brand">
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.meta}</span>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="DSL welfare & safeguarding queue"
            action={
              <StatusPill tone="danger" icon={<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger-text" />}>
                3 unresolved
              </StatusPill>
            }
            subtitle="Strictly confidential • encrypted audit-log compliant with Keeping Children Safe in Education (KCSIE 2024)."
          >
            <div className="flex flex-col gap-2.5">
              {SAFEGUARDING_QUEUE.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3 rounded-lg bg-background p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={
                        item.tone === "danger"
                          ? "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-danger-bg text-xs font-bold text-danger-text"
                          : item.tone === "warning"
                            ? "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-warning-bg text-xs font-bold text-warning-text"
                            : "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground"
                      }
                    >
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">({item.context})</span>
                        <StatusPill tone={item.tone}>{item.level}</StatusPill>
                      </div>
                      <span className="block truncate text-sm text-muted-foreground">{item.detail}</span>
                    </div>
                  </div>
                  <Button size="sm" variant={item.tone === "danger" ? "default" : "outline"} className="flex-shrink-0">
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
            <a href="#" className="mt-3 flex items-center justify-end gap-1 text-sm font-semibold text-brand hover:underline">
              Open secure DSL vault <Lock className="h-4 w-4" />
            </a>
          </SectionCard>
        </div>
      </div>

      {/* Lower panels */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SectionCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Pupils requiring action"
          subtitle="Pastoral SLT triage"
        >
          <div className="flex flex-col gap-3">
            {PUPILS_REQUIRING_ACTION.map((pupil) => (
              <div key={pupil.upn} className="flex flex-col gap-2 rounded-lg bg-background p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint text-[13px] font-bold text-brand">
                      {pupil.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">{pupil.name}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          {pupil.form}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">UPN: {pupil.upn}</span>
                    </div>
                  </div>
                  <StatusPill tone={pupil.tone}>{pupil.tag}</StatusPill>
                </div>
                <p className="text-xs text-muted-foreground">{pupil.detail}</p>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-muted-foreground">{pupil.lead}</span>
                  <button type="button" className="font-semibold text-brand hover:underline">
                    {pupil.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="mt-3 text-center text-sm font-medium text-brand hover:underline">
            View all 14 pastoral intervention flags →
          </a>
        </SectionCard>

        <SectionCard icon={<FileCheck2 className="h-5 w-5" />} title="Statutory deadlines" subtitle="October 2025">
          <div className="flex flex-col gap-3">
            {DEADLINES.map((deadline) => (
              <div key={deadline.title} className="flex flex-col gap-2 rounded-lg bg-background p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="block text-sm font-medium text-foreground">{deadline.title}</span>
                    <span className="text-xs text-muted-foreground">{deadline.meta}</span>
                  </div>
                  <StatusPill tone={deadline.tone} className="flex-shrink-0">
                    {deadline.due}
                  </StatusPill>
                </div>
                {deadline.progress ? <Progress value={deadline.progress} className="h-2" /> : null}
                {deadline.note ? (
                  <span className="text-[11px] text-muted-foreground">{deadline.note}</span>
                ) : null}
              </div>
            ))}
          </div>
          <a href="#" className="mt-3 text-center text-sm font-medium text-brand hover:underline">
            Open statutory compliance calendar →
          </a>
        </SectionCard>

        <SectionCard
          icon={<History className="h-5 w-5" />}
          title="Academy audit stream"
          action={
            <StatusPill tone="success" icon={<span className="h-1.5 w-1.5 rounded-full bg-success-text" />}>
              Live
            </StatusPill>
          }
        >
          <div className="relative flex flex-col gap-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-muted before:content-['']">
            {AUDIT_EVENTS.map((event) => (
              <div key={event.title} className="relative flex flex-col gap-0.5">
                <span
                  className={`absolute -left-6 top-1 h-3 w-3 rounded-full ring-4 ring-card ${DOT_TONE[event.tone]}`}
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{event.title}</span>
                  <span className="flex-shrink-0 font-mono text-[11px] text-muted-foreground">{event.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.detail}</p>
              </div>
            ))}
          </div>
          <a href="#" className="mt-3 text-center text-sm font-medium text-brand hover:underline">
            Inspect complete system audit trail →
          </a>
        </SectionCard>
      </div>

      {/* Census dock */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-card p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold text-foreground">Autumn 2025 DfE census engine</span>
              <StatusPill tone="success">Specification v1.4</StatusPill>
            </div>
            <p className="text-sm text-muted-foreground">
              1,237 of 1,239 on-roll pupil records validated • 0 fatal errors • 2 validation queries pending sign-off
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">View 2 queries</Button>
          <Button className="bg-brand text-white hover:bg-brand-hover">Generate DfE XML file</Button>
        </div>
      </div>
    </AppShell>
  );
}
