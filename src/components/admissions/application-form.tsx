"use client";
import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, School, CalendarDays, Save, Upload, FileText, MapPin } from "lucide-react";
import { type Applicant, initials } from "@/lib/admissions-data";
import { AdmissionsShell, Badge, Footer, Panel, useAdmissions } from "./admissions-shared";
const STEPS = ["Applicant details", "Intended admission", "Parent contacts", "Criteria & SIF", "SEND & medical", "Documents"];
type FormValues = {
    name: string;
    dob: string;
    school: string;
    year: string;
    start: string;
    route: string;
    parent: string;
    email: string;
    phone: string;
    address: string;
    postcode: string;
    sibling: string;
    siblingName: string;
    faith: string;
    denomination: string;
    minister: string;
    parish: string;
    send: string;
    medical: string;
    consent: boolean;
};
function Field({ label, children }: {
    label: string;
    children: ReactNode;
}) { return <label className="adm-field">{label}{children}</label>; }
export function ApplicationForm({ id }: {
    id?: string;
}) { const { applicants, save } = useAdmissions(); const record = applicants.find(a => a.id === id); if (id && !record)
    return <AdmissionsShell current="Application not found"><div className="adm-empty"><h1>Application not found</h1><Link href="/admissions/applications">Return to register</Link></div></AdmissionsShell>; return <FormEditor key={record ? JSON.stringify(record) : "new"} record={record} applicants={applicants} save={save}/>; }
