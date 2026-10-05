import type { Metadata } from "next";
import { cookies } from "next/headers";

import { MedicalWorkspace } from "@/components/dashboard/medical/medical-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Medical Dashboard",
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

export default async function MedicalDashboardPage() {
  const user = await requireAnyRole(["MEDICAL"]);
  const token = (await cookies()).get("session_token")?.value;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return <MedicalWorkspace user={user} pupilCount={null} academicYear={null} today={today} />;
  }

  const structure = await loadDashboardData<{ currentAcademicYear: { code: string } | null }>(
    "/erp/academic-structure",
    token,
  );

  return (
    <MedicalWorkspace
      user={user}
      pupilCount={null}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      today={today}
    />
  );
}
