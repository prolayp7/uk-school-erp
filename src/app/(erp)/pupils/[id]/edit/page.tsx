import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PupilEnrolmentForm } from "@/components/pupils/pupil-enrolment-form";
import { getPupilById } from "@/lib/pupils-data";

export async function generateMetadata(props: PageProps<"/pupils/[id]/edit">): Promise<Metadata> {
  const { id } = await props.params;
  const pupil = getPupilById(id);
  return { title: pupil ? `Edit ${pupil.legalForename} ${pupil.legalSurname}` : "Pupil not found" };
}

export default async function EditPupilPage(props: PageProps<"/pupils/[id]/edit">) {
  const { id } = await props.params;
  const pupil = getPupilById(id);
  if (!pupil) notFound();

  return <PupilEnrolmentForm pupil={pupil} />;
}
