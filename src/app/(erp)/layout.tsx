import type { ReactNode } from "react";
import { requireCurrentUser } from "@/lib/session";

export default async function ProtectedErpLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireCurrentUser();
  return children;
}