import { ParentProfile } from "@/components/parents/parent-profile";
import { requireAnyRole } from "@/lib/session";
export const metadata={title:"Parent & Carer Profile"};
export default async function Page({params}:{params:Promise<{id:string}>}){const [{id},user]=await Promise.all([params,requireAnyRole(["PARENT","SUPER_ADMIN"])]);return <ParentProfile id={id} canUpdatePortalLogin={user.roles.includes("SUPER_ADMIN")}/>;}
