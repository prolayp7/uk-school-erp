import { ApplicationForm } from "@/components/admissions/application-form";
export const metadata = { title: "Edit Application" };
export default async function Page({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { const { id } = await params; return <ApplicationForm id={id}/>; }
