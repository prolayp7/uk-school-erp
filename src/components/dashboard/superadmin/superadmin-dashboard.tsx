import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import type { CurrentUser } from "@/lib/session";

export type AcademicStructure = {
  currentAcademicYear: { code: string } | null;
  yearGroups: Array<{ id: string; code: string; name: string; keyStage: string }>;
  forms: Array<{ id: string; code: string; yearGroupId: string }>;
  houses: Array<{ id: string; code: string; name: string }>;
  subjects: Array<{ id: string; code: string; name: string }>;
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Superadministrator",
  HEADTEACHER: "Headteacher",
  SLT: "Senior leadership",
  ADMIN: "Administrator",
  TEACHER: "Teacher",
  DSL: "Designated safeguarding lead",
  SENCO: "SENCO",
  FINANCE: "Finance",
  MEDICAL: "Medical staff",
  PARENT: "Parent or carer",
  STUDENT: "Student",
};

const PERMISSION_LABELS: Record<string, string> = {
  "school.read": "View school profile",
  "school.members.read": "View school memberships",
  "school.members.manage": "Manage school memberships",
  "school.roles.manage": "Manage role assignments",
  "audit.read": "Read audit events",
};

const MODULE_LINKS = [
  { href: "/pupils", title: "Pupil records", icon: Users },
  { href: "/admissions", title: "Admissions", icon: ClipboardCheck },
  { href: "/parents-and-carers", title: "Parents & carers", icon: GraduationCap },
] as const;

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split(/[._-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getAccountName(email: string): string {
  return formatLabel(email.split("@")[0] ?? email);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getCurrentTermName(date: Date): string {
  const month = date.getMonth() + 1;
  if (month >= 9) return "Autumn Term";
  if (month <= 3) return "Spring Term";
  return "Summer Term";
}

export function SuperadminDashboard({
  user,
  structure,
}: {
  user: CurrentUser;
  structure: AcademicStructure | null;
}) {
  const accountName = getAccountName(user.email);
  const primarySchool = user.schools[0];
  const academicYear = structure?.currentAcademicYear?.code.replace("/", "–") ?? "Not configured";

  return (
    <AppShell
      activePath="/dashboard"
      user={{
        name: accountName,
        role: "Superadministrator",
        initials: getInitials(accountName),
      }}
      academicYear={academicYear}
      academicTerm={structure?.currentAcademicYear ? getCurrentTermName(new Date()) : ""}
      schoolName={primarySchool?.name ?? "School administration"}
      schoolContext={primarySchool?.code ?? "No school assigned"}
      systemStatusLabel="Session verified"
      showNavigationBadges={false}
      showSystemVersion={false}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Administration</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-brand">Superadmin</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
              Superadmin workspace
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              School access, account permissions, and academic setup.
            </p>
          </div>
          <StatusPill tone="success" icon={<Check className="h-3.5 w-3.5" />} className="self-start">
            Access verified
          </StatusPill>
        </header>

        <section aria-label="Account overview" className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <KpiCard
            label="Schools in scope"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{user.schools.length}</span>}
            meta={<span>Active school memberships</span>}
          />
          <KpiCard
            label="Assigned roles"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{user.roles.length}</span>}
            meta={<span>{user.roles.map((role) => ROLE_LABELS[role] ?? formatLabel(role)).join(", ") || "No roles assigned"}</span>}
          />
          <KpiCard
            label="Granted permissions"
            value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{user.permissions.length}</span>}
            meta={<span>Resolved from your active roles</span>}
          />
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <SectionCard
            icon={<Building2 className="h-5 w-5" />}
            title="School access"
            subtitle="Schools attached to this account"
          >
            {user.schools.length > 0 ? (
              <div className="divide-y divide-border">
                {user.schools.map((school) => (
                  <div key={school.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-1">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{school.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{school.code}</p>
                    </div>
                    <StatusPill tone="success">Accessible</StatusPill>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-3 text-sm text-muted-foreground">No active school memberships are attached to this account.</p>
            )}
          </SectionCard>

          <SectionCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Account permissions"
            subtitle="Capabilities granted to this account"
          >
            {user.permissions.length > 0 ? (
              <ul className="divide-y divide-border">
                {user.permissions.map((permission) => (
                  <li key={permission} className="flex items-center justify-between gap-3 py-2.5 first:pt-1">
                    <span className="text-sm text-foreground">
                      {PERMISSION_LABELS[permission] ?? formatLabel(permission)}
                    </span>
                    <Check className="h-4 w-4 shrink-0 text-success-text" aria-label="Granted" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-muted-foreground">No permissions are assigned to this account.</p>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
          <SectionCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Academic structure"
            subtitle={structure?.currentAcademicYear?.code ?? "Current school setup"}
          >
            {structure ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 py-2 sm:grid-cols-4">
                {[
                  ["Year groups", structure.yearGroups.length],
                  ["Forms", structure.forms.length],
                  ["Subjects", structure.subjects.length],
                  ["Houses", structure.houses.length],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-heading text-2xl font-bold tabular-nums text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="rounded-lg border border-warning-border bg-warning-bg px-3 py-2.5 text-sm text-warning-text">
                Academic structure could not be loaded. School and permission data remain available.
              </p>
            )}
          </SectionCard>

          <SectionCard
            icon={<Users className="h-5 w-5" />}
            title="School modules"
            subtitle="Open an available ERP area"
          >
            <nav aria-label="School modules" className="divide-y divide-border">
              {MODULE_LINKS.map(({ href, title, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between gap-3 py-3 first:pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
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