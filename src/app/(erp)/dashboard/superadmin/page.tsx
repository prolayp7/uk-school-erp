import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  SuperadminDashboard,
  type AcademicStructure,
} from "@/components/dashboard/superadmin/superadmin-dashboard";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Superadmin Workspace",
};

export default async function SuperadminDashboardPage() {
  const user = await requireAnyRole(["SUPER_ADMIN"]);
  const token = (await cookies()).get("session_token")?.value;
  let structure: AcademicStructure | null = null;

  if (token) {
    try {
      structure = await apiRequest<AcademicStructure>("/erp/academic-structure", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      structure = null;
    }
  }

  return <SuperadminDashboard user={user} structure={structure} />;
}