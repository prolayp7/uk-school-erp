import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  TeacherWorkspace,
  type TeacherClass,
  type TeacherCurriculumPlan,
} from "@/components/dashboard/teacher/teacher-workspace";
import { apiRequest } from "@/lib/api";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Teacher Dashboard",
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

export default async function TeacherDashboardPage() {
  const user = await requireAnyRole(["TEACHER"]);
  const token = (await cookies()).get("session_token")?.value;
  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return (
      <TeacherWorkspace
        user={user}
        classes={null}
        curriculumPlans={null}
        academicYear={null}
        today={today}
      />
    );
  }

  const [classData, curriculumData, structure] = await Promise.all([
    loadDashboardData<{ items: TeacherClass[]; total: number }>("/erp/classes", token),
    loadDashboardData<{ items: TeacherCurriculumPlan[]; total: number }>("/erp/curriculum/plans", token),
    loadDashboardData<{ currentAcademicYear: { code: string } | null }>("/erp/academic-structure", token),
  ]);

  return (
    <TeacherWorkspace
      user={user}
      classes={classData?.items ?? null}
      curriculumPlans={curriculumData?.items ?? null}
      academicYear={structure?.currentAcademicYear?.code ?? null}
      today={today}
    />
  );
}
