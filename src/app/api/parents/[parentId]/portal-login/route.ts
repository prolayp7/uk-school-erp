import { NextResponse } from "next/server";
import { ApiError, apiRequest } from "@/lib/api";
import { getParentApiSession } from "@/lib/parent-api-session";

type PortalLogin = { email: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ parentId: string }> },
) {
  const session = await getParentApiSession();
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

  try {
    const { parentId } = await params;
    const login = await apiRequest<PortalLogin>(
      `/erp/parents/${encodeURIComponent(parentId)}/portal-login`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "x-school-id": session.schoolId,
        },
      },
    );
    return NextResponse.json(login);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "The portal account could not be loaded." }, { status: 503 });
  }
}