import type { Metadata } from "next";
import { cookies } from "next/headers";

import { SencoWorkspace } from "@/components/dashboard/senco/senco-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "SENCO Dashboard",
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

export default async function SencoDashboardPage() {
  const user = await requireAnyRole(["SENCO", "DEPUTY_SENCO"]);
  const token = (await cookies()).get("session_token")?.value;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return <SencoWorkspace user={user} pupilCount={null} academicYear={null} today={today} />;
  }

  const [pupilData, structure] = await Promise.all([
    loadDashboardData<{ total: number }>("/erp/pupils/count", token),
    loadDashboardData<{ currentAcademicYear: { code: string } | null }>("/erp/academic-structure", token),
  ]);

  return (
    <SencoWorkspace
      user={user}
      pupilCount={pupilData?.total ?? null}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      today={today}
    />
  );
}
