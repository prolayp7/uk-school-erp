import type { Metadata } from "next";

import { PupilEnrolmentForm } from "@/components/pupils/pupil-enrolment-form";

export const metadata: Metadata = {
  title: "Enrol New Pupil",
};

export default function NewPupilPage() {
  return <PupilEnrolmentForm />;
}
