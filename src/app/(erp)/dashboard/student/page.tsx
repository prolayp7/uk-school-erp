import type { Metadata } from "next";
import { cookies } from "next/headers";

import { StudentWorkspace } from "@/components/dashboard/student/student-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

type StudentSummary = {
  pupilId: string;
  name: string;
  admissionNumber: string;
  status: string;
  yearGroup: string | null;
  form: string | null;
  attendanceRate: number;
  totalMarks: number;
  presentMarks: number;
};

type StudentAttendance = {
  pupilId: string | null;
  items: Array<{
    attendanceCode: string;
    markedAt: string;
    session: { sessionDate: string; sessionType: string };
    code: { description: string; markType: string };
  }>;
};

type StudentTimetable = {
  pupilId: string | null;
  items: Array<{
    dayOfWeek: number;
    startsAt: string;
    endsAt: string;
    room: string | null;
    classCode: string;
    yearGroup: string;
    subject: { code: string; name: string };
  }>;
};

export const metadata: Metadata = {
  title: "Student Portal",
};

async function loadAcademicStructure(token: string) {
  try {
    return await apiRequest<{ currentAcademicYear: { code: string } | null }>("/erp/academic-structure", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}

async function loadStudentSummary(token: string): Promise<StudentSummary | null> {
  try {
    return await apiRequest<StudentSummary>("/erp/student/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}

async function loadStudentAttendance(token: string): Promise<StudentAttendance | null> {
  try {
    return await apiRequest<StudentAttendance>("/student/attendance", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}

async function loadStudentTimetable(token: string): Promise<StudentTimetable | null> {
  try {
    return await apiRequest<StudentTimetable>("/student/timetable", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}

export default async function StudentDashboardPage() {
  const user = await requireAnyRole(["STUDENT"]);
  const token = (await cookies()).get("session_token")?.value;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return <StudentWorkspace user={user} academicYear={null} today={today} attendanceRate={null} />;
  }

  const [structure, studentSummary, attendance, timetable] = await Promise.all([
    loadAcademicStructure(token),
    loadStudentSummary(token),
    loadStudentAttendance(token),
    loadStudentTimetable(token),
  ]);

  return (
    <StudentWorkspace
      user={user}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      today={today}
      attendanceRate={studentSummary?.attendanceRate ?? null}
      totalMarks={studentSummary?.totalMarks ?? null}
      presentMarks={studentSummary?.presentMarks ?? null}
      yearGroup={studentSummary?.yearGroup ?? null}
      form={studentSummary?.form ?? null}
      recentAttendance={attendance?.items ?? null}
      timetable={timetable?.items ?? null}
    />
  );
}
