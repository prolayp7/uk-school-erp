import type { Metadata } from "next";

import { PupilDirectory } from "@/components/pupils/pupil-directory";

export const metadata: Metadata = {
  title: "Pupil Directory",
};

export default function PupilsPage() {
  return <PupilDirectory />;
}
