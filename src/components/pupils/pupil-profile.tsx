"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  Award,
  BadgeCheck,
  BarChart3,
  Calendar,
  CheckCircle2,
  Contact,
  Copy,
  Edit3,
  FileText,
  Folder,
  Gavel,
  History,
  Layers,
  LayoutDashboard,
  ListChecks,
  Lock,
  Mail,
  MessageSquare,
  NotebookPen,
  Phone,
  Pill,
  Printer,
  Send,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { AppShell } from "@/components/shell/app-shell";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill, type PillTone } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { CarerDrawer } from "@/components/pupils/carer-drawer";
import { getCarers, type Carer, type Pupil } from "@/lib/pupils-data";

type TabDef = {
  key: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: PillTone;
  restricted?: boolean;
};

const TABS: TabDef[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "contacts", label: "Contacts", icon: Contact, badge: "2" },
  { key: "attendance", label: "Attendance", icon: ListChecks },
  { key: "behaviour", label: "Behaviour", icon: Gavel, badge: "2", badgeTone: "warning" },
  { key: "achievement", label: "Achievement", icon: Award, badge: "+18", badgeTone: "success" },
  { key: "send", label: "SEND", icon: Accessibility },
  { key: "medical", label: "Medical", icon: Siren, badge: "1 alert", badgeTone: "warning" },
  { key: "safeguarding", label: "Safeguarding", icon: ShieldAlert, restricted: true },
  { key: "assessments", label: "Assessments", icon: BarChart3 },
  { key: "exams", label: "Exams", icon: FileText },
  { key: "documents", label: "Documents", icon: Folder, badge: "4" },
  { key: "consent", label: "Consent", icon: BadgeCheck },
  { key: "comms", label: "Comms", icon: MessageSquare },
  { key: "audit", label: "Audit log", icon: History },
];

const TIMETABLE = [
  { code: "En", subject: "English Language", set: "Set 10A/En1 · Room 14", teacher: "Ms Jenkins", period: "P1 (09:05)" },
  { code: "Ma", subject: "Mathematics", set: "Set 10B/Ma2 · Room 22", teacher: "Mr Thorne", period: "P2 (10:05)" },
  { code: "Sc", subject: "Combined Science (Trilogy)", set: "Set 10B/Sc1 · Lab 3", teacher: "Mr Patel", period: "P3 (11:25)" },
  { code: "Hi", subject: "History GCSE", set: "Set 10/Hi3 · Room 08", teacher: "Mrs Wright", period: "P4 (13:15)" },
  { code: "DT", subject: "Design & Technology", set: "Workshop 1", teacher: "Mr O'Connor", period: "P5 (14:15)" },
];

const CONSENTS = [
  { label: "Media & photography", note: "Internal & print prospectus only (no web)" },
  { label: "Educational day visits", note: "Local authority catchment permitted" },
  { label: "Sex & relationships (RSE)", note: "Statutory Key Stage 4 curriculum" },
  { label: "Biometric cashless catering", note: "Fingerprint algorithm registered" },
];

