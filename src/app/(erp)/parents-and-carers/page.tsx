import type { Metadata } from "next";

import { ParentDirectory } from "@/components/parents/parent-directory";
import { requireAnyRole } from "@/lib/session";

export const metadata: Metadata = {
	title: "Parents & Carers Directory",
};

export default async function ParentCarerDirectoryPage() {
	await requireAnyRole(["PARENT", "SUPER_ADMIN"]);
	return <ParentDirectory />;
}
