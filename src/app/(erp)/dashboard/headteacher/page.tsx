import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  HeadteacherWorkspace,
  type AttendanceCode,
  type AttendanceReport,
} from "@/components/dashboard/headteacher/headteacher-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Senior Leadership Dashboard",
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

export default async function HeadteacherDashboardPage() {
  const user = await requireAnyRole(["HEADTEACHER", "SLT"]);
  const token = (await cookies()).get("session_token")?.value;
  const reportDate = new Date().toISOString().slice(0, 10);

  if (!token) {
    return (
      <HeadteacherWorkspace
        user={user}
        attendanceReport={null}
        attendanceCodes={[]}
        pupilCount={null}
        yearGroupCount={null}
        formCount={null}
        subjectCount={null}
        academicYear={null}
        reportDate={reportDate}
      />
    );
  }

  const [attendanceReport, attendanceCodes, pupilData, structure] = await Promise.all([
    loadDashboardData<AttendanceReport>(
      `/erp/reports/attendance?period=week&date=${reportDate}`,
      token,
    ),
    loadDashboardData<AttendanceCode[]>("/erp/attendance/codes", token),
    loadDashboardData<{ total: number }>("/erp/pupils", token),
    loadDashboardData<{
      currentAcademicYear: { code: string } | null;
      yearGroups: unknown[];
      forms: unknown[];
      subjects: unknown[];
    }>("/erp/academic-structure", token),
  ]);

  return (
    <HeadteacherWorkspace
      user={user}
      attendanceReport={attendanceReport}
      attendanceCodes={attendanceCodes ?? []}
      pupilCount={pupilData?.total ?? null}
      yearGroupCount={structure?.yearGroups.length ?? null}
      formCount={structure?.forms.length ?? null}
      subjectCount={structure?.subjects.length ?? null}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      reportDate={reportDate}
    />
  );
}
