import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { requireCurrentUser } from "@/lib/session";
import { getDashboardDestination } from "@/lib/dashboard-routing";

export const metadata: Metadata = {
  title: "Workspace",
};

export default async function DashboardIndexPage() {
  const user = await requireCurrentUser();
  const destination = getDashboardDestination(user.roles);

  if (destination) redirect(destination);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand">
          <GraduationCap className="h-6 w-6" />
        </span>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand">
          Your workspace is being prepared
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          This account is signed in as {user.roles.join(", ") || "a school user"}. Its role-specific
          workspace will be added in a later step.
        </p>
      </div>
    </div>
  );
}
