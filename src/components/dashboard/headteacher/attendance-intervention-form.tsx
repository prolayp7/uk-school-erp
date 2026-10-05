"use client";

import { useActionState } from "react";

import {
  createAttendanceIntervention,
  type InterventionActionState,
} from "@/app/(erp)/dashboard/headteacher/actions";

const initialState: InterventionActionState = {
  status: "idle",
  message: "",
};

export function AttendanceInterventionForm({
  pupilId,
  startsOn,
}: {
  pupilId: string;
  startsOn: string;
}) {
  const [state, action, pending] = useActionState(createAttendanceIntervention, initialState);

  return (
    <form action={action} className="mt-3 grid gap-2 border-t border-border pt-3 sm:grid-cols-[minmax(150px,0.6fr)_minmax(180px,1fr)_auto] sm:items-end">
      <input type="hidden" name="pupilId" value={pupilId} />
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Start date
        <input
          className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          type="date"
          name="startsOn"
          defaultValue={startsOn}
          required
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Intervention reason
        <input
          className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          type="text"
          name="reason"
          minLength={3}
          maxLength={240}
          placeholder="e.g. Attendance support meeting"
          required
        />
      </label>
      <button
        className="h-9 rounded-md bg-brand px-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Saving…" : "Create intervention"}
      </button>
      {state.message ? (
        <p className={`text-xs sm:col-span-3 ${state.status === "error" ? "text-destructive" : "text-success-text"}`} role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
