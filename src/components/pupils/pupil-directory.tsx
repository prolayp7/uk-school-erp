"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  Copy,
  Download,
  Layers,
  MoreVertical,
  RotateCcw,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusPill, type PillTone } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PUPILS } from "@/lib/pupils-data";

const YEAR_GROUPS = ["All year groups", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"];
const STATUSES = ["All statuses", "Active", "Leaver", "Dual-Registered"];

type FlagFilter = "all" | "pp" | "send" | "attendance" | "eal" | "medical";

const ATTENDANCE_TONE: Record<string, PillTone> = {
  success: "success",
  warning: "warning",
  danger: "danger",
};

export function PupilDirectory() {
  const [search, setSearch] = useState("");
  const [yearGroup, setYearGroup] = useState("All year groups");
  const [status, setStatus] = useState("All statuses");
  const [flagFilter, setFlagFilter] = useState<FlagFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useMemo(
    () => ({
      pp: PUPILS.filter((p) => p.pupilPremium).length,
      send: PUPILS.filter((p) => p.sendCode).length,
      attendance: PUPILS.filter((p) => p.attendance < 90).length,
      eal: PUPILS.filter((p) => p.flags.some((f) => f.label === "EAL")).length,
      medical: PUPILS.filter((p) => p.flags.some((f) => f.label === "Medical" || f.label === "Asthma")).length,
    }),
    []
  );

  const filtered = useMemo(() => {
    return PUPILS.filter((pupil) => {
      const fullName = `${pupil.legalForename} ${pupil.legalSurname}`.toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search.toLowerCase()) ||
        pupil.upn.toLowerCase().includes(search.toLowerCase()) ||
        pupil.admissionNo.includes(search);
      const matchesYear = yearGroup === "All year groups" || pupil.yearGroup === yearGroup;
      const matchesStatus = status === "All statuses" || pupil.status === status;
      const matchesFlag =
        flagFilter === "all" ||
        (flagFilter === "pp" && pupil.pupilPremium) ||
        (flagFilter === "send" && pupil.sendCode) ||
        (flagFilter === "attendance" && pupil.attendance < 90) ||
        (flagFilter === "eal" && pupil.flags.some((f) => f.label === "EAL")) ||
        (flagFilter === "medical" && pupil.flags.some((f) => f.label === "Medical" || f.label === "Asthma"));
      return matchesSearch && matchesYear && matchesStatus && matchesFlag;
    });
  }, [search, yearGroup, status, flagFilter]);

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(filtered.map((p) => p.id)) : new Set());
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  return (
    <AppShell
      activePath="/pupils"
      user={{ name: "Dr Rachel Holloway", role: "Headteacher & SLT", initials: "RH" }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Overview</span>
            <span>/</span>
            <span>People</span>
            <span>/</span>
            <span className="font-semibold text-brand">Pupil Directory</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Pupil Directory
            </h1>
            <StatusPill tone="success">Autumn Term 2025</StatusPill>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage 1,239 registered pupils, enrolment statuses, and statutory census flags for Academic Year
            2025–2026.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4 text-muted-foreground" />
            Export statutory roll
          </Button>
          <Button variant="outline" className="gap-1.5" disabled={selected.size === 0}>
            <Layers className="h-4 w-4 text-muted-foreground" />
            Bulk actions{selected.size > 0 ? ` (${selected.size})` : ""}
          </Button>
          <Button asChild className="gap-1.5 bg-brand text-white hover:bg-brand-hover">
            <Link href="/pupils/new">
              <UserPlus className="h-4 w-4" />
              Add new pupil
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total on-roll"
          badge={<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-tint text-brand"><Users className="h-5 w-5" /></span>}
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-foreground">1,239</span>
              <span className="text-xs font-medium text-success-text">+18 YTD</span>
            </div>
          }
          footer={
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand" /> 634 Boys
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" /> 605 Girls
              </span>
              <span>Cap: 1,300</span>
            </>
          }
        />
        <KpiCard
          label="Attendance YTD"
          badge={
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-bg text-success-text">
              <ShieldCheck className="h-5 w-5" />
            </span>
          }
          value={<span className="font-heading text-2xl font-bold text-foreground">95.4%</span>}
          footer={
            <div className="flex w-full items-center gap-3">
              <Progress value={95.4} className="h-2" />
              <span className="flex-shrink-0 font-mono text-xs">96.0% DfE goal</span>
            </div>
          }
        />
        <KpiCard
          label="Pupil premium (PP / FSM)"
          badge={
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-bg text-info-text">
              <ShieldCheck className="h-5 w-5" />
            </span>
          }
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-foreground">284</span>
              <span className="text-xs text-muted-foreground">22.9% of roll</span>
            </div>
          }
          footer={
            <>
              <span>Ever 6 FSM: <strong className="text-foreground">248</strong></span>
              <span>Service: <strong className="text-foreground">22</strong></span>
            </>
          }
        />
        <KpiCard
          label="Active SEND support & EHCP"
          badge={
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-brand">
              <Accessibility className="h-5 w-5" />
            </span>
          }
          value={
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-foreground">142</span>
              <span className="text-xs text-muted-foreground">11.4% provision</span>
            </div>
          }
          footer={
            <>
              <span className="flex items-center gap-1.5">
                <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-semibold">K</span> 114 support
              </span>
              <span className="flex items-center gap-1.5">
                <span className="rounded bg-brand-tint px-1.5 py-0.5 text-[11px] font-semibold text-brand">E</span> 28 EHCP
              </span>
            </>
          }
        />
      </div>

      {/* Filter desk */}
      <div className="flex flex-col gap-3.5 rounded-xl bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-[280px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by pupil name, UPN, or admission number…"
              className="h-10 bg-muted pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Select value={yearGroup} onValueChange={setYearGroup}>
              <SelectTrigger className="h-10 min-w-[150px] bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_GROUPS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 min-w-[160px] bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-muted-foreground">Statutory flags:</span>
            {(
              [
                { key: "all", label: `All pupils (${PUPILS.length})` },
                { key: "pp", label: `Pupil Premium (${counts.pp})` },
                { key: "send", label: `SEND support & EHCP (${counts.send})` },
                { key: "attendance", label: `Attendance concern (${counts.attendance})` },
                { key: "eal", label: `EAL (${counts.eal})` },
                { key: "medical", label: `Medical alerts (${counts.medical})` },
              ] as const
            ).map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFlagFilter(chip.key)}
                className={
                  flagFilter === chip.key
                    ? "rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white"
                    : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/70"
                }
              >
                {chip.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{filtered.length}</strong> of {PUPILS.length} pupils
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setYearGroup("All year groups");
                setStatus("All statuses");
                setFlagFilter("all");
              }}
              className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-10">
                  <input
                    aria-label="Select all pupils"
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-input text-brand accent-brand"
                  />
                </TableHead>
                <TableHead>Pupil</TableHead>
                <TableHead>Statutory identifiers</TableHead>
                <TableHead>Academic grouping</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Attendance YTD</TableHead>
                <TableHead>Indicators</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pupil) => (
                <TableRow key={pupil.id} className="group">
                  <TableCell>
                    <input
                      aria-label={`Select ${pupil.legalForename} ${pupil.legalSurname}`}
                      type="checkbox"
                      checked={selected.has(pupil.id)}
                      onChange={(event) => toggleOne(pupil.id, event.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-input text-brand accent-brand"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-semibold text-brand">
                        {pupil.initials}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold text-foreground group-hover:text-brand">
                          {pupil.legalForename} {pupil.legalSurname}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          DOB: {pupil.dob} ({pupil.age.split(" ")[0]}) · {pupil.gender}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 font-mono text-sm text-foreground">
                        {pupil.upn}
                        <Copy className="h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground" />
                      </span>
                      <span className="text-xs text-muted-foreground">Adm: {pupil.admissionNo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {pupil.yearGroup} · {pupil.form}
                      </span>
                      <span className="text-xs text-muted-foreground">Tutor: {pupil.tutor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {pupil.house}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={ATTENDANCE_TONE[pupil.attendanceTone]}>{pupil.attendance.toFixed(1)}%</StatusPill>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {pupil.flags.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        pupil.flags.map((flag) => (
                          <StatusPill key={flag.label} tone={flag.tone === "brand" ? "brand" : flag.tone === "info" ? "info" : "neutral"} className="text-[11px]">
                            {flag.label}
                          </StatusPill>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone="success">{pupil.status}</StatusPill>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/pupils/${pupil.id}`}
                        className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand-tint"
                      >
                        View dossier
                      </Link>
                      <button type="button" className="rounded p-1 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-[18px] w-[18px]" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                    No pupils match these filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border p-4 text-sm text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
            <strong className="text-foreground">{PUPILS.length}</strong> demo records (full roll: 1,239)
          </span>
        </div>
      </div>

      {/* Census validator tray */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-card p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-success-bg text-success-text">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Statutory Autumn Census 2025 audit ready</span>
              <StatusPill tone="success">100% validated</StatusPill>
            </div>
            <p className="text-sm text-muted-foreground">
              1,239 UPN records verified with zero blocking syntax errors. Last automated check today at 07:15.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline">View validation log</Button>
          <Button className="bg-brand text-white hover:bg-brand-hover">Stage for DfE Collect</Button>
        </div>
      </div>
    </AppShell>
  );
}
