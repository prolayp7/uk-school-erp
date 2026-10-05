import { LinkParentForm } from "@/components/parents/link-parent-form";
export const metadata={title:"Link Parent / Carer to Pupil"};
export default async function Page({searchParams}:{searchParams:Promise<{parent?:string;pupil?:string}>}){const {parent,pupil}=await searchParams;return <LinkParentForm parentId={parent} pupilId={pupil}/>;}
