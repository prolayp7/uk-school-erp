"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";

export type InterventionActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createAttendanceIntervention(
  _previousState: InterventionActionState,
  formData: FormData,
): Promise<InterventionActionState> {
  const user = await getCurrentUser();
  if (!user || !user.roles.some((role) => ["HEADTEACHER", "SLT"].includes(role))) {
    return { status: "error", message: "You are not authorised to create attendance interventions." };
  }

  const pupilId = String(formData.get("pupilId") ?? "");
  const startsOn = String(formData.get("startsOn") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!pupilId || !/^\d{4}-\d{2}-\d{2}$/.test(startsOn) || reason.length < 3 || reason.length > 240) {
    return { status: "error", message: "Enter a start date and a reason between 3 and 240 characters." };
  }

  const token = (await cookies()).get("session_token")?.value;
  if (!token) {
    return { status: "error", message: "Your session has expired. Sign in again to continue." };
  }

  try {
    await apiRequest(`/erp/pupils/${encodeURIComponent(pupilId)}/attendance/interventions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-school-id": user.schools[0]?.id ?? "",
      },
      body: JSON.stringify({ startsOn, reason }),
    });
    revalidatePath("/dashboard/headteacher");
    return { status: "success", message: "Attendance intervention created." };
  } catch {
    return { status: "error", message: "The intervention could not be saved. Check the details and try again." };
  }
}
