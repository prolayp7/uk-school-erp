import { NextResponse } from "next/server";
import { ApiError, apiRequest } from "@/lib/api";
import { getParentApiSession } from "@/lib/parent-api-session";

type ParentContactUpdate = {
  message: string;
  id: string;
  title: string;
  name: string;
  email: string;
  mobile: string;
  landline: string;
  address: string;
  postcode: string;
  photoStoragePath: string | null;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ parentId: string }> },
) {
  try {
    const session = await getParentApiSession();
    if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

    const formData = await request.formData();
    const { parentId } = await params;
    const updated = await apiRequest<ParentContactUpdate>(
      `/erp/parents/${encodeURIComponent(parentId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "x-school-id": session.schoolId,
        },
        body: formData,
      },
    );
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "The parent record could not be updated." }, { status: 503 });
  }
}