import { NextResponse } from "next/server";
import { getParentApiSession } from "@/lib/parent-api-session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ parentId: string }> },
) {
  const session = await getParentApiSession();
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

  const baseUrl = process.env.API_BASE_URL?.replace(/\/+$/, "");
  if (!baseUrl) return NextResponse.json({ message: "API_BASE_URL is not configured." }, { status: 503 });

  try {
    const { parentId } = await params;
    const upstream = await fetch(
      `${baseUrl}/erp/parents/${encodeURIComponent(parentId)}/photo`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "x-school-id": session.schoolId,
        },
        cache: "no-store",
      },
    );

    if (!upstream.ok) {
      const payload = await upstream.json().catch(() => null);
      return NextResponse.json(
        { message: payload && typeof payload.message === "string" ? payload.message : "Photo not found." },
        { status: upstream.status },
      );
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ message: "The parent photo is unavailable." }, { status: 503 });
  }
}