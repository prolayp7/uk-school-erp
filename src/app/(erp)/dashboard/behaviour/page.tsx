import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  BehaviourWorkspace,
  type BehaviourSummary,
} from "@/components/dashboard/behaviour/behaviour-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Behaviour Dashboard",
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

export default async function BehaviourDashboardPage() {
  const user = await requireAnyRole([
    "HEADTEACHER",
    "SLT",
    "ADMIN",
    "TEACHER",
    "DSL",
    "DEPUTY_DSL",
    "SENCO",
    "DEPUTY_SENCO",
  ]);
  const token = (await cookies()).get("session_token")?.value;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return <BehaviourWorkspace user={user} summary={null} academicYear={null} today={today} />;
  }

  const [summary, structure] = await Promise.all([
    loadDashboardData<BehaviourSummary>("/erp/behaviour/reports/summary", token),
    loadDashboardData<{ currentAcademicYear: { code: string } | null }>("/erp/academic-structure", token),
  ]);

  return (
    <BehaviourWorkspace
      user={user}
      summary={summary ?? null}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      today={today}
    />
  );
}
