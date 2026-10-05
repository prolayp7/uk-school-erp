"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Pencil, Link2, GraduationCap, ShieldCheck, Smartphone, Home, Briefcase, History, CreditCard, ClipboardCheck, ArrowUpRight, FileText, MessageSquare, LockKeyhole, Download, CheckCircle2, Star } from "lucide-react";
import { PUPILS } from "@/lib/pupils-data";
import { DEFAULT_SARAH_PHOTO_URL, downloadText, eventDate, type ContactEvent } from "@/lib/parents-data";
import { useParents } from "./parents-store";
import { LoadingContacts, ParentsShell, ParentsFooter, Panel, PersonAvatar, Pill, PortalPill } from "./parents-shared";
import { ContactDialog, CommunicationDialog } from "./contact-dialogs";
import styles from "./parent-profile-header.module.css";
import childStyles from "./parent-linked-children.module.css";
import "./parent-profile-readability.module.css";
const TABS=["Overview","Linked children","Parental responsibility","Communication history","Forms & consents"];
export function ParentProfile({id}:{id:string}){
  const {contacts,save,ready}=useParents();const contact=contacts.find(c=>c.id===id);const [tab,setTab]=useState("Overview");const [editing,setEditing]=useState(false);const [compose,setCompose]=useState<ContactEvent["kind"]|null>(null);const [notice,setNotice]=useState("");
  if(!ready)return <ParentsShell current="Contact profile"><LoadingContacts/></ParentsShell>;
  if(!contact)return <ParentsShell current="Contact not found"><div className="pc-empty"><h1>Contact not found</h1><p>This contact isn’t in the local directory.</p><Link className="pc-button" href="/parents-and-carers">Return to directory</Link></div></ParentsShell>;
  const restricted=contact.links.some(l=>l.restriction!=="No restrictions recorded");const verified=contact.links.length>0&&contact.links.every(l=>l.verification==="Verified");const isSarah=id==="sarah-turner";const visible=(section:string)=>tab==="Overview"||tab===section;
  const profileBadges = isSarah ? (
    <div className={styles.badgeGrid}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.verified}`}><CheckCircle2 aria-hidden="true"/>Verified Parent (Mother)</span>
        <span className={`${styles.badge} ${styles.priority}`}><Star aria-hidden="true"/>Priority 1 Contact</span>
      </div>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.responsibility}`}><ShieldCheck aria-hidden="true"/>Parental Responsibility (PR) Verified</span>
        <span className={`${styles.badge} ${styles.portal}`}><span className={styles.statusDot}/>Portal Active (iOS App)</span>
      </div>
    </div>
  ) : (
    <>
      <Pill tone="brand">{[...new Set(contact.links.map(l=>l.relationship))].join(" / ")||"No pupil links"}</Pill>
      {contact.links.some(l=>l.priority==="1")&&<Pill tone="info">Priority 1 contact</Pill>}
      <Pill tone={verified?"success":"warning"}>PR {verified?"verified":"awaiting review"}</Pill>
      <PortalPill status={contact.portal}/>
    </>
  );
  const log=(event:ContactEvent)=>{save(contacts.map(c=>c.id===id?{...c,events:[event,...c.events]}:c));setNotice(event.kind==="Email draft"?"Communication draft saved locally. No message was sent.":"Contact history updated in this browser.");};
  const profileActions=<div className={`pc-inline ${styles.profileActions}`}><button className="pc-button primary" onClick={()=>setCompose("Email draft")}><Mail/>Compose message</button><button className="pc-button" onClick={()=>setEditing(true)}><Pencil/>Edit</button></div>;
  const profileSummary=<div className="pc-profile-summary"><div><GraduationCap/><span>Linked pupils<strong>{contact.links.length} enrolled</strong></span></div><div><CreditCard/><span>Total meal balances<strong>{isSarah?"£36.50":"Not recorded"}</strong></span></div><div><MessageSquare/><span>Communication history<strong>{contact.events.length} records</strong></span></div><div><ClipboardCheck/><span>Consent records<strong>{isSarah?"4 on file":"Awaiting records"}</strong></span></div></div>;
  return <ParentsShell current={`${contact.title==="No title"?"":`${contact.title} `}${contact.name}`}>
  <header className={isSarah?`${styles.identityHeader} pc-profile-header`:"pc-profile-header"}>
    {isSarah ? <>
      <div className={styles.profileCardTop}>
        <div className={styles.identityRow}>
          <span className={styles.portrait}>
            <img src={contact.photoUrl||DEFAULT_SARAH_PHOTO_URL} alt={`${contact.name} portrait`}/>
            <span className={styles.portraitMarker} aria-hidden="true"><Star/></span>
          </span>
          <div className={styles.identityText}>
            <h1>Mrs. Sarah Turner <span>(née Henderson)</span></h1>
            {profileBadges}
          </div>
        </div>
        {profileActions}
      </div>
      {profileSummary}
    </> : <>
      <div className="pc-profile-intro">
        <div className="pc-person">
          <PersonAvatar name={contact.name} large/>
          <div>
            <h1>{contact.title!=="No title"?`${contact.title} `:""}{contact.name}</h1>
            <div className="pc-inline">{profileBadges}</div>
            <p className="pc-muted">Contact ID: {id=== "sarah-turner"?"PAR-88204":id}</p>
          </div>
        </div>
        {profileActions}
      </div>
      {profileSummary}
    </>}
  </header>
  <div className="pc-profile-tabs" role="tablist" aria-label="Profile sections">{TABS.map(t=><button role="tab" aria-selected={tab===t} key={t} onClick={()=>setTab(t)}>{t}{t==="Linked children"&&<span>{contact.links.length}</span>}{t==="Communication history"&&<span>{contact.events.length}</span>}</button>)}</div>{notice&&<p role="status" className="pc-notice">{notice}</p>}
  <div className="pc-profile-layout"><aside className="pc-stack"><Panel title="Contact Details" icon={<ContactIcon/>} aside={<Pill tone="success">Primary channels</Pill>}><div className="pc-contact-channel"><Smartphone/><div><small>Primary UK mobile</small><a href={contact.mobile?`tel:${contact.mobile}`:undefined}>{contact.mobile||"Not recorded"}</a><span>{contact.mobileVerified?"Verified · SMS contact":"Verification required"}</span></div></div><div className="pc-contact-channel"><Phone/><div><small>Home telephone</small><a href={contact.landline?`tel:${contact.landline}`:undefined}>{contact.landline||"Not recorded"}</a><span>Landline / local network</span></div></div><div className="pc-contact-channel"><Mail/><div><small>Primary email</small><a href={contact.email?`mailto:${contact.email}`:undefined}>{contact.email||"Not recorded"}</a><span>Academic reports &amp; correspondence</span></div></div><div className="pc-contact-channel"><Home/><div><small>Residential address</small><strong>{restricted?"Address restricted":contact.address||"Not recorded"}</strong>{!restricted&&<strong>{contact.postcode}</strong>}<span>{restricted?"Check the pupil’s recorded restrictions.":[...new Set(contact.links.map(l=>l.residence))].join(" · ")}</span></div></div></Panel>
  <Panel title="Portal & Security" icon={<ShieldCheck/>}><dl className="pc-key-values"><div><dt>Account status</dt><dd><PortalPill status={contact.portal}/></dd></div><div><dt>Last login</dt><dd>{contact.lastLogin}</dd></div><div><dt>Identity provider</dt><dd>{contact.portal==="Active"?"School portal (demo)":"Not connected"}</dd></div><div><dt>Notification channels</dt><dd>{contact.email?"Email":""}{contact.email&&contact.mobile?" · ":""}{contact.mobile?"SMS":""}</dd></div></dl><button className="pc-button full" disabled={contact.portal==="Restricted"||!contact.email} onClick={()=>{try{log({id:crypto.randomUUID(),kind:"Email draft",title:"Parent portal invitation",body:`Invitation draft for ${contact.name}. The school office will provide activation details after checking the contact record.`,date:new Date().toISOString()});}catch{setNotice("Unable to save the invitation draft. Check browser storage.");}}}>Draft portal invitation</button><p className="pc-muted">Portal activity is illustrative. Authentication is not connected.</p></Panel>
  <Panel title="Emergency Protocol" icon={<Briefcase/>}><div className="pc-soft-block"><small>Employer &amp; role</small><strong>{contact.employer}</strong></div><div className="pc-soft-block"><small>Emergency contact routing</small><strong>{contact.links.some(l=>l.emergency)?"Included for linked pupils":"Not included"}</strong><p>Use the pupil’s contact priority order before escalating.</p></div>{isSarah&&<Link className="pc-soft-block pc-related-contact" href="/parents-and-carers/mark-turner"><small>Secondary contact · Priority 2</small><strong>Mr Mark Turner <ArrowUpRight/></strong><p>07700 900588</p></Link>}</Panel></aside>
  <div className="pc-stack">{visible("Linked children")&&<Panel title="Linked Children Registered at Trust" icon={<GraduationCap/>} aside={<div className={childStyles.panelMeta}><Pill tone="success">{contact.links.length} Pupils Active</Pill><Link className="pc-text-button" href={`/parents-and-carers/link?parent=${id}`}><Link2/>Link pupil</Link></div>}><div className={childStyles.grid}>{contact.links.map(link=>{const pupil=PUPILS.find(candidate=>candidate.id===link.pupilId);if(!pupil)return null;const medicalRecord=pupil.flags.find(flag=>flag.title==="Medical alert");const attendanceState=pupil.attendanceTone==="danger"?"Review needed":pupil.attendanceTone==="warning"?"Monitor":"On track";const recipient=link.reports?(link.priority==="1"?"Primary":"Secondary"):"Not assigned";return <article className={childStyles.card} key={pupil.id}><div className={childStyles.heading}><div className={childStyles.photo}>{pupil.photoUrl?<img src={pupil.photoUrl} alt=""/>:<PersonAvatar name={`${pupil.legalForename} ${pupil.legalSurname}`}/>}</div><div className={childStyles.pupilIdentity}><strong>{pupil.legalForename} {pupil.legalSurname}</strong><small>Form {pupil.form} · {pupil.house} House</small><small>UPN: {pupil.upn}</small></div><span className={childStyles.year}>{pupil.yearGroup}</span></div><div className={childStyles.metrics}><div><small>Attendance (YTD)</small><strong className={childStyles[pupil.attendanceTone]}>{pupil.attendance.toFixed(1)}% <span>{attendanceState}</span></strong></div><div><small>Recorded flags</small><strong>{pupil.flags.length} on file</strong></div></div><div className={childStyles.detail}><small>Medical record</small><strong>{medicalRecord?medicalRecord.label:"No medical flags recorded"}</strong></div><div className={childStyles.detail}><small>Relationship / PR</small><strong>{link.relationship} · {link.responsibility?"Full responsibility":"No responsibility recorded"}</strong></div><footer className={childStyles.footer}><div><span>Report recipient: <strong>{recipient}</strong></span><Link className={childStyles.editLink} href={`/parents-and-carers/link?parent=${id}&pupil=${pupil.id}`}>Edit relationship</Link></div><Link className={childStyles.dossierLink} href={`/pupils/${pupil.id}`}>Open {pupil.legalForename}’s dossier <ArrowUpRight/></Link></footer></article>;})}</div>{!contact.links.length&&<div className="pc-empty"><GraduationCap/><h3>No linked pupils yet</h3><p>Connect this contact to a pupil to record responsibilities and communication preferences.</p><Link className="pc-button primary" href={`/parents-and-carers/link?parent=${id}`}>Link a pupil</Link></div>}</Panel>}
  {visible("Parental responsibility")&&<Panel title="Parental Responsibility & Legal Records" icon={<ShieldCheck/>} aside={<Pill tone={verified?"success":"warning"}>{verified?"Recorded & verified":"Review required"}</Pill>}><p className="pc-section-description">Relationship-specific evidence, restrictions and permissions.</p>{contact.links.map(l=>{const p=PUPILS.find(p=>p.id===l.pupilId);return <div className="pc-legal-record" key={l.pupilId}><strong>{p?.legalForename} {p?.legalSurname}</strong><div className="pc-legal-grid"><div><small>Verification source</small><strong>{l.basis}</strong><p>{l.inspectionDate?`Inspected ${new Date(l.inspectionDate+"T12:00:00").toLocaleDateString("en-GB")}`:"Inspection not recorded"}</p></div><div><small>Court orders / restraints</small><strong className={l.restriction==="No restrictions recorded"?"pc-success-text":"pc-warning-text"}>{l.restriction}</strong><p>Collection: {l.collection}</p></div><div><small>Responsibility &amp; decisions</small><strong>{l.responsibility?"Parental responsibility recorded":"Parental responsibility not held"}</strong><p>{l.verification}</p></div></div></div>;})}{!contact.links.length&&<p className="pc-muted">Legal details are recorded when a pupil is linked.</p>}</Panel>}
  {visible("Communication history")&&<Panel title="Communication Audit Trail" icon={<History/>} aside={<button className="pc-text-button" onClick={()=>setCompose("Note")}>Add note</button>}><div className="pc-history">{contact.events.map(event=><article key={event.id}><span className={`pc-history-icon ${event.kind==="Call"?"call":""}`}>{event.kind==="Call"?<Phone/>:event.kind==="Email draft"?<Mail/>:<MessageSquare/>}</span><div><header><strong>{event.title}</strong><time>{eventDate(event.date)}</time></header><p>{event.body}</p><small>{event.kind==="Email draft"?"Draft only · not sent":`${event.kind} · local demo record`}</small></div></article>)}</div>{!contact.events.length&&<div className="pc-empty"><MessageSquare/><h3>No communication history</h3><p>Log a call or save a draft to start this contact’s record.</p></div>}</Panel>}
  {tab==="Overview"&&<Panel title="Financial & Cashless Catering Summary" icon={<CreditCard/>} aside={isSarah?<button className="pc-text-button" onClick={()=>downloadText("sarah-turner-demo-statement.txt","DEMO CATERING SUMMARY\nSarah Turner\nLiam Turner: £14.50\nJack Turner: £22.00\nTotal meal balances: £36.50\nOutstanding fees/trips: £0.00\nReference data only; no payment provider connected.")}><Download/>Statement</button>:undefined}>{isSarah?<><div className="pc-finance-grid"><div><small>Liam’s canteen balance</small><strong>£14.50</strong><p>Auto top-up · £2.80 daily cap</p></div><div><small>Jack’s canteen balance</small><strong>£22.00</strong><p>Standard · £2.80 daily cap</p></div><div><small>Outstanding fees / trips</small><strong className="pc-success-text">£0.00</strong><p>Reference balance settled</p></div></div><p className="pc-muted">Illustrative balances from the supplied profile. No payment service is connected.</p></>:<div className="pc-empty"><CreditCard/><p>No finance records available for this demo contact.</p></div>}</Panel>}
  {visible("Forms & consents")&&<Panel title="Consent Records & Communication Preferences" icon={<ClipboardCheck/>} aside={<Pill>2025–2026 session</Pill>}>{isSarah&&<div className="pc-consents">{[["Trust ICT acceptable use policy","Granted"],["Educational day visits & local walking trips","Granted"],["Academy photography, media & social video","Internal only"],["Cashless catering consent","On file"]].map(([label,status])=><div key={label}><CheckCircle2/><span><strong>{label}</strong><small>Supplied demonstration consent record</small></span><Pill tone={status==="Internal only"?"warning":"success"}>{status}</Pill></div>)}</div>}<div className="pc-preferences">{contact.links.map(l=><div key={l.pupilId}><strong>{PUPILS.find(p=>p.id===l.pupilId)?.legalForename} · Communication preferences</strong><div className="pc-inline">{[["Reports",l.reports],["Attendance",l.attendance],["Behaviour",l.behaviour],["Finance",l.finance]].map(([label,on])=><Pill key={String(label)} tone={on?"success":"neutral"}>{String(label)}: {on?"Yes":"No"}</Pill>)}</div><Link className="pc-text-button" href={`/parents-and-carers/link?parent=${id}&pupil=${l.pupilId}`}>Manage pupil preferences <ArrowUpRight/></Link></div>)}</div>{!contact.links.length&&<p className="pc-muted">Link a pupil to record communication preferences. No signed consent records are available.</p>}</Panel>}</div></div><ParentsFooter/>
  {editing&&<ContactDialog key={JSON.stringify(contact)} contact={contact} open onClose={()=>setEditing(false)} onSave={updated=>{save(contacts.map(c=>c.id===id?updated:c));setNotice("Contact details saved.");}}/>}{compose&&<CommunicationDialog key={compose} contacts={[contact]} kind={compose} open onClose={()=>setCompose(null)} onSave={log}/>}
  </ParentsShell>;
}
function ContactIcon(){return <FileText/>;}
