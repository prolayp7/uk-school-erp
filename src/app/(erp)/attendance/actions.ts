"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";

export type AttendanceActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

async function sessionContext(): Promise<{ token: string; schoolId: string } | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const token = (await cookies()).get("session_token")?.value;
  const schoolId = user.schools[0]?.id;
  return token && schoolId ? { token, schoolId } : null;
}

export async function createAttendanceSession(
  _previousState: AttendanceActionState,
  formData: FormData,
): Promise<AttendanceActionState> {
  const context = await sessionContext();
  if (!context) return { status: "error", message: "Your session or school selection has expired. Sign in again to continue." };

  const sessionDate = String(formData.get("sessionDate") ?? "");
  const sessionType = String(formData.get("sessionType") ?? "");
  const classGroupId = String(formData.get("classGroupId") ?? "");
  const lessonPeriod = String(formData.get("lessonPeriod") ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sessionDate) || !["morning", "afternoon", "lesson"].includes(sessionType)) {
    return { status: "error", message: "Select a valid date and session type." };
  }
  if (sessionType === "lesson" && (!classGroupId || !lessonPeriod)) {
    return { status: "error", message: "Lesson sessions need an assigned class and period." };
  }

  let session: { id: string };
  try {
    session = await apiRequest<{ id: string }>("/erp/attendance/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.token}`,
        "Content-Type": "application/json",
        "x-school-id": context.schoolId,
      },
      body: JSON.stringify({
        sessionDate,
        sessionType,
        ...(sessionType === "lesson" ? { classGroupId, lessonPeriod } : {}),
      }),
    });
  } catch {
    return { status: "error", message: "The session could not be opened for your role or class assignment." };
  }

  redirect(`/attendance?sessionId=${encodeURIComponent(session.id)}`);
}

export async function saveAttendanceMarks(
  _previousState: AttendanceActionState,
  formData: FormData,
): Promise<AttendanceActionState> {
  const context = await sessionContext();
  if (!context) return { status: "error", message: "Your session or school selection has expired. Sign in again to continue." };

  const sessionId = String(formData.get("sessionId") ?? "");
  const records = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("mark_"))
    .map(([key, value]) => {
      const pupilId = key.slice("mark_".length);
      const reason = String(formData.get(`reason_${pupilId}`) ?? "").trim();
      return {
        pupilId,
        attendanceCode: String(value),
        ...(reason ? { reason } : {}),
      };
    });
  if (!sessionId || records.length === 0 || records.some(({ attendanceCode }) => !attendanceCode)) {
    return { status: "error", message: "Choose an attendance code for each pupil before saving." };
  }

  try {
    const result = await apiRequest<{ changed: number }>(
      `/erp/attendance/sessions/${encodeURIComponent(sessionId)}/records`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${context.token}`,
          "Content-Type": "application/json",
          "x-school-id": context.schoolId,
        },
        body: JSON.stringify({ records }),
      },
    );
    revalidatePath("/attendance");
    revalidatePath("/dashboard/headteacher");
    return {
      status: "success",
      message: `${result.changed} attendance mark${result.changed === 1 ? "" : "s"} saved.`,
    };
  } catch {
    return { status: "error", message: "Marks could not be saved. Your class or school access may have changed." };
  }
}
