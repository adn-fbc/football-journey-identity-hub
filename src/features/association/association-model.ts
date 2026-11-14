import { addYears, differenceInCalendarDays, format, parseISO } from "date-fns";
import type { Status } from "@/data/types";
import type { AuditEntry, OrgRegistration, SanctionRequest } from "@/data/association-repository";

/** Registrations ending within this many days show a renewal prompt. */
export const EXPIRY_WARNING_DAYS = 60;

export type RegistrationState = "registered" | "expiring" | "expired" | "pending" | "rejected";

export function registrationState(reg: OrgRegistration, today: string): RegistrationState {
  if (reg.decision === "pending") return "pending";
  if (reg.decision === "rejected") return "rejected";
  if (!reg.validTo) return "pending";
  const daysLeft = differenceInCalendarDays(parseISO(reg.validTo), parseISO(today));
  if (daysLeft < 0) return "expired";
  if (daysLeft <= EXPIRY_WARNING_DAYS) return "expiring";
  return "registered";
}

export const daysUntil = (date: string, today: string) => differenceInCalendarDays(parseISO(date), parseISO(today));

export const REGISTRATION_BADGE: Record<RegistrationState, { status: Status; label: string }> = {
  registered: { status: "verified", label: "Registered" },
  expiring: { status: "pending", label: "Expiring soon" },
  expired: { status: "cancelled", label: "Expired" },
  pending: { status: "pending", label: "Awaiting review" },
  rejected: { status: "cancelled", label: "Not approved" },
};

export const SANCTION_BADGE: Record<SanctionRequest["decision"], { status: Status; label: string }> = {
  approved: { status: "verified", label: "Sanctioned" },
  pending: { status: "pending", label: "Awaiting sanction" },
  rejected: { status: "cancelled", label: "Not sanctioned" },
};

export const criteriaMet = (reg: OrgRegistration) => reg.criteria.filter((c) => c.met).length;

let auditSeq = 0;
const audit = (at: string, actor: string, action: string, subject: string): AuditEntry => ({ id: `a-new-${++auditSeq}`, at, actor, action, subject });

/** Approving a registration sets a one-year validity from the decision date and records who decided. */
export function approveRegistration(reg: OrgRegistration, approver: string, at: string, subject: string) {
  const day = at.slice(0, 10);
  const validTo = format(addYears(parseISO(day), 1), "yyyy-MM-dd");
  const registration: OrgRegistration = { ...reg, decision: "approved", validFrom: day, validTo, decidedBy: approver, decidedAt: at };
  return { registration, entry: audit(at, approver, reg.kind === "renewal" ? "Approved registration renewal" : "Approved new registration", subject) };
}

export function rejectRegistration(reg: OrgRegistration, approver: string, at: string, subject: string) {
  const registration: OrgRegistration = { ...reg, decision: "rejected", decidedBy: approver, decidedAt: at };
  return { registration, entry: audit(at, approver, "Returned registration for changes", subject) };
}

/** A renewal keeps the current validity visible until the association decides. */
export function submitRenewal(reg: OrgRegistration, at: string): OrgRegistration {
  return { ...reg, kind: "renewal", decision: "pending", submittedAt: at.slice(0, 10), decidedBy: undefined, decidedAt: undefined };
}

export function decideSanction(req: SanctionRequest, decision: "approved" | "rejected", approver: string, at: string, subject: string) {
  const request: SanctionRequest = { ...req, decision, decidedBy: approver, decidedAt: at };
  return { request, entry: audit(at, approver, decision === "approved" ? "Sanctioned competition" : "Declined sanctioning", subject) };
}

/** Median whole days between submission and decision, over decided requests. */
export function medianDaysToDecision(requests: SanctionRequest[]): number | undefined {
  const days = requests
    .filter((r) => r.decision !== "pending" && r.decidedAt)
    .map((r) => differenceInCalendarDays(parseISO(r.decidedAt!.slice(0, 10)), parseISO(r.submittedAt)))
    .sort((a, b) => a - b);
  if (days.length === 0) return undefined;
  const mid = Math.floor(days.length / 2);
  return days.length % 2 ? days[mid]! : Math.round((days[mid - 1]! + days[mid]!) / 2);
}
