import { ApplicationDossier } from "@/components/admissions/application-dossier";
export const metadata = { title: "Application Dossier" };
export default async function Page({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { const { id } = await params; return <ApplicationDossier id={id}/>; }
