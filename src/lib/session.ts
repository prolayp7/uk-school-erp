import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, apiRequest } from "@/lib/api";

export type CurrentUser = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  schools: Array<{ id: string; code: string; name: string }>;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return null;

  try {
    return await apiRequest<CurrentUser>("/erp/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error instanceof ApiError && [401, 403].includes(error.status)) {
      return null;
    }
    throw error;
  }
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?reason=session_expired");
  return user;
}

export async function requireAnyRole(allowedRoles: readonly string[]): Promise<CurrentUser> {
  const user = await requireCurrentUser();
  if (!user.roles.some((role) => allowedRoles.includes(role))) redirect("/dashboard");
  return user;
}