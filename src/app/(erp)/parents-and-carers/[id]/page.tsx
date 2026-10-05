import { ParentProfile } from "@/components/parents/parent-profile";
export const metadata={title:"Parent & Carer Profile"};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ParentProfile id={id}/>;}