function FormEditor({ record, applicants, save }: {
    record?: Applicant;
    applicants: Applicant[];
    save: (a: Applicant[]) => void;
}) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [step, setStep] = useState(record ? 1 : 0);
    const [notice, setNotice] = useState("");
    const [files, setFiles] = useState<string[]>([]);
    const [values, setValues] = useState<FormValues>({ name: record?.name || "", dob: record?.dob || "", school: record?.school || "", year: record?.year || "Year 7", start: record?.start || "2025-09-03", route: record?.route || "Normal round", parent: record?.parent || "", email: record?.email || "", phone: record?.phone || "", address: record?.address || (record ? "18 St. Cuthbert’s Way, Durham, County Durham" : ""), postcode: record?.postcode || "", sibling: record?.sibling || (record?.priority === "2" ? "Yes" : "No"), siblingName: record?.siblingName || "", faith: record?.faith || (record?.priority === "3" ? "Yes" : "No"), denomination: record?.denomination || "Church of England / Anglican Communion", minister: record?.minister || "", parish: record?.parish || "", send: record?.send || "Not recorded", medical: record?.medical || "", consent: false });
    const draftKey = `admissions-draft-${record?.id || "new"}`;
    const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setValues(v => ({ ...v, [key]: value }));
    const input = (key: Exclude<keyof FormValues, "consent">, type = "text", required = false, placeholder = "") => <input value={values[key]} type={type} required={required} placeholder={placeholder} onChange={e => set(key, e.target.value)}/>;
    const draft = () => { try {
        localStorage.setItem(draftKey, JSON.stringify({ values, step }));
        setNotice("Draft saved in this browser. You can restore it when you return.");
    }
    catch {
        setNotice("Draft could not be saved. Browser storage may be unavailable or full.");
    } };
    const restore = () => { try {
        const raw = localStorage.getItem(draftKey);
        if (!raw) {
            setNotice("No saved draft was found for this application.");
            return;
        }
        const data = JSON.parse(raw);
        if (!data.values || typeof data.values.name !== "string")
            throw Error();
        setValues(v => ({ ...v, ...data.values }));
        setStep(Math.max(0, Math.min(5, Number(data.step) || 0)));
        setNotice("Saved draft restored. Select any documents again before submitting.");
    }
    catch {
        setNotice("This draft could not be restored. Please complete the form again.");
    } };
    const next = () => { if (!formRef.current?.reportValidity())
        return; setStep(s => Math.min(5, s + 1)); window.scrollTo({ top: 0, behavior: "instant" }); };
    const submit = () => {
        if (!formRef.current?.reportValidity())
            return;
        if (!values.name.trim() || !values.dob || !values.school.trim()) {
            setStep(0);
            setNotice("Complete the required applicant details before submitting.");
            return;
        }
        if (!values.parent.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.phone.trim() || !values.address.trim() || !values.postcode.trim()) {
            setStep(2);
            setNotice("Complete the parent contact and address details before submitting.");
            return;
        }
        if (!values.start || (values.sibling === "Yes" && !values.siblingName.trim()) || (values.faith === "Yes" && (!values.minister.trim() || !values.parish.trim()))) {
            setStep(1);
            setNotice("Complete the placement and required sibling or faith details before submitting.");
            return;
        }
        if (!values.consent) {
            setNotice("Confirm the declaration to submit the application.");
            return;
        }
        const newId = record?.id || `APP-2025-${Date.now().toString().slice(-8)}`;
        const item: Applicant = { ...values, id: newId, name: values.name.trim(), dob: values.dob, school: values.school, year: values.year, parent: values.parent, email: values.email, phone: values.phone, postcode: values.postcode, distance: record?.distance || "Not measured", priority: record?.priority === "1" ? "1" : values.sibling === "Yes" ? "2" : values.faith === "Yes" ? "3" : "4", stage: record?.stage || "Application", route: values.route, date: record?.date || new Date().toISOString().slice(0, 10), note: values.sibling === "Yes" ? `Sibling: ${values.siblingName || "verification required"}` : values.faith === "Yes" ? "Faith criteria · SIF verification required" : "Residential proximity · verification required" };
        try {
            save(record ? applicants.map(a => a.id === record.id ? item : a) : [item, ...applicants]);
            localStorage.removeItem(draftKey);
            router.push(`/admissions/applications/${newId}`);
        }
        catch {
            setNotice("Unable to save the application. Free some browser storage and try again.");
        }
    };
    return <AdmissionsShell current={record ? "Edit application" : "New application form"}><header className="adm-form-header"><span className="adm-form-shield"><ShieldCheck /></span><div><h1>Admissions Application Form</h1><p>Register a candidate for admissions ranking, feeder school verification and coordinated allocation.</p></div><Badge tone="brand">2025–2026 intake</Badge></header><nav className="adm-form-steps" aria-label="Application steps">{STEPS.map((s, i) => <button key={s} aria-current={step === i ? "step" : undefined} onClick={() => { if (i < step || formRef.current?.reportValidity())
        setStep(i); }}><span>{i < step ? <Check /> : i + 1}</span><div><small>Step {i + 1}{step === i ? " · Active" : ""}</small>{s}</div></button>)}</nav>{notice && <div className="adm-notice" role="status">{notice}</div>}
 <div className="adm-form-layout"><aside className="adm-stack"><Panel title="Applicant Snapshot" aside={<Badge>Draft</Badge>}><div className="adm-person"><span className="adm-avatar">{values.name ? initials(values.name) : "—"}</span><div><strong>{values.name || "New applicant"}</strong><small>{values.dob ? new Date(values.dob + "T12:00:00").toLocaleDateString("en-GB") : "Applicant details not yet entered"}</small></div></div><dl className="adm-snapshot"><div><dt>Entry year group</dt><dd>{values.year}</dd></div><div><dt>Admission route</dt><dd>{values.route}</dd></div><div><dt>Local authority</dt><dd>Durham County Council</dd></div></dl></Panel><Panel title="Feeder School Link" aside={<School size={17}/>}><strong>{values.school || "School not yet recorded"}</strong><p className="adm-muted">School records and transfer information are verified during the admissions review.</p><div className="adm-info-block">Feeder school attendance does not by itself confirm an admission offer.</div></Panel><Panel title="Intake Dates" aside={<CalendarDays size={17}/>}><ol className="adm-timeline"><li><strong>31/10/2024</strong><small>Application closing date</small></li><li><strong>03/03/2025</strong><small>National offer day</small></li><li><strong>03/09/2025</strong><small>Proposed autumn entry</small></li></ol><small className="adm-muted">Reference intake dates for this demo.</small></Panel><div className="adm-warning"><ShieldCheck /><p>All declarations and supporting information require verification before an offer is confirmed.</p></div><button className="adm-button" onClick={restore}>Restore saved draft</button></aside>
 <form ref={formRef} className="adm-stack" onSubmit={e => { e.preventDefault(); if (step < 5)
        next();
    else
        submit(); }}>
 {step === 0 && <Panel title="Applicant Details" aside={<Badge>Step 1 of 6</Badge>}><p className="adm-section-description">Enter the applicant’s legal details as shown on their supporting documents. Fields marked * are required.</p><div className="adm-form-fields"><Field label="Full legal name *">{input("name", "text", true, "e.g. Callum Joseph O’Connor")}</Field><Field label="Date of birth *">{input("dob", "date", true)}</Field><Field label="Current / previous school *">{input("school", "text", true, "School name")}</Field><Field label="Home local authority"><input value="Durham County Council" readOnly/></Field></div></Panel>}
 {step === 1 && <><Panel title="1. Intended Cohort & Placement" aside={<Badge>Section 1 of 4</Badge>}><p className="adm-section-description">Specify the entry year group, proposed start date and administrative route.</p><div className="adm-form-fields"><Field label="Academic year cohort *"><select defaultValue="2025–2026"><option>2025–2026</option></select></Field><Field label="Desired commencement date *">{input("start", "date", true)}</Field></div><fieldset className="adm-fieldset"><legend>Entry year group *</legend><div className="adm-choice-grid">{["Year 7", "Year 8", "Year 12"].map(y => <label className="adm-radio-card" key={y}><input type="radio" name="year" checked={values.year === y} onChange={() => set("year", y)}/><span>{y}<small>{y === "Year 7" ? "Normal intake (age 11)" : y === "Year 8" ? "In-year secondary" : "Sixth form admissions"}</small></span></label>)}</div></fieldset><fieldset className="adm-fieldset"><legend>Admission process route</legend>{[["Normal round", "Normal coordinated round via Durham LA Common Application Form (CAF)", "Ranked choice submitted via the parent’s home local authority portal."], ["In-year transfer", "Direct in-year application to academy trust", "For mid-academic year transfers or families moving outside the normal admissions window."]].map(([value, title, sub]) => <label className="adm-radio-card" key={value}><input type="radio" name="route" checked={values.route === value} onChange={() => set("route", value)}/><span>{title}<small>{sub}</small></span></label>)}</fieldset><Badge>Day pupil (non-boarding)</Badge></Panel>
 <Panel title="2. Sibling & Family Connections" aside={<Badge tone="success">Priority 2 criteria</Badge>}><p>Does the applicant have a sibling currently on roll at the academy?</p><div className="adm-radio-row">{["Yes", "No"].map(v => <label key={v}><input type="radio" name="sibling" checked={values.sibling === v} onChange={() => set("sibling", v)}/>{v} — {v === "Yes" ? "Currently attending" : "No sibling on roll"}</label>)}</div>{values.sibling === "Yes" && <Field label="Sibling name and year group *">{input("siblingName", "text", true, "e.g. Grace O’Connor, Year 9")}</Field>}</Panel>
 <Panel title="3. Faith Affiliation & SIF Requirement" aside={<Badge tone="brand">Priority 3 criteria</Badge>}><p>Are you applying under the academy’s Church of England / Christian faith criteria?</p><div className="adm-radio-row">{["Yes", "No"].map(v => <label key={v}><input type="radio" name="faith" checked={values.faith === v} onChange={() => set("faith", v)}/>{v} — {v === "Yes" ? "Faith foundation" : "General community criteria"}</label>)}</div>{values.faith === "Yes" && <><div className="adm-form-fields"><Field label="Faith denomination"><select value={values.denomination} onChange={e => set("denomination", e.target.value)}><option>Church of England / Anglican Communion</option><option>Other Christian denomination</option></select></Field><Field label="Officiating minister / clergy *">{input("minister", "text", true)}</Field></div><Field label="Regular place of worship / parish *">{input("parish", "text", true)}</Field><div className="adm-warning"><FileText /><p>A signed Supplementary Information Form is required. Add the supporting evidence at the Documents step.</p></div></>}</Panel>
 <Panel title="4. Residential Proximity & Catchment" aside={<MapPin size={17}/>}><div className="adm-info-block"><div><strong>Primary residence</strong><p>{values.address || "Add the primary residence in Parent contacts."}</p><small>{values.postcode}</small></div></div><p className="adm-muted">Distance and catchment status will be verified by the admissions team.</p></Panel></>}
 {step === 2 && <Panel title="Parent / Carer Contacts" aside={<Badge>Step 3 of 6</Badge>}><p className="adm-section-description">Provide the primary contact and the applicant’s usual home address.</p><div className="adm-form-fields"><Field label="Parent / carer full name *">{input("parent", "text", true)}</Field><Field label="Email address *">{input("email", "email", true)}</Field><Field label="Phone number *">{input("phone", "tel", true)}</Field><Field label="Postcode *">{input("postcode", "text", true)}</Field></div><Field label="Primary home address *">{input("address", "text", true)}</Field><div className="adm-info-block">Use the address at which the applicant normally resides. Proof of residency is reviewed with supporting documents.</div></Panel>}
 {step === 3 && <Panel title="Admissions Criteria & SIF" aside={<Badge>Step 4 of 6</Badge>}><p className="adm-section-description">Review the declared criteria before submitting evidence.</p><dl className="adm-facts"><div><dt>Admission route</dt><dd>{values.route}</dd></div><div><dt>Sibling currently on roll</dt><dd>{values.sibling}{values.siblingName ? ` · ${values.siblingName}` : ""}</dd></div><div><dt>Applying under faith criteria</dt><dd>{values.faith}</dd></div><div><dt>Provisional criteria</dt><dd>Priority {values.sibling === "Yes" ? "2" : values.faith === "Yes" ? "3" : "4"} · Subject to review</dd></div></dl><button type="button" className="adm-button" onClick={() => setStep(1)}>Edit intended admission &amp; criteria</button><div className="adm-warning"><ShieldCheck /><p>Looked-after children and other statutory priorities must be assessed by the admissions team. This form does not calculate final ranking.</p></div></Panel>}
 {step === 4 && <Panel title="SEND, Medical & Inclusion" aside={<Badge>Step 5 of 6</Badge>}><p className="adm-section-description">Share information to help the school prepare appropriate support.</p><Field label="SEND provision"><select value={values.send} onChange={e => set("send", e.target.value)}>{["Not recorded", "No identified SEND", "SEN support (K)", "Education, Health and Care Plan (E)"].map(s => <option key={s}>{s}</option>)}</select></Field><Field label="Medical conditions, allergies or access requirements"><textarea rows={5} value={values.medical} onChange={e => set("medical", e.target.value)} placeholder="Include any support that should be discussed before enrolment."/></Field><div className="adm-info-block">The admissions team will arrange a confidential discussion for any support needs.</div></Panel>}
 {step === 5 && <><Panel title="Supporting Documents" aside={<Badge>Step 6 of 6</Badge>}><p className="adm-section-description">Select proof of address, birth certificate and any supporting SIF evidence.</p><label className="adm-dropzone"><Upload /><strong>Choose documents</strong><span>PDF, JPG or PNG · up to 10 MB per file</span><input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={e => { const selected = Array.from(e.target.files || []); if (selected.some(f => f.size > 10 * 1024 * 1024)) {
        setNotice("Each document must be smaller than 10 MB.");
        return;
    } setFiles(selected.map(f => f.name)); }}/></label>{files.map((f, i) => <div className="adm-document" key={`${f}-${i}`}><FileText /><strong>{f}</strong><Badge tone="success">Selected</Badge></div>)}<p className="adm-muted">Files are previewed for this session only. The demo saves application details but does not upload or retain file contents.</p></Panel><Panel title="Review & Declaration"><dl className="adm-facts"><div><dt>Applicant</dt><dd>{values.name || "Not entered"}</dd></div><div><dt>Entry cohort</dt><dd>{values.year} · 2025–2026</dd></div><div><dt>Primary contact</dt><dd>{values.parent || "Not entered"}</dd></div><div><dt>Documents selected</dt><dd>{files.length}</dd></div></dl><label className="adm-declaration"><input type="checkbox" required checked={values.consent} onChange={e => set("consent", e.target.checked)}/><span>I confirm that the information provided is accurate and understand that supporting information must be verified before admission. *</span></label></Panel></>}
 <div className="adm-action-bar form-actions"><button type="button" className="adm-button" onClick={() => step > 0 ? setStep(step - 1) : router.push("/admissions/applications")}><ArrowLeft />{step ? "Back" : "Cancel"}</button><button type="button" className="adm-button" onClick={draft}><Save />Save draft</button><button type="submit" className="adm-button primary">{step === 5 ? record ? "Save application" : "Submit application" : `Continue: ${STEPS[step + 1]}`}<ArrowRight /></button></div></form></div><Footer /></AdmissionsShell>;
}
