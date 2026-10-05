"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  Baby,
  CheckCircle2,
  ChevronRight,
  FileUp,
  Heart,
  Home,
  IdCard,
  Pencil,
  School,
  Stethoscope,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import { AppShell } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPill } from "@/components/dashboard/status-pill";
import type { Pupil } from "@/lib/pupils-data";

type ContactState = {
  id: string;
  relationship: string;
  forename: string;
  surname: string;
  mobile: string;
  email: string;
  parentalResponsibility: boolean;
  smsAlerts: boolean;
};

type FormState = {
  legalSurname: string;
  legalForename: string;
  middleNames: string;
  preferredForename: string;
  dob: string;
  gender: string;
  homeLanguage: string;
  countryOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
  county: string;
  postcode: string;
  livingArrangements: string;
  admissionNo: string;
  admissionDate: string;
  enrolmentStatus: string;
  travelMode: string;
  yearGroup: string;
  form: string;
  house: string;
  sendStatus: string;
  contacts: ContactState[];
  allergies: string;
  healthcarePlan: string;
  gpPractice: string;
  medicationOnPremises: string;
  consents: Record<string, boolean>;
};

const CONSENT_ITEMS = [
  { key: "ict", label: "Trust ICT acceptable use agreement", note: "Network login, Google Classroom, filtered broadband access.", defaultChecked: true },
  { key: "visits", label: "Educational day visits & local walking trips", note: "Off-site curricular activities within the LA boundary.", defaultChecked: true },
  { key: "internalPhotos", label: "Internal academy MIS photography", note: "Internal identification, registers, and security passes only.", defaultChecked: true },
  { key: "marketing", label: "Public trust website & external media marketing", note: "Promotional materials, press releases, social channels.", defaultChecked: false },
  { key: "biometric", label: "Biometric cashless catering consent", note: "Finger-scan algorithm for cafeteria meal purchases.", defaultChecked: true },
];

function emptyContact(id: string): ContactState {
  return {
    id,
    relationship: "Mother",
    forename: "",
    surname: "",
    mobile: "",
    email: "",
    parentalResponsibility: true,
    smsAlerts: true,
  };
}

function defaultState(): FormState {
  return {
    legalSurname: "",
    legalForename: "",
    middleNames: "",
    preferredForename: "",
    dob: "",
    gender: "",
    homeLanguage: "",
    countryOfBirth: "United Kingdom",
    addressLine1: "",
    addressLine2: "",
    town: "",
    county: "",
    postcode: "",
    livingArrangements: "Lives with both parents",
    admissionNo: "",
    admissionDate: "",
    enrolmentStatus: "Active on-roll",
    travelMode: "Walks / independent",
    yearGroup: "",
    form: "",
    house: "",
    sendStatus: "No SEN recorded (N)",
    contacts: [emptyContact("contact-1")],
    allergies: "",
    healthcarePlan: "No plan required",
    gpPractice: "",
    medicationOnPremises: "None",
    consents: Object.fromEntries(CONSENT_ITEMS.map((c) => [c.key, c.defaultChecked])),
  };
}

function stateFromPupil(pupil: Pupil): FormState {
  const base = defaultState();
  return {
    ...base,
    legalSurname: pupil.legalSurname,
    legalForename: pupil.legalForename,
    preferredForename: pupil.preferredName ?? "",
    dob: "",
    gender: pupil.gender,
    admissionNo: pupil.admissionNo,
    admissionDate: pupil.enrolmentDate,
    enrolmentStatus: pupil.status === "Active" ? "Active on-roll" : pupil.status,
    yearGroup: pupil.yearGroup,
    form: pupil.form,
    house: pupil.house,
    sendStatus: pupil.sendCode ? `SEND support (Code ${pupil.sendCode})` : "No SEN recorded (N)",
    contacts:
      pupil.carers?.map((carer, index) => ({
        id: `contact-${index + 1}`,
        relationship: carer.relationship,
        forename: carer.name.split(" ")[0] ?? "",
        surname: carer.name.split(" ").slice(1).join(" ") || pupil.legalSurname,
        mobile: carer.mobile,
        email: carer.email,
        parentalResponsibility: carer.parentalResponsibility,
        smsAlerts: true,
      })) ?? base.contacts,
  };
}

