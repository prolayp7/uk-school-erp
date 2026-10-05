"use client";
import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import { ChevronRight, ShieldCheck, LayoutList, Columns3, Plus } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { APPLICANTS, type Applicant } from "@/lib/admissions-data";
const KEY = "school-admissions-demo-v1";
const subscribe = (callback: () => void) => { window.addEventListener("storage", callback); window.addEventListener("admissions-update", callback); return () => { window.removeEventListener("storage", callback); window.removeEventListener("admissions-update", callback); }; };
function snapshot() { try {
    return localStorage.getItem(KEY) || "";
}
catch {
    return "";
} }
export function useAdmissions() {
    const raw = useSyncExternalStore(subscribe, snapshot, () => "");
    let applicants = APPLICANTS;
    try {
        if (raw) {
            const saved = JSON.parse(raw);
            if (Array.isArray(saved) && saved.every(a => a && typeof a.id === "string" && typeof a.name === "string"))
                applicants = saved;
        }
    }
    catch { }
    const save = (next: Applicant[]) => { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new Event("admissions-update")); };
    return { applicants, save };
}
export function AdmissionsShell({ children, current }: {
    children: ReactNode;
    current: string;
}) { return <AppShell activePath="/admissions" user={{ name: "Dr. Rachel Holloway", role: "Headteacher & SLT", initials: "RH" }}><div className="admissions"><nav aria-label="Breadcrumb" className="adm-breadcrumb"><Link href="/dashboard">Overview</Link><ChevronRight /><span>People</span><ChevronRight /><Link href="/admissions">Admissions</Link><ChevronRight /><span aria-current="page">{current}</span><span className="adm-demo">Demo workspace · local data</span></nav>{children}</div></AppShell>; }
export function Badge({ children, tone = "neutral" }: {
    children: ReactNode;
    tone?: string;
}) { return <span className={`adm-badge adm-${tone}`}>{children}</span>; }
export function StageBadge({ stage }: {
    stage: string;
}) { return <Badge tone={stage === "Documents Pending" ? "warning" : ["Accepted", "Enrolled"].includes(stage) ? "success" : stage === "Withdrawn" ? "neutral" : "brand"}>{stage}</Badge>; }
export function Panel({ title, aside, children, className = "" }: {
    title: string;
    aside?: ReactNode;
    children: ReactNode;
    className?: string;
}) { return <section className={`adm-panel ${className}`}><div className="adm-panel-heading"><h2>{title}</h2>{aside}</div>{children}</section>; }
export function ViewSwitch({ list = false }: {
    list?: boolean;
}) { return <div className="adm-view-switch"><Link aria-current={!list ? "page" : undefined} href="/admissions"><Columns3 />Pipeline board</Link><Link aria-current={list ? "page" : undefined} href="/admissions/applications"><LayoutList />List view</Link></div>; }
export function NewApplication() { return <Link className="adm-button primary" href="/admissions/applications/new"><Plus />New application</Link>; }
export function Footer() { return <footer className="adm-footer"><ShieldCheck /><div><strong>Coordinated admissions · 2025–2026 intake</strong><p>Demonstration records based on the supplied screen references. Local changes are saved in this browser; no LA gateway is connected.</p></div><span>Durham Local Authority</span></footer>; }
export function SelectFilter({ label, value, onChange, options }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) { return <label className="adm-filter"><span>{label}</span><select value={value} onChange={e => onChange(e.target.value)}>{options.map(x => <option key={x}>{x}</option>)}</select></label>; }
