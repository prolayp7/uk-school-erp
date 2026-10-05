import "server-only";

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";

export async function getParentApiSession() {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return null;

  const user = await getCurrentUser();
  const schoolId = user?.schools[0]?.id;
  if (!user || !schoolId) return null;

  return { token, schoolId };
}