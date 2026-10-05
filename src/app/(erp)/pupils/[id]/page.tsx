import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PupilProfile } from "@/components/pupils/pupil-profile";
import { getPupilById } from "@/lib/pupils-data";

export async function generateMetadata(props: PageProps<"/pupils/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const pupil = getPupilById(id);
  return { title: pupil ? `${pupil.legalForename} ${pupil.legalSurname}` : "Pupil not found" };
}

export default async function PupilProfilePage(props: PageProps<"/pupils/[id]">) {
  const { id } = await props.params;
  const pupil = getPupilById(id);
  if (!pupil) notFound();

  return <PupilProfile pupil={pupil} />;
}
