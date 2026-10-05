import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, apiRequest } from "@/lib/api";

type UpdatePasswordResponse = { success: boolean; status: string };

export async function POST(request: Request) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Enter an email and a valid password." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("password" in body) ||
    typeof body.password !== "string" ||
    body.password.length < 8
  ) {
    return NextResponse.json({ message: "Enter an email and a password of at least 8 characters." }, { status: 400 });
  }

  try {
    await apiRequest<UpdatePasswordResponse>("/auth/password/admin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: body.email.trim(), password: body.password }),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { message: "The password service is unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
}
