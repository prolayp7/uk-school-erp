import type { Metadata } from "next";
import { cookies } from "next/headers";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { AppShell } from "@/components/shell/app-shell";
import { apiRequest } from "@/lib/api";
import type { CurrentUser } from "@/lib/session";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
	title: "Parents & Carers Portal",
};

type ParentChildSummary = {
	id: string;
	schoolId: string;
	relationship: string;
	admissionNumber: string;
	name: string;
	yearGroup: string | null;
	form: string | null;
	attendanceRate: number;
	totalMarks: number;
	presentMarks: number;
};

function formatPercent(value: number): string {
	return `${value.toFixed(1)}%`;
}

async function loadChildren(token: string): Promise<ParentChildSummary[]> {
	try {
		return await apiRequest<ParentChildSummary[]>("/erp/parent/children", {
			headers: { Authorization: `Bearer ${token}` },
		});
	} catch {
		return [];
	}
}

function ParentPortalWorkspace({ user, linkedChildren }: { user: CurrentUser; linkedChildren: ParentChildSummary[] }) {
	const totalAttendance = linkedChildren.length
		? linkedChildren.reduce((sum, child) => sum + child.attendanceRate, 0) / linkedChildren.length
		: 0;

	return (
		<AppShell
			activePath="/parents-and-carers"
			user={{
				name: user.email.split("@")[0] ?? user.email,
				role: "Parent / Carer",
				initials: "PC",
			}}
			academicYear="2025–2026"
			academicTerm="Autumn Term"
			schoolName={user.schools[0]?.name ?? "School workspace"}
			schoolContext={user.schools[0]?.code ?? "School portal"}
			systemStatusLabel="Parent portal active"
			showNavigationBadges={false}
			showSystemVersion={false}
		>
			<div className="flex flex-col gap-5">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
							<span>Overview</span>
							<span aria-hidden="true">/</span>
							<span className="font-semibold text-brand">Parents &amp; carers</span>
						</div>
						<h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
							Connected family access
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Secure child view for attendance, school communication and linked pupil information.
						</p>
					</div>
					<StatusPill tone="info" className="self-start">
						{linkedChildren.length} linked child{linkedChildren.length === 1 ? "" : "ren"}
					</StatusPill>
				</header>

				<section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
					<KpiCard
						label="Linked children"
							value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{linkedChildren.length}</span>}
						meta={<span>Portal access enabled</span>}
						accent="bg-brand"
					/>
					<KpiCard
						label="Average attendance"
						value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{formatPercent(totalAttendance)}</span>}
						meta={<span>Across linked pupils</span>}
						accent="bg-success-text"
					/>
					<KpiCard
						label="Current focus"
							value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">{linkedChildren[0]?.name ? "Live" : "—"}</span>}
							meta={<span>{linkedChildren[0]?.name ?? "No pupil record yet"}</span>}
						accent="bg-info-text"
					/>
					<KpiCard
						label="Access level"
						value={<span className="font-heading text-3xl font-bold tabular-nums text-foreground">Safe</span>}
						meta={<span>Restricted to your linked children only</span>}
						accent="bg-warning-text"
					/>
				</section>

				<SectionCard icon={<span className="text-base">👨‍👩‍👧</span>} title="Your children" subtitle="The portal remains scoped to your linked pupils only">
					{linkedChildren.length === 0 ? (
						<p className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
							No linked children are currently available in the portal. Once the school grants access, this list will show attendance and key school information for each child.
						</p>
					) : (
						<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
							{linkedChildren.map((child) => (
								<article key={child.id} className="rounded-xl border border-border bg-card p-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{child.relationship}</p>
											<h2 className="mt-1 text-lg font-semibold text-foreground">{child.name}</h2>
										</div>
										<StatusPill tone={child.attendanceRate >= 90 ? "success" : "warning"}>
											{formatPercent(child.attendanceRate)}
										</StatusPill>
									</div>

									<dl className="mt-4 space-y-2 text-sm text-muted-foreground">
										<div className="flex items-center justify-between gap-4">
											<dt>Admission</dt>
											<dd className="font-medium text-foreground">{child.admissionNumber}</dd>
										</div>
										<div className="flex items-center justify-between gap-4">
											<dt>Year group</dt>
											<dd className="font-medium text-foreground">{child.yearGroup ?? "—"}</dd>
										</div>
										<div className="flex items-center justify-between gap-4">
											<dt>Form</dt>
											<dd className="font-medium text-foreground">{child.form ?? "—"}</dd>
										</div>
										<div className="flex items-center justify-between gap-4">
											<dt>Attendance</dt>
											<dd className="font-medium text-foreground">{child.presentMarks} / {child.totalMarks} marks</dd>
										</div>
									</dl>
								</article>
							))}
						</div>
					)}
				</SectionCard>
			</div>
		</AppShell>
	);
}

export default async function ParentCarerPortalPage() {
	const user = await requireAnyRole(["PARENT"]);
	const token = (await cookies()).get("session_token")?.value;

	if (!token) {
		return <ParentPortalWorkspace user={user} linkedChildren={[]} />;
	}

	const children = await loadChildren(token);
	return <ParentPortalWorkspace user={user} linkedChildren={children} />;
}
