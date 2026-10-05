"use client";

import {
  AlertCircle,
  Briefcase,
  Gavel,
  Home,
  Key,
  Mail,
  Phone,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusPill } from "@/components/dashboard/status-pill";
import type { Carer, Pupil } from "@/lib/pupils-data";
import { PUPILS } from "@/lib/pupils-data";
import Link from "next/link";

export function CarerDrawer({
  carer,
  pupil,
  open,
  onOpenChange,
}: {
  carer: Carer | null;
  pupil: Pupil;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const siblings = (pupil.siblingIds ?? [])
    .map((id) => PUPILS.find((p) => p.id === id))
    .filter((p): p is Pupil => Boolean(p));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 data-[side=right]:sm:max-w-xl">
        <SheetTitle className="sr-only">{carer?.name ?? "Carer"} contact details</SheetTitle>
        {carer ? (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-3 bg-muted/40 p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                  <Home className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Priority {carer.priority} contact
                    </span>
                    {carer.portalActive ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-success-text">
                        <span className="h-1.5 w-1.5 rounded-full bg-success-text" /> App user active
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-1 font-heading text-xl font-semibold text-foreground">{carer.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {carer.relationship} of{" "}
                    <strong className="text-foreground">
                      {pupil.legalForename} {pupil.legalSurname} ({pupil.form})
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4">
                <Gavel className="mt-0.5 h-[22px] w-[22px] flex-shrink-0 text-brand" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Statutory parental responsibility</h3>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    Status:{" "}
                    <span className={carer.parentalResponsibility ? "font-bold text-success-text" : "font-bold text-muted-foreground"}>
                      {carer.parentalResponsibility ? "Yes" : "No"}
                    </span>{" "}
                    (Section 576 Education Act 1996)
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Legally entitled to receive academic reports, statutory census notifications, and authorise
                    educational visits and medical permissions.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-heading text-base font-semibold text-foreground">Contact channels</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="block text-[11px] font-semibold uppercase text-muted-foreground">
                          Mobile telephone
                        </span>
                        <span className="font-mono text-sm font-semibold text-foreground">{carer.mobile}</span>
                      </div>
                    </div>
                    {carer.mobileVerified ? <StatusPill tone="success">SMS verified</StatusPill> : null}
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="block text-[11px] font-semibold uppercase text-muted-foreground">
                          Email address
                        </span>
                        <span className="text-sm font-medium text-foreground">{carer.email}</span>
                      </div>
                    </div>
                    {carer.emailPortalActive ? <StatusPill tone="success">Portal active</StatusPill> : null}
                  </div>
                  {carer.workPhone ? (
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <span className="block text-[11px] font-semibold uppercase text-muted-foreground">
                            Work telephone
                          </span>
                          <span className="font-mono text-sm text-foreground">{carer.workPhone}</span>
                        </div>
                      </div>
                      {carer.workPhoneNote ? (
                        <span className="text-xs text-muted-foreground">{carer.workPhoneNote}</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-heading text-base font-semibold text-foreground">Residential address</h4>
                <div className="space-y-2 rounded-lg bg-muted/40 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <Home className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">{carer.address.line1}</p>
                        <p className="text-foreground">{carer.address.line2}</p>
                        <p className="font-mono font-semibold text-foreground">{carer.address.postcode}</p>
                      </div>
                    </div>
                    {carer.address.livesWithPupil ? (
                      <StatusPill tone="success" className="flex-shrink-0">
                        Lives with pupil
                      </StatusPill>
                    ) : null}
                  </div>
                  {carer.address.verifiedDate ? (
                    <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                      <span>Proof of address verified via council tax bill</span>
                      <span className="font-mono">{carer.address.verifiedDate}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {siblings.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-heading text-base font-semibold text-foreground">Linked siblings at academy</h4>
                  {siblings.map((sib) => (
                    <div key={sib.id} className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-tint text-xs font-bold text-brand">
                          {sib.initials}
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-foreground">
                            {sib.legalForename} {sib.legalSurname}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {sib.yearGroup} · Form {sib.form} · UPN: {sib.upn}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/pupils/${sib.id}`}
                        className="rounded px-2.5 py-1 text-xs font-semibold text-brand hover:bg-brand-tint"
                      >
                        View record
                      </Link>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>Communication protocol and portal audit history mirror the school&apos;s records — editing is not wired up in this design preview.</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-card p-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close panel
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="gap-1.5">
                  <Key className="h-4 w-4" />
                  Reset portal auth
                </Button>
                <Button className="gap-1.5 bg-brand text-white hover:bg-brand-hover">
                  <Phone className="h-4 w-4" />
                  Edit contact
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
