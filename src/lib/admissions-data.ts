export const STAGES = ["Enquiry", "Application", "Documents Pending", "Review", "Offered", "Accepted", "Enrolled"] as const;
export type Stage = typeof STAGES[number] | "Withdrawn" | "Declined";
export type Applicant = {
  id: string; name: string; dob: string; year: string; school: string; parent: string;
  email: string; phone: string; postcode: string; distance: string; priority: string;
  stage: Stage; route: string; date: string; note: string;
  denomination?: string; start?: string; address?: string; sibling?: string; siblingName?: string; faith?: string; minister?: string; parish?: string; send?: string; medical?: string;
};
const rows: [string,string,string,string,string,Stage,string,string][] = [
  ["0102","Thomas Gallagher","St. Joseph’s RC Primary","Fiona Gallagher","2", "Accepted","Sibling: Emma Gallagher (9B)","0.72"],
  ["0118","Maya Kapoor","St. Bede Primary CE","Priya Kapoor","4","Application","Catchment area verified","0.65"],
  ["0145","Callum O’Connor","St. Margaret’s C of E Primary","Sean O’Connor","3","Documents Pending","Awaiting baptism certificate and clergy endorsement","0.58"],
  ["0089","Fatima Al-Mansoor","Newcastle City Academy","Tariq Al-Mansoor","4","Review","In-year transfer · PAN vacancy review","1.10"],
  ["0199","Ethan Sinclair","Neville’s Cross Primary","Marcus Sinclair","1","Offered","Looked-after child · virtual school verified","0.94"],
  ["0204","Harrison Reed","Shincliffe CE Primary","Claire Reed","4","Withdrawn","Family relocated outside Durham LA","2.40"],
  ["0211","Amara Singh","St. Margaret’s CE Primary","Gurpreet Singh","2","Enrolled","Sibling: Jasleen Singh (8A)","0.58"],
  ["0220","Noah Williams","St. Jude Junior Academy","Sarah Williams","4","Application","Direct feeder school","0.41"],
  ["0221","Charlotte Adams","St. Oswald’s C of E Primary","David Adams","4","Enquiry","Open evening · information pack requested","1.24"],
  ["0222","Ethan Morris","Neville’s Cross Primary","Claire Morris","4","Enquiry","School tour requested","0.92"],
  ["0223","Oliver Finch","St. Margaret’s CE Primary","Lucy Finch","2","Application","Sibling: Jack Finch (9B) · SIF received","0.82"],
  ["0224","Maya Patel","St. Thomas More RC","Anita Patel","3","Documents Pending","Missing SIF evidence and proof of address","1.12"],
  ["0225","Hamza Malik","Durham Gilesgate Primary","Aisha Malik","1","Review","Verified LAC status · automatic first rank","0.77"],
  ["0226","Jessica Vance","St. Bede Primary CE","Helen Vance","4","Review","Distance check · within historic cut-off","0.84"],
];
export const APPLICANTS: Applicant[] = rows.map(([id,name,school,parent,priority,stage,note,distance],i)=>({id:`CAF-2025-${id}`,name,dob:i===2?"2014-06-12":"2014-04-18",year:i===3?"Year 8":"Year 7",school,parent,email:`${parent.toLowerCase().replaceAll(" ",".").replaceAll("’","")}@example.com`,phone:"07700 900341",postcode:"DH1 3NP",distance,priority,stage,route:i===3?"In-year transfer":"Normal round",date:`2024-10-${String(8+i).padStart(2,"0")}`,note,...(i===2?{send:"SEN support (K)",medical:"Peanut allergy (mild). Healthcare plan to be confirmed before enrolment.",minister:"Revd. Peter Fairbairn",parish:"St. Oswald’s Parish Church, Durham"}:{})}));
export const initials = (name:string) => name.split(" ").map(n=>n[0]).slice(0,2).join("");
export const formatDate = (date:string) => date ? new Date(date+"T12:00:00").toLocaleDateString("en-GB") : "Not provided";
export function downloadFile(name:string,content:string,type="text/plain") {
  const url=URL.createObjectURL(new Blob([content],{type})); const a=document.createElement("a"); a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
