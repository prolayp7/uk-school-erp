import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  AttendanceWorkspace,
  type AttendanceClassGroup,
  type AttendanceCode,
  type AttendanceRegister,
  type AttendanceSession,
} from "@/components/attendance/attendance-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Attendance Register",
};

const ATTENDANCE_ROLES = ["SUPER_ADMIN", "HEADTEACHER", "SLT", "ADMIN", "ATTENDANCE_OFFICER", "TEACHER"];

async function load<T>(path: string, token: string, schoolId: string): Promise<T | null> {
  try {
    return await apiRequest<T>(path, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-school-id": schoolId,
      },
    });
  } catch {
    return null;
  }
}

function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[]; sessionId?: string | string[] }>;
}) {
  const user = await requireAnyRole(ATTENDANCE_ROLES);
  const query = await searchParams;
  const requestedDate = typeof query.date === "string" ? query.date : undefined;
  const reportDate = validDate(requestedDate) ? requestedDate : new Date().toISOString().slice(0, 10);
  const selectedSessionId = typeof query.sessionId === "string" ? query.sessionId : undefined;
  const token = (await cookies()).get("session_token")?.value;
  const schoolId = user.schools[0]?.id;

  if (!token || !schoolId) {
    return (
      <AttendanceWorkspace
        user={user}
        classes={null}
        codes={[]}
        sessions={[]}
        register={null}
        reportDate={reportDate}
        selectedSessionId={selectedSessionId}
      />
    );
  }

  const [classData, codes, sessions, register] = await Promise.all([
    load<{ items: AttendanceClassGroup[] }>("/erp/attendance/class-groups", token, schoolId),
    load<AttendanceCode[]>("/erp/attendance/codes", token, schoolId),
    load<AttendanceSession[]>(`/erp/attendance/sessions?date=${encodeURIComponent(reportDate)}`, token, schoolId),
    selectedSessionId
      ? load<AttendanceRegister>(`/erp/attendance/sessions/${encodeURIComponent(selectedSessionId)}/register`, token, schoolId)
      : Promise.resolve(null),
  ]);

  return (
    <AttendanceWorkspace
      user={user}
      classes={classData?.items ?? null}
      codes={codes ?? []}
      sessions={sessions ?? []}
      register={register}
      reportDate={reportDate}
      selectedSessionId={selectedSessionId}
    />
  );
}
