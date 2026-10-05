import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  DslWorkspace,
  type SafeguardingCaseSummary,
} from "@/components/dashboard/dsl/dsl-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Safeguarding Dashboard",
};

async function loadDashboardData<T>(path: string, token: string): Promise<T | null> {
  try {
    return await apiRequest<T>(path, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}

export default async function DslDashboardPage() {
  const user = await requireAnyRole(["DSL", "DEPUTY_DSL"]);
  const token = (await cookies()).get("session_token")?.value;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return <DslWorkspace user={user} cases={null} academicYear={null} today={today} />;
  }

  const [caseData, structure] = await Promise.all([
    loadDashboardData<{ items: SafeguardingCaseSummary[]; total: number }>("/erp/safeguarding/cases", token),
    loadDashboardData<{ currentAcademicYear: { code: string } | null }>("/erp/academic-structure", token),
  ]);

  return (
    <DslWorkspace
      user={user}
      cases={caseData?.items ?? null}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      today={today}
    />
  );
}
