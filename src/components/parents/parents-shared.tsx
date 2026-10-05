"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { contactInitials, type ParentContact } from "@/lib/parents-data";
export function ParentsShell({current,children}:{current:string;children:ReactNode}){
  return <AppShell activePath="/parents-and-carers" user={{name:"Dr. Rachel Holloway",role:"Headteacher & SLT",initials:"RH"}}><div className="parents-module"><nav className="pc-breadcrumb" aria-label="Breadcrumb"><Link href="/dashboard">Overview</Link><ChevronRight/><span>People</span><ChevronRight/><Link href="/parents-and-carers">Parents &amp; Carers</Link><ChevronRight/><span aria-current="page">{current}</span><span className="pc-demo">Demo workspace · local records</span></nav>{children}</div></AppShell>;
}
export function Pill({children,tone="neutral"}:{children:ReactNode;tone?:"neutral"|"brand"|"success"|"warning"|"info"}){return <span className={`pc-pill ${tone}`}>{children}</span>;}
export function PortalPill({status}:{status:ParentContact["portal"]}){return <Pill tone={status==="Active"?"success":status==="Pending"?"warning":status==="Restricted"?"brand":"neutral"}>{status}</Pill>;}
export function PersonAvatar({name,large=false}:{name:string;large?:boolean}){return <span className={`pc-avatar ${large?"large":""}`}>{contactInitials(name)}</span>;}
export function Panel({title,icon,aside,children,id,className=""}:{title:string;icon?:ReactNode;aside?:ReactNode;children:ReactNode;id?:string;className?:string}){return <section id={id} className={`pc-panel ${className}`}><div className="pc-panel-heading"><h2>{icon}{title}</h2>{aside}</div>{children}</section>;}
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}){return <label className="pc-field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>;}
export function Filter({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(s:string)=>void}){return <label className="pc-filter"><span className="sr-only">{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(v=><option key={v}>{v}</option>)}</select></label>;}
export function ParentsFooter(){return <footer className="pc-footer"><ShieldCheck/><div><strong>Connected family records</strong><p>Demonstration contacts and pupil relationships. Changes stay in this browser; no messages, portal invitations or statutory returns are sent.</p></div><span>St Jude &amp; St Bede</span></footer>;}
export function LoadingContacts(){return <div className="pc-empty" role="status">Loading local contact records…</div>;}