const STEPS: Array<{ key: string; label: string; hint: string; icon: LucideIcon }> = [
  { key: "identity", label: "Personal identity", hint: "Legal name, DOB, language", icon: Baby },
  { key: "address", label: "Address & residence", hint: "UK postcode verification", icon: Home },
  { key: "admission", label: "Admission & UPN", hint: "Statutory identifier, status", icon: IdCard },
  { key: "academic", label: "Academic placement", hint: "Year, form, house", icon: School },
  { key: "carers", label: "Parent / carer details", hint: "Parental responsibility", icon: Users },
  { key: "medical", label: "Medical & dietary", hint: "Care plans & allergies", icon: Stethoscope },
  { key: "consents", label: "Consents & GDPR", hint: "Biometric, ICT, photos", icon: Heart },
];

const REQUIRED_FIELD_COUNT = 12;

export function PupilEnrolmentForm({ pupil }: { pupil?: Pupil }) {
  const isEdit = Boolean(pupil);
  const [form, setForm] = useState<FormState>(() => (pupil ? stateFromPupil(pupil) : defaultState()));
  const [activeStep, setActiveStep] = useState("identity");
  const [submitted, setSubmitted] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveStep(visible[0].target.id.replace("section-", ""));
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
  }

  function updateContact(id: string, patch: Partial<ContactState>) {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }

  function addContact() {
    setForm((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { ...emptyContact(`contact-${prev.contacts.length + 1}`), relationship: "Father", parentalResponsibility: false }],
    }));
  }

  function removeContact(id: string) {
    setForm((prev) => ({ ...prev, contacts: prev.contacts.filter((c) => c.id !== id) }));
  }

  const requiredFilled = useMemo(() => {
    const primary = form.contacts[0];
    const fields = [
      form.legalSurname,
      form.legalForename,
      form.dob,
      form.gender,
      form.homeLanguage,
      form.addressLine1,
      form.town,
      form.postcode,
      form.admissionDate,
      form.yearGroup,
      form.form,
      primary?.mobile ?? "",
    ];
    return fields.filter((f) => f.trim().length > 0).length;
  }, [form]);

  const completion = Math.round((requiredFilled / REQUIRED_FIELD_COUNT) * 100);
  const isComplete = requiredFilled === REQUIRED_FIELD_COUNT;

  function handleFinalise() {
    setSubmitted(true);
    if (isComplete) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById("section-identity")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const initials = `${form.legalForename[0] ?? ""}${form.legalSurname[0] ?? ""}`.toUpperCase() || "—";

  return (
    <AppShell
      activePath="/pupils"
      user={{ name: "Dr Rachel Holloway", role: "Headteacher & SLT", initials: "RH" }}
    >
      <div className="flex flex-col gap-2">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/pupils" className="transition-colors hover:text-brand">
            Pupils
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">{isEdit ? "Edit pupil record" : "Enrol new pupil"}</span>
        </nav>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-[28px]">
                {isEdit ? `Edit Pupil Record — ${pupil!.legalForename} ${pupil!.legalSurname}` : "Enrol New Pupil"}
              </h1>
              <StatusPill tone="warning" icon={<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning-text" />}>
                Statutory census ingest active
              </StatusPill>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              DfE on-roll registration, National Pupil Database alignment, and Common Transfer File (CTF)
              compatibility.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" className="gap-2" disabled>
              <FileUp className="h-4 w-4 text-brand" />
              Import DfE CTF XML
            </Button>
            <Button asChild variant="outline">
              <Link href="/pupils">Save draft & exit</Link>
            </Button>
            <Button onClick={handleFinalise} className="gap-2 bg-brand text-white hover:bg-brand-hover">
              <CheckCircle2 className="h-4 w-4" />
              Validate & finalise
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky status bar */}
      <div className="sticky top-[3.7rem] z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-bg text-success-text">
            <ChevronRight className="h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Auto-saved to local school store</span>
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                Draft only — not persisted
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {STEPS.find((s) => s.key === activeStep)?.label ?? "Personal identity"} active • Zero statutory
              blocking conflicts
            </span>
          </div>
        </div>
        <div className="flex min-w-[220px] items-center gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Enrolment completion</span>
              <span className="font-semibold text-brand">{completion}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>

      {submitted ? (
        isComplete ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-success-border bg-success-bg p-4 text-sm text-success-text">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <strong className="block font-semibold">Statutory minimum fields validated</strong>
              This record is ready to submit to the MIS. Submission isn&apos;t wired up in this design preview.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 rounded-xl border border-warning-border bg-warning-bg p-4 text-sm text-warning-text">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <strong className="block font-semibold">
                {REQUIRED_FIELD_COUNT - requiredFilled} statutory field{REQUIRED_FIELD_COUNT - requiredFilled === 1 ? "" : "s"} still required
              </strong>
              Complete the highlighted sections below before finalising enrolment.
            </div>
          </div>
        )
      ) : null}

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left rail */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <div className="flex flex-col gap-1 rounded-xl bg-card p-4 shadow-sm">
            <div className="mb-1 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Statutory checklist
              </span>
              <p className="text-xs text-muted-foreground">DfE autumn return 2025</p>
            </div>
            {STEPS.map((step, index) => {
              const isActive = activeStep === step.key;
              return (
                <a
                  key={step.key}
                  href={`#section-${step.key}`}
                  className={
                    isActive
                      ? "flex items-center justify-between rounded-lg bg-brand-tint p-2.5 text-brand transition-all"
                      : "flex items-center justify-between rounded-lg p-2.5 text-foreground/80 transition-all hover:bg-muted"
                  }
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={
                        isActive
                          ? "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white"
                          : "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground"
                      }
                    >
                      {index + 1}
                    </span>
                    <div className="flex min-w-0 flex-col truncate">
                      <span className="truncate text-sm font-medium leading-tight">{step.label}</span>
                      <span className="truncate text-[11px] leading-tight opacity-80">{step.hint}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Candidate dossier
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-lg font-bold text-white">
                {initials}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold leading-snug text-foreground">
                  {form.legalForename || form.legalSurname ? `${form.legalForename} ${form.legalSurname}` : "New candidate"}
                </span>
                <span className="text-xs text-muted-foreground">{form.dob ? `DOB: ${form.dob}` : "DOB not yet entered"}</span>
                <div className="mt-1 flex items-center gap-1.5">
                  {form.yearGroup ? (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground">{form.yearGroup}</span>
                  ) : null}
                  {form.form ? (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground">Form {form.form}</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-lg bg-muted p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">UPN status:</span>
                <span className="font-mono font-semibold text-brand">{isEdit ? "Allocated" : "Provisional"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Safeguarding:</span>
                <span className="text-muted-foreground">None active</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-brand" />
              <span className="text-sm font-medium text-foreground">Common Transfer File</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Has this pupil transferred from another school? Uploading a CTF auto-populates DfE identifiers and
              Key Stage history.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Browse local CTF XML (.xml)
            </Button>
          </div>
        </div>

        {/* Right form */}
        <div className="flex flex-col gap-5 lg:col-span-9">
          <FormSection
            id="identity"
            step={1}
            title="Personal identity"
            subtitle="Legal identification as stated on official birth certificate or adoption order."
            innerRef={(el) => { sectionRefs.current.identity = el; }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Legal surname" required>
                <Input value={form.legalSurname} onChange={(e) => update("legalSurname", e.target.value)} />
              </Field>
              <Field label="Legal forename" required>
                <Input value={form.legalForename} onChange={(e) => update("legalForename", e.target.value)} />
              </Field>
              <Field label="Middle name(s)">
                <Input value={form.middleNames} onChange={(e) => update("middleNames", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Preferred forename">
                <Input value={form.preferredForename} onChange={(e) => update("preferredForename", e.target.value)} placeholder={form.legalForename || "Leave blank if unchanged"} />
              </Field>
              <Field label="Date of birth" required>
                <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
              </Field>
              <Field label="Legal gender" required>
                <SelectField value={form.gender} onChange={(v) => update("gender", v)} options={["Male", "Female"]} placeholder="Select" />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Home language" required>
                <Input value={form.homeLanguage} onChange={(e) => update("homeLanguage", e.target.value)} placeholder="e.g. English (ENG)" />
              </Field>
              <Field label="Country of birth">
                <Input value={form.countryOfBirth} onChange={(e) => update("countryOfBirth", e.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection
            id="address"
            step={2}
            title="Address & residence"
            subtitle="UK residential address for statutory correspondence and catchment verification."
            innerRef={(el) => { sectionRefs.current.address = el; }}
          >
            <Field label="Address line 1" required>
              <Input value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} />
            </Field>
            <Field label="Address line 2">
              <Input value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Town / city" required>
                <Input value={form.town} onChange={(e) => update("town", e.target.value)} />
              </Field>
              <Field label="County">
                <Input value={form.county} onChange={(e) => update("county", e.target.value)} />
              </Field>
              <Field label="UK postcode" required>
                <Input value={form.postcode} onChange={(e) => update("postcode", e.target.value.toUpperCase())} />
              </Field>
            </div>
            <Field label="Living arrangements">
              <SelectField
                value={form.livingArrangements}
                onChange={(v) => update("livingArrangements", v)}
                options={["Lives with both parents", "Lives with mother", "Lives with father", "Shared care", "Looked after child", "Other"]}
              />
            </Field>
          </FormSection>

          <FormSection
            id="admission"
            step={3}
            title="Admission & UPN"
            subtitle="Statutory identifier allocation and admission status."
            innerRef={(el) => { sectionRefs.current.admission = el; }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Admission no. (internal)">
                <Input value={form.admissionNo} onChange={(e) => update("admissionNo", e.target.value)} />
              </Field>
              <Field label="Date of admission" required>
                <Input type="date" value={form.admissionDate} onChange={(e) => update("admissionDate", e.target.value)} />
              </Field>
              <Field label="Enrolment status" required>
                <SelectField
                  value={form.enrolmentStatus}
                  onChange={(v) => update("enrolmentStatus", v)}
                  options={["Active on-roll", "Dual-registered", "Guest student", "Admissions pending"]}
                />
              </Field>
            </div>
            <Field label="Travel mode">
              <SelectField
                value={form.travelMode}
                onChange={(v) => update("travelMode", v)}
                options={["Walks / independent", "School transport", "Parent drop-off", "Public transport", "Cycles"]}
              />
            </Field>
          </FormSection>

          <FormSection
            id="academic"
            step={4}
            title="Academic placement"
            subtitle="Year group, form, and pastoral assignment."
            innerRef={(el) => { sectionRefs.current.academic = el; }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Academic year group" required>
                <SelectField
                  value={form.yearGroup}
                  onChange={(v) => update("yearGroup", v)}
                  options={["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"]}
                  placeholder="Select year group"
                />
              </Field>
              <Field label="Registration form" required>
                <Input value={form.form} onChange={(e) => update("form", e.target.value)} placeholder="e.g. 7B" />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Collegiate house">
                <SelectField value={form.house} onChange={(v) => update("house", v)} options={["Bede", "Cuthbert", "Aidan"]} placeholder="Select house" />
              </Field>
              <Field label="SEND status">
                <SelectField
                  value={form.sendStatus}
                  onChange={(v) => update("sendStatus", v)}
                  options={["No SEN recorded (N)", "SEND support (Code K)", "SEND support (Code E — EHCP)"]}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            id="carers"
            step={5}
            title="Parent & carer relationships"
            subtitle="Statutory parental responsibility under Children Act 1989 and emergency call chains."
            innerRef={(el) => { sectionRefs.current.carers = el; }}
            action={
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addContact}>
                <UserPlus className="h-4 w-4" />
                Add another contact
              </Button>
            }
          >
            {form.contacts.map((contact, index) => (
              <div key={contact.id} className="flex flex-col gap-3 rounded-xl bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint text-[11px] font-bold text-brand">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {index === 0 ? "Primary contact" : "Secondary contact"} · {contact.relationship || "Relationship"}
                    </span>
                    {index === 0 ? <StatusPill tone="success">Priority 1</StatusPill> : <StatusPill tone="neutral">Priority {index + 1}</StatusPill>}
                  </div>
                  {index > 0 ? (
                    <button type="button" onClick={() => removeContact(contact.id)} className="text-xs font-medium text-danger-text hover:underline">
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <Field label="Relationship" compact>
                    <SelectField value={contact.relationship} onChange={(v) => updateContact(contact.id, { relationship: v })} options={["Mother", "Father", "Guardian", "Foster carer", "Grandparent"]} />
                  </Field>
                  <Field label="Forename" compact>
                    <Input className="h-9" value={contact.forename} onChange={(e) => updateContact(contact.id, { forename: e.target.value })} />
                  </Field>
                  <Field label="Surname" compact>
                    <Input className="h-9" value={contact.surname} onChange={(e) => updateContact(contact.id, { surname: e.target.value })} />
                  </Field>
                  <Field label="UK mobile number" compact required={index === 0}>
                    <Input className="h-9 font-mono" value={contact.mobile} onChange={(e) => updateContact(contact.id, { mobile: e.target.value })} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Field label="Email address" compact className="md:col-span-1">
                    <Input className="h-9" type="email" value={contact.email} onChange={(e) => updateContact(contact.id, { email: e.target.value })} />
                  </Field>
                  <div className="flex items-center gap-6 pt-5 md:col-span-2">
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={contact.parentalResponsibility}
                        onCheckedChange={(c) => updateContact(contact.id, { parentalResponsibility: c === true })}
                      />
                      <span className="text-xs font-medium text-foreground">Holds parental responsibility</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox checked={contact.smsAlerts} onCheckedChange={(c) => updateContact(contact.id, { smsAlerts: c === true })} />
                      <span className="text-xs font-medium text-foreground">Send SMS attendance alerts</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </FormSection>

          <FormSection
            id="medical"
            step={6}
            title="Medical & dietary"
            subtitle="Care plans, allergies, and medication held on school premises."
            innerRef={(el) => { sectionRefs.current.medical = el; }}
          >
            <Field label="Identified allergies & dietary restrictions">
              <textarea
                value={form.allergies}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => update("allergies", e.target.value)}
                rows={3}
                placeholder="e.g. Peanut allergy (EpiPen carried), gluten-free diet"
                className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Healthcare plan requirement">
                <SelectField
                  value={form.healthcarePlan}
                  onChange={(v) => update("healthcarePlan", v)}
                  options={["No plan required", "Asthma protocol", "Anaphylaxis protocol", "Epilepsy protocol", "Other individual healthcare plan"]}
                />
              </Field>
              <Field label="Doctor's surgery / GP practice">
                <Input value={form.gpPractice} onChange={(e) => update("gpPractice", e.target.value)} />
              </Field>
            </div>
            <Field label="Medication kept on school premises">
              <SelectField value={form.medicationOnPremises} onChange={(v) => update("medicationOnPremises", v)} options={["None", "Inhaler", "EpiPen", "Prescribed daily medication", "Other"]} />
            </Field>
          </FormSection>

          <FormSection
            id="consents"
            step={7}
            title="Statutory consents & permissions"
            subtitle="UK GDPR and Protection of Freedoms Act 2012 verified parental permissions."
            innerRef={(el) => { sectionRefs.current.consents = el; }}
          >
            <div className="flex flex-col gap-2.5">
              {CONSENT_ITEMS.map((item) => (
                <label key={item.key} className="flex cursor-pointer items-center justify-between rounded-lg bg-background p-3 transition-colors hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={form.consents[item.key]}
                      onCheckedChange={(c) => update("consents", { ...form.consents, [item.key]: c === true })}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.note}</span>
                    </div>
                  </div>
                  <span className={form.consents[item.key] ? "text-xs font-semibold text-success-text" : "text-xs text-muted-foreground"}>
                    {form.consents[item.key] ? "Granted" : "Declined"}
                  </span>
                </label>
              ))}
            </div>
          </FormSection>
        </div>
      </div>

      {/* Bottom action tray */}
      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card/95 p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/pupils">Cancel enrolment</Link>
          </Button>
          <Button variant="outline">Save as draft</Button>
        </div>
        <div className="flex items-center gap-3">
          <span className={isComplete ? "hidden items-center gap-1.5 pr-2 text-xs font-medium text-success-text sm:flex" : "hidden items-center gap-1.5 pr-2 text-xs font-medium text-muted-foreground sm:flex"}>
            <CheckCircle2 className="h-[18px] w-[18px]" />
            {isComplete ? "All statutory DfE minimum fields validated" : `${requiredFilled} of ${REQUIRED_FIELD_COUNT} statutory fields complete`}
          </span>
          <Button onClick={handleFinalise} className="gap-2 bg-brand text-white shadow-md hover:bg-brand-hover">
            <Pencil className="h-4 w-4" />
            Validate & finalise pupil enrolment
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function FormSection({
  id,
  step,
  title,
  subtitle,
  action,
  children,
  innerRef,
}: {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  innerRef: (el: HTMLElement | null) => void;
}) {
  return (
    <section id={`section-${id}`} ref={innerRef} className="flex scroll-mt-32 flex-col gap-4 rounded-xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-brand-tint font-mono text-xs font-bold text-brand">
            {step}
          </span>
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  compact,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  compact?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <Label className={compact ? "text-xs text-muted-foreground" : "text-xs font-medium text-foreground"}>
        {label} {required ? <span className="text-danger-text">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full">
        <SelectValue placeholder={placeholder ?? "Select"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
