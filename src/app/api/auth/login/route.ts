import { NextResponse } from "next/server";
import { ApiError, apiRequest } from "@/lib/api";

type CreateSessionResponse = { token: string };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const session = await apiRequest<CreateSessionResponse>("/auth/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email.trim(), password: body.password }),
    });
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set("session_token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError && [400, 401].includes(error.status)) {
      return NextResponse.json(
        { message: "Invalid school email or password." },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { message: "The sign-in service is unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
}