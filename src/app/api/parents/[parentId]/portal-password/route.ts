import { NextResponse } from "next/server";
import { ApiError, apiRequest } from "@/lib/api";
import { getParentApiSession } from "@/lib/parent-api-session";

type PortalPasswordUpdate = { success: boolean; message: string };

export async function POST(
  request: Request,
  { params }: { params: Promise<{ parentId: string }> },
) {
  const session = await getParentApiSession();
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Enter a valid password." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("password" in body) || typeof body.password !== "string" || body.password.length < 8) {
    return NextResponse.json({ message: "Use a password with at least 8 characters." }, { status: 400 });
  }

  try {
    const { parentId } = await params;
    const result = await apiRequest<PortalPasswordUpdate>(
      `/erp/parents/${encodeURIComponent(parentId)}/portal-password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "x-school-id": session.schoolId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: body.password }),
      },
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "The portal login could not be updated." }, { status: 503 });
  }
}