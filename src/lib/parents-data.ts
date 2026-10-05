// Synthetic design-preview contacts. Relationship permissions belong to each pupil link.
export type PupilLink = {
  pupilId: string;
  relationship: string;
  priority: string;
  responsibility: boolean;
  verification: "Verified" | "Pending review";
  basis: string;
  inspectionDate: string;
  residence: string;
  restriction: string;
  emergency: boolean;
  reports: boolean;
  attendance: boolean;
  behaviour: boolean;
  finance: boolean;
  collection: string;
};
export type ContactEvent = { id: string; kind: "Email draft" | "Call" | "Note" | "Relationship"; title: string; body: string; date: string };
export type ParentContact = {
  id: string; name: string; title: string; email: string; mobile: string; landline: string;
  address: string; postcode: string; portal: "Active" | "Pending" | "Not invited" | "Restricted";
  mobileVerified: boolean; lastLogin: string; employer: string; photoUrl?: string; links: PupilLink[]; events: ContactEvent[];
};
export const DEFAULT_SARAH_PHOTO_URL = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80";
export const defaultLink = (pupilId = ""): PupilLink => ({
  pupilId, relationship: "Mother", priority: "1", responsibility: true,
  verification: "Pending review", basis: "Awaiting evidence", inspectionDate: "",
  residence: "Lives with pupil", restriction: "No restrictions recorded", emergency: true,
  reports: true, attendance: true, behaviour: true, finance: true, collection: "Authorised",
});
const link = (pupilId: string, relationship = "Mother", priority = "1", restricted = false): PupilLink => ({
  ...defaultLink(pupilId), relationship, priority, verification: "Verified", basis: restricted ? "Local authority documentation" : "Birth certificate", inspectionDate: "2024-09-03",
  restriction: restricted ? "Supervised contact only" : "No restrictions recorded", collection: restricted ? "Supervised collection" : "Authorised",
});
const fixtures: Array<[string,string,string,string[],string,string,ParentContact["portal"]]> = [
  ["sarah-turner","Mrs","Sarah Turner",["liam-turner","jack-turner"],"Mother","1","Active"],
  ["mark-turner","Mr","Mark Turner",["liam-turner","jack-turner"],"Father","2","Active"],
  ["priya-kapoor","Dr","Priya Kapoor",["maya-kapoor"],"Mother","1","Active"],
  ["marcus-sinclair","Mr","Marcus Sinclair",["ethan-sinclair"],"Father","1","Pending"],
  ["tariq-al-mansoor","Mr","Tariq Al-Mansoor",["fatima-al-mansoor"],"Father","1","Active"],
  ["claire-robinson","Ms","Claire Robinson",["sophie-robinson"],"Mother","1","Active"],
  ["julia-green","Mrs","Julia Green",["lucas-green"],"Mother","1","Not invited"],
  ["gillian-vance","Mrs","Gillian Vance",["chloe-simmons"],"Foster carer","1","Restricted"],
  ["helen-turner","Mrs","Helen Turner",["liam-turner","jack-turner"],"Grandparent","3","Not invited"],
  ["david-kapoor","Mr","David Kapoor",["maya-kapoor"],"Father","2","Pending"],
];
export const PARENTS: ParentContact[] = fixtures.map(([id,title,name,pupils,relationship,priority,portal],i)=>({
  id,title,name,email:`${id.replaceAll("-",".")}@example.com`,mobile:i===0?"07700 900124":i===1?"07700 900588":i===6?"":`07700 900${String(330+i*41).padStart(3,"0")}`,landline:i===0?"0191 498 0221":"",
  address:i<2||i===8?"14 St Jude’s Terrace, Jesmond, Newcastle upon Tyne":`${20+i} Academy Road, Durham`,postcode:i<2||i===8?"NE2 1AB":"DH1 3NP",portal,mobileVerified:i!==6,lastLogin:portal==="Active"?"17/10/2024, 08:14":"Never",employer:i===0?"Durham County Council · Senior Planning Officer":"Not recorded",
  links:pupils.map(p=>({...link(p,relationship,priority,portal==="Restricted"),responsibility:relationship!=="Grandparent",reports:relationship!=="Grandparent",finance:relationship!=="Grandparent",verification:i===8?"Pending review":"Verified"})),
  events:i===0?[
    {id:"event-1",kind:"Note",title:"Attendance notification recorded",body:"Liam’s late arrival was recorded by the attendance team. Example communication record from the supplied reference.",date:"2024-10-17T12:14:00"},
    {id:"event-2",kind:"Note",title:"Year 7 settling-in evening booking",body:"Appointment with the form tutor recorded for Jack Turner.",date:"2024-10-14T16:30:00"},
    {id:"event-3",kind:"Call",title:"Pastoral telephone call",body:"Discussed attendance support with the Head of Year. Agreed a morning check-in.",date:"2024-10-10T09:15:00"},
    {id:"event-4",kind:"Note",title:"Autumn term trust letter",body:"Reference record: termly family newsletter available in the parent portal.",date:"2024-10-01T08:00:00"},
  ]:[],
}));
export const contactInitials=(name:string)=>name.split(" ").filter(Boolean).map(n=>n[0]).slice(0,2).join("");
export const eventDate=(date:string)=>new Date(date).toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
export function exportContacts(contacts:ParentContact[]){
  const quote=(v:string)=>`"${v.replaceAll('"','""')}"`;
  const content=["Name,Email,Mobile,Portal,Linked pupils",...contacts.map(c=>[c.name,c.email,c.mobile,c.portal,String(c.links.length)].map(quote).join(","))].join("\r\n");
  downloadText("parents-and-carers.csv",content,"text/csv;charset=utf-8");
}
export function downloadText(filename:string,text:string,type="text/plain"){
  const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
