import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  FinanceWorkspace,
  type FinanceBalanceReport,
} from "@/components/dashboard/finance/finance-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Finance Dashboard",
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

export default async function FinanceDashboardPage() {
  const user = await requireAnyRole(["FINANCE", "ADMIN"]);
  const token = (await cookies()).get("session_token")?.value;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return <FinanceWorkspace user={user} report={null} academicYear={null} today={today} />;
  }

  const [financeData, structure] = await Promise.all([
    loadDashboardData<FinanceBalanceReport>("/erp/finance/reports/balances", token),
    loadDashboardData<{ currentAcademicYear: { code: string } | null }> ("/erp/academic-structure", token),
  ]);

  return (
    <FinanceWorkspace
      user={user}
      report={financeData ?? null}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      today={today}
    />
  );
}