export function PupilProfile({ pupil }: { pupil: Pupil }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [drawerCarer, setDrawerCarer] = useState<Carer | null>(null);
  const carers = getCarers(pupil);
  const hasMedical = pupil.flags.some((f) => f.label === "Medical" || f.label === "Asthma");
  const absentPct = Math.round(100 - pupil.attendance);
  const authorisedPct = Math.max(0, Math.round(absentPct * 0.4));
  const unauthorisedPct = Math.max(0, absentPct - authorisedPct);

  function openCarer(carer: Carer) {
    setDrawerCarer(carer);
  }

  const tabs = TABS.map((tab) =>
    tab.key === "attendance"
      ? {
          ...tab,
          badge: `${pupil.attendance.toFixed(1)}%`,
          badgeTone: (pupil.attendance < 90 ? "danger" : pupil.attendance < 95 ? "warning" : "success") as PillTone,
        }
      : tab
  );
  const activeDef = tabs.find((t) => t.key === activeTab);

  return (
    <AppShell
      activePath="/pupils"
      user={{ name: "Dr Rachel Holloway", role: "Headteacher & SLT", initials: "RH" }}
    >
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/pupils" className="transition-colors hover:text-brand">
            Pupils
          </Link>
          <span>/</span>
          <span className="rounded bg-muted px-2 py-0.5 text-sm font-medium text-foreground">
            {pupil.legalForename} {pupil.legalSurname}{" "}
            <span className="font-mono text-xs text-muted-foreground">(UPN: {pupil.upn})</span>
          </span>
        </nav>
        <div className="flex items-center gap-2">
          <StatusPill tone="success" icon={<span className="h-1.5 w-1.5 rounded-full bg-success-text" />}>
            DfE census ready
          </StatusPill>
          <StatusPill tone="neutral">ROLL-ID #{pupil.admissionNo.slice(-4)}</StatusPill>
        </div>
      </div>

      {/* Profile header */}
      <section className="relative overflow-hidden rounded-xl bg-card p-6 shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-tr-xl bg-gradient-to-bl from-brand-tint/60 via-transparent to-transparent" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-5 sm:flex-row">
            <div className="flex flex-shrink-0 flex-col items-center gap-2">
              <span className="flex h-24 w-24 items-center justify-center rounded-xl bg-brand text-2xl font-bold text-white shadow-sm sm:h-28 sm:w-28">
                {pupil.initials}
              </span>
              <StatusPill tone="success">On-Roll (FT)</StatusPill>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  {pupil.legalForename} {pupil.legalSurname}
                </h1>
                {pupil.preferredName ? (
                  <span className="text-sm text-muted-foreground">
                    Preferred: <strong className="text-foreground">{pupil.preferredName}</strong>
                  </span>
                ) : null}
                <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{pupil.pronoun}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-lg bg-muted/60 p-3 sm:grid-cols-3 lg:grid-cols-4">
                <IdentifierField label="UPN">
                  <span className="flex items-center gap-1 font-mono text-sm font-medium text-foreground">
                    {pupil.upn}
                    <Copy className="h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground" />
                  </span>
                </IdentifierField>
                <IdentifierField label="Admission no">
                  <span className="font-mono text-sm text-foreground">{pupil.admissionNo}</span>
                </IdentifierField>
                <IdentifierField label="Date of birth (age)">
                  <span className="text-sm font-medium text-foreground">
                    {pupil.dob} <span className="font-normal text-muted-foreground">({pupil.age})</span>
                  </span>
                </IdentifierField>
                <IdentifierField label="Enrolment date">
                  <span className="text-sm font-medium text-foreground">{pupil.enrolmentDate}</span>
                </IdentifierField>
                <IdentifierField label="Year & form group">
                  <span className="text-sm font-semibold text-brand">
                    {pupil.yearGroup} · {pupil.form}{" "}
                    <span className="text-xs font-normal text-muted-foreground">({pupil.tutor})</span>
                  </span>
                </IdentifierField>
                <IdentifierField label="House affiliation">
                  <span className="text-sm font-medium text-foreground">
                    {pupil.house} <span className="text-xs text-muted-foreground">({pupil.houseLead})</span>
                  </span>
                </IdentifierField>
                <IdentifierField label="Pupil premium">
                  <span className="text-sm font-medium text-foreground">
                    {pupil.pupilPremium ? "Eligible (Ever 6 FSM)" : "Not eligible"}
                  </span>
                </IdentifierField>
                <IdentifierField label="SEN status">
                  <span className="text-sm font-medium text-muted-foreground">
                    {pupil.sendCode ? `SEND Support (Code ${pupil.sendCode})` : "No SEN recorded (N)"}
                  </span>
                </IdentifierField>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {pupil.attendance < 90 ? (
                  <StatusPill tone="danger" icon={<Siren className="h-4 w-4" />}>
                    Attendance YTD: {pupil.attendance.toFixed(1)}% (persistent absence trigger)
                  </StatusPill>
                ) : null}
                {pupil.pupilPremium ? (
                  <StatusPill tone="neutral" icon={<Sparkles className="h-4 w-4" />}>
                    PP Ever 6 FSM
                  </StatusPill>
                ) : null}
                {hasMedical ? (
                  <StatusPill tone="warning" icon={<Pill className="h-4 w-4" />}>
                    Medical protocol on file
                  </StatusPill>
                ) : null}
                <StatusPill tone="brand" icon={<Lock className="h-4 w-4" />}>
                  Safeguarding vault: DSL access only
                </StatusPill>
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 flex-row gap-2 xl:w-52 xl:flex-col">
            <Button asChild className="w-full gap-2 bg-brand text-white hover:bg-brand-hover">
              <Link href={`/pupils/${pupil.id}/edit`}>
                <Edit3 className="h-4 w-4" />
                Edit pupil record
              </Link>
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Printer className="h-4 w-4 text-muted-foreground" />
              Summary sheet
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <NotebookPen className="h-4 w-4 text-muted-foreground" />
              Log pastoral note
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Send className="h-4 w-4 text-muted-foreground" />
              Timetable slip
            </Button>
          </div>
        </div>
      </section>

      {/* Tab strip */}
      <div className="overflow-x-auto rounded-xl bg-card p-1.5 shadow-sm">
        <div role="tablist" className="flex min-w-max items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const isContacts = tab.key === "contacts";
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => (isContacts ? openCarer(carers[0]) : setActiveTab(tab.key))}
                className={
                  isActive
                    ? "flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white shadow-sm"
                    : "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                }
              >
                <tab.icon className={isActive ? "h-[18px] w-[18px]" : tab.restricted ? "h-[18px] w-[18px] text-brand" : "h-[18px] w-[18px]"} />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span
                    className={
                      isActive
                        ? "rounded-full bg-white/20 px-1.5 py-0.5 text-[11px] font-bold"
                        : `rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                            tab.badgeTone === "danger"
                              ? "bg-danger-bg text-danger-text"
                              : tab.badgeTone === "warning"
                                ? "bg-warning-bg text-warning-text"
                                : tab.badgeTone === "success"
                                  ? "bg-success-bg text-success-text"
                                  : "bg-muted text-muted-foreground"
                          }`
                    }
                  >
                    {tab.badge}
                  </span>
                ) : null}
                {tab.restricted ? <Lock className="h-3.5 w-3.5 text-brand" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* LEFT */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <SectionCard title="Demographics & identity" subtitle="Statutory DfE">
              <div className="space-y-3 pt-1 text-sm">
                <Row label="Home first language" value="English (ENG)" />
                <Row label="Ethnicity / cultural code" value="White — British (WBRI)" />
                <Row
                  label="FSM eligibility status"
                  value={pupil.pupilPremium ? "Active FSM verified" : "Not eligible"}
                  tone={pupil.pupilPremium ? "success" : undefined}
                />
                <Row label="Pupil premium category" value={pupil.pupilPremium ? "Deprivation (Ever 6)" : "N/A"} />
                <Row label="National insurance verified" value="Yes (LA match)" icon={CheckCircle2} />
                <Row label="Nationality & country of birth" value="British · United Kingdom" />
              </div>
            </SectionCard>

            <SectionCard
              title="Parent / carer contacts"
              action={<StatusPill tone="brand">{carers.length} linked</StatusPill>}
            >
              <div className="flex flex-col gap-3 pt-1">
                {carers.map((carer) => (
                  <div key={carer.name} className="rounded-lg bg-muted/60 p-3 transition-colors hover:bg-muted">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{carer.name}</span>
                          <StatusPill tone={carer.priority === 1 ? "brand" : "neutral"}>
                            Priority {carer.priority}
                          </StatusPill>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {carer.relationship} · Parental responsibility:{" "}
                          <strong className="text-foreground">{carer.parentalResponsibility ? "Yes" : "No"}</strong>
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => openCarer(carer)} className="flex-shrink-0 gap-1">
                        Details
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-sm">
                      <span className="flex items-center gap-2 text-foreground">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono text-xs">{carer.mobile}</span>
                      </span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate text-xs">{carer.email}</span>
                      </span>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                  <strong className="font-semibold uppercase tracking-wider text-foreground">
                    Emergency collection PIN
                  </strong>
                  <p className="mt-1">
                    Additional authorised adults for unplanned collection are recorded on file with a security
                    passphrase.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* MIDDLE */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <SectionCard
              title="Attendance performance"
              action={
                pupil.attendance < 90 ? <StatusPill tone="danger">Stage 2 review</StatusPill> : <StatusPill tone="success">On track</StatusPill>
              }
            >
              <div className="flex items-center gap-4 py-2">
                <AttendanceGauge value={pupil.attendance} />
                <div className="flex-1 space-y-2 text-sm">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Authorised absence</span>
                      <span className="font-mono text-foreground">{authorisedPct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-warning-text" style={{ width: `${authorisedPct * 3}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Unauthorised</span>
                      <span className="font-mono font-bold text-danger-text">{unauthorisedPct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-danger-text" style={{ width: `${unauthorisedPct * 3}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              {pupil.attendance < 90 ? (
                <div className="mt-1 flex items-start gap-2.5 rounded-lg bg-danger-bg p-3 text-sm text-danger-text">
                  <Siren className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" />
                  <p>
                    <span className="font-semibold">Statutory attendance contract:</span> persistent absence
                    threshold breached (&lt;90%). Stage 2 review meeting scheduled with the head of year and
                    attendance officer.
                  </p>
                </div>
              ) : null}
            </SectionCard>

            <SectionCard
              icon={<Calendar className="h-5 w-5" />}
              title="Current timetable & sets"
              action={<span className="font-mono text-xs text-muted-foreground">Week A · Autumn</span>}
            >
              <div className="space-y-2.5 pt-1">
                {TIMETABLE.map((row) => (
                  <div key={row.subject} className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-tint text-xs font-bold text-brand">
                        {row.code}
                      </span>
                      <div>
                        <span className="block text-sm font-medium text-foreground">{row.subject}</span>
                        <span className="text-xs text-muted-foreground">{row.set}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="block text-sm font-medium text-foreground">{row.teacher}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{row.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <SectionCard
              icon={<Award className="h-5 w-5" />}
              title="Behaviour & conduct"
              action={<span className="text-xs text-muted-foreground">{pupil.house} House</span>}
            >
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-success-bg p-3 text-center">
                  <span className="block font-heading text-2xl font-bold leading-none text-success-text">+18</span>
                  <span className="mt-1 block text-xs text-success-text">Merits recorded</span>
                </div>
                <div className="rounded-lg bg-warning-bg p-3 text-center">
                  <span className="block font-heading text-2xl font-bold leading-none text-warning-text">2</span>
                  <span className="mt-1 block text-xs text-warning-text">C1 negative flags</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                  <Gavel className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning-text" />
                  <div>
                    <span className="font-semibold text-foreground">C1 warning (lateness to PM registration)</span>
                    <p className="text-xs text-muted-foreground">17/10/2025 · 12 minutes late without note</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                  <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-text" />
                  <div>
                    <span className="font-semibold text-foreground">+3 merits in Science</span>
                    <p className="text-xs text-muted-foreground">14/10/2025 · Exceptional lab practical report</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={<Pill className="h-5 w-5" />}
              title="Medical protocol"
              action={hasMedical ? <StatusPill tone="warning">Action plan</StatusPill> : <StatusPill tone="neutral">None active</StatusPill>}
            >
              {hasMedical ? (
                <>
                  <div className="mb-3 space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
                    <Row label="Condition" value="Mild chronic asthma" />
                    <Row label="Prescribed medication" value="Salbutamol / Ventolin (100mcg)" />
                    <Row label="Storage location" value="Room S04 + carried on person" />
                  </div>
                  <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-success-text" />
                    Lead first aider: Nurse H. Gallagher (Ext. 404)
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No medical protocol on file for this pupil.</p>
              )}
            </SectionCard>

            <SectionCard
              icon={<Layers className="h-5 w-5" />}
              title="Statutory consents"
              action={<span className="text-xs text-muted-foreground">All active</span>}
            >
              <ul className="space-y-2.5 pt-1 text-sm">
                {CONSENTS.map((consent) => (
                  <li key={consent.label} className="flex items-start justify-between gap-2">
                    <div>
                      <span className="block font-medium text-foreground">{consent.label}</span>
                      <span className="text-xs text-muted-foreground">{consent.note}</span>
                    </div>
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-text" />
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-card p-16 text-center shadow-sm">
          {activeDef ? <activeDef.icon className="h-8 w-8 text-muted-foreground/60" /> : null}
          <p className="text-sm font-medium text-foreground">{activeDef?.label} isn&apos;t built yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            This module is next in the design queue — the tab is shown so the full pupil record IA reads
            correctly.
          </p>
        </div>
      )}

      {/* Census validator bar */}
      <aside className="sticky bottom-3 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-foreground p-3.5 text-background shadow-xl">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-success-text text-white">
            <CheckCircle2 className="h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-background">Autumn 2025 DfE school census record status</span>
              <span className="rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-bold text-success-text">
                Passed 48/48 rules
              </span>
            </div>
            <span className="text-xs text-background/70">
              UPN: {pupil.upn} · Universal enrolment status: complete
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            Re-validate XML
          </Button>
          <Button size="sm" className="gap-1.5 bg-brand text-white hover:bg-brand-hover">
            DfE pupil dossier
          </Button>
        </div>
      </aside>

      <CarerDrawer
        carer={drawerCarer}
        pupil={pupil}
        open={drawerCarer !== null}
        onOpenChange={(open) => !open && setDrawerCarer(null)}
      />
    </AppShell>
  );
}

function IdentifierField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone?: "success";
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-muted-foreground">{label}</span>
      {tone === "success" ? (
        <span className="rounded bg-success-bg px-2 py-0.5 text-sm font-medium text-success-text">{value}</span>
      ) : Icon ? (
        <span className="flex items-center gap-1 text-sm font-medium text-success-text">
          <Icon className="h-4 w-4" /> {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}

function AttendanceGauge({ value }: { value: number }) {
  const circumference = 100;
  const tone = value < 90 ? "text-danger-text" : value < 95 ? "text-warning-text" : "text-success-text";
  return (
    <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-muted"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className={tone}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${value}, ${circumference}`}
          strokeLinecap="round"
          strokeWidth="3.5"
        />
      </svg>
      <div className={`absolute flex flex-col items-center justify-center text-center ${tone}`}>
        <span className="font-heading text-lg font-bold leading-none">{value.toFixed(1)}%</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase text-muted-foreground">YTD rate</span>
      </div>
    </div>
  );
}
