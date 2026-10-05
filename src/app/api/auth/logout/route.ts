import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    try {
      await apiRequest("/auth/sessions/current", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Clear the browser session even if the API session has already expired.
    }
  }

  const response = NextResponse.json({ authenticated: false });
  response.cookies.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}