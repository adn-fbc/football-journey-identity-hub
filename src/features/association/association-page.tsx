import { CalendarClock, CheckCircle2, ClipboardList, FileCheck2, Landmark, ShieldCheck, Timer, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { OrgCrest } from "@/components/ds/avatars";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { PageHeader } from "@/components/ds/page-header";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/ds/page-tabs";
import { PrototypeNotice } from "@/components/ds/prototype-notice";
import { InfoList, Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { EmptyState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { Button } from "@/components/ui/button";
import {
  ASSOCIATION_NAME, ASSOCIATION_OFFICIAL, ORGANIZER_COMPETITION_IDS, competitionDates, competitionName, listAuditLog,
  listRegistrations, listSanctionRequests, organizationName, type AuditEntry, type OrgRegistration, type SanctionRequest,
} from "@/data/association-repository";
import { MOCK_TODAY } from "@/data/mock";
import { getAssociationView, MANAGED_ORGANIZATION_ID } from "@/lib/association-access";
import { fmtDate } from "@/lib/format";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";
import {
  EXPIRY_WARNING_DAYS, REGISTRATION_BADGE, SANCTION_BADGE, approveRegistration, criteriaMet, daysUntil, decideSanction,
  medianDaysToDecision, registrationState, rejectRegistration, submitRenewal,
} from "./association-model";

/** Prototype "now": the mock calendar date with the real clock time. */
const nowStamp = () => `${MOCK_TODAY}T${new Date().toTimeString().slice(0, 8)}`;
const fmtStamp = (at: string) => fmtDate(at.slice(0, 10)) + " · " + at.slice(11, 16);

/** Role-aware association workspace: officials decide, organizations and organizers track their requests. */
export function AssociationPage() {
  const { role, ready } = useRole();
  const view = getAssociationView(role);
  const [registrations, setRegistrations] = useState(listRegistrations);
  const [sanctions, setSanctions] = useState(listSanctionRequests);
  const [audit, setAudit] = useState(listAuditLog);

  const log = (entry: AuditEntry) => setAudit((a) => [entry, ...a]);
  const replaceRegistration = (next: OrgRegistration) => setRegistrations((rs) => rs.map((r) => (r.id === next.id ? next : r)));
  const replaceSanction = (next: SanctionRequest) => setSanctions((rs) => rs.map((r) => (r.id === next.id ? next : r)));

  const description =
    view === "official" ? `${ASSOCIATION_NAME} · registrations, renewals and sanctioning`
    : view === "organization" ? `Your organization's registration with ${ASSOCIATION_NAME}`
    : view === "organizer" ? `Sanctioning for the competitions you run, approved by ${ASSOCIATION_NAME}`
    : "Regional governance for clubs and competitions";

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Preview · Association" title="Association" description={description} />
      <PrototypeNotice moduleId="association" />
      {!ready ? (
        <LoadingState rows={3} />
      ) : view === "none" ? (
        <PermissionState
          title="Association is for officials, organization admins and organizers"
          description="Switch to Association, Organization Admin or Competition Organizer to see registrations and sanctioning."
        />
      ) : view === "official" ? (
        <OfficialView
          registrations={registrations}
          sanctions={sanctions}
          audit={audit}
          onRegistration={(r, entry) => { replaceRegistration(r); log(entry); }}
          onSanction={(r, entry) => { replaceSanction(r); log(entry); }}
        />
      ) : view === "organization" ? (
        <OrganizationView
          registration={registrations.find((r) => r.organizationId === MANAGED_ORGANIZATION_ID)!}
          onRenew={(r) => { replaceRegistration(r); toast.success("Renewal submitted", { description: "The association will review it. Your current registration stays valid meanwhile." }); }}
        />
      ) : (
        <OrganizerView
          requests={sanctions.filter((s) => ORGANIZER_COMPETITION_IDS.includes(s.competitionId))}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Official */

function OfficialView({
  registrations, sanctions, audit, onRegistration, onSanction,
}: {
  registrations: OrgRegistration[]; sanctions: SanctionRequest[]; audit: AuditEntry[];
  onRegistration: (r: OrgRegistration, e: AuditEntry) => void; onSanction: (r: SanctionRequest, e: AuditEntry) => void;
}) {
  const states = registrations.map((r) => registrationState(r, MOCK_TODAY));
  const pendingRegs = registrations.filter((r) => r.decision === "pending");
  const pendingSanctions = sanctions.filter((s) => s.decision === "pending");
  const median = medianDaysToDecision(sanctions);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Registered organizations" value={states.filter((s) => s === "registered" || s === "expiring").length} hint={`of ${registrations.length} in the region`} icon={Landmark} />
        <StatCard label="Awaiting your review" value={pendingRegs.length + pendingSanctions.length} hint={`${pendingRegs.length} registrations · ${pendingSanctions.length} sanctioning`} icon={ClipboardList} />
        <StatCard label="Expiring or expired" value={states.filter((s) => s === "expiring" || s === "expired").length} hint={`Within ${EXPIRY_WARNING_DAYS} days or past end date`} icon={CalendarClock} trend="down" />
        <StatCard label="Median time to sanction" value={median === undefined ? "—" : `${median} days`} hint="Submission to decision" icon={Timer} />
      </div>

      <PageTabs defaultValue="registrations">
        <PageTabsList>
          <PageTabsTrigger value="registrations">Registrations <Count n={pendingRegs.length} /></PageTabsTrigger>
          <PageTabsTrigger value="sanctioning">Sanctioning <Count n={pendingSanctions.length} /></PageTabsTrigger>
          <PageTabsTrigger value="audit">Audit log</PageTabsTrigger>
        </PageTabsList>

        <PageTabsContent value="registrations" className="space-y-4">
          <Section title="Organization registrations" description="Organization-level data only. Player details stay with the player and their organization." flush>
            <ul className="divide-y">
              {[...registrations].sort((a, b) => Number(b.decision === "pending") - Number(a.decision === "pending")).map((r) => (
                <RegistrationRow key={r.id} reg={r} onDecide={onRegistration} />
              ))}
            </ul>
          </Section>
        </PageTabsContent>

        <PageTabsContent value="sanctioning">
          <Section title="Competition sanctioning" description="Approved competitions show “Sanctioned” on their page, and players' participation is marked verified." flush>
            <ul className="divide-y">
              {[...sanctions].sort((a, b) => Number(b.decision === "pending") - Number(a.decision === "pending")).map((s) => (
                <SanctionRow key={s.id} req={s} onDecide={onSanction} canDecide />
              ))}
            </ul>
          </Section>
        </PageTabsContent>

        <PageTabsContent value="audit">
          <Section title="Audit log" description="Every decision is recorded with who decided and when." flush>
            <AuditList entries={audit} />
          </Section>
        </PageTabsContent>
      </PageTabs>
    </>
  );
}

function Count({ n }: { n: number }) {
  if (!n) return null;
  return <span className="rounded-full bg-warning/15 px-1.5 text-xs font-bold text-warning">{n}</span>;
}

function RegistrationRow({ reg, onDecide }: { reg: OrgRegistration; onDecide: (r: OrgRegistration, e: AuditEntry) => void }) {
  const state = registrationState(reg, MOCK_TODAY);
  const name = organizationName(reg.organizationId);
  const badge = REGISTRATION_BADGE[state];
  const met = criteriaMet(reg);
  return (
    <li className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <OrgCrest orgId={reg.organizationId} size="md" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-semibold">{name}</span>
            <StatusBadge status={badge.status} label={badge.label} />
          </div>
          <p className="mt-0.5 text-small text-muted-foreground">
            {reg.decision === "pending"
              ? `${reg.kind === "renewal" ? "Renewal" : "New registration"} · submitted ${fmtDate(reg.submittedAt)}`
              : reg.validTo ? `Valid until ${fmtDate(reg.validTo)}` : "No validity recorded"}
            {" · "}{reg.registeredPlayers} players · {reg.licensedCoaches} licensed coaches
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:justify-end">
        <span className={cn("text-small font-semibold", met === reg.criteria.length ? "text-success" : "text-warning")}>
          {met}/{reg.criteria.length} criteria
        </span>
        {reg.decision === "pending" && (
          <div className="flex gap-2">
            <ConfirmDialog
              trigger={<Button size="sm" variant="outline"><XCircle /> Return</Button>}
              title={`Return ${name}'s registration?`}
              description="The organization will be asked to update its submission. This decision is recorded in the audit log."
              confirmLabel="Return for changes"
              destructive
              onConfirm={() => {
                const { registration, entry } = rejectRegistration(reg, ASSOCIATION_OFFICIAL, nowStamp(), name);
                onDecide(registration, entry);
                toast("Registration returned", { description: name });
              }}
            />
            <ConfirmDialog
              trigger={<Button size="sm"><CheckCircle2 /> Approve</Button>}
              title={`Approve ${name}?`}
              description={
                <div className="space-y-2">
                  <p>The registration will be valid for one year from today and shown as “Registered” on the organization page.</p>
                  {met < reg.criteria.length && <p className="font-semibold text-warning">{reg.criteria.length - met} licensing criterion not yet met.</p>}
                </div>
              }
              confirmLabel="Approve registration"
              onConfirm={() => {
                const { registration, entry } = approveRegistration(reg, ASSOCIATION_OFFICIAL, nowStamp(), name);
                onDecide(registration, entry);
                toast.success("Registration approved", { description: `${name} · valid until ${fmtDate(registration.validTo!)}` });
              }}
            />
          </div>
        )}
      </div>
    </li>
  );
}

function SanctionRow({ req, onDecide, canDecide }: { req: SanctionRequest; onDecide?: (r: SanctionRequest, e: AuditEntry) => void; canDecide?: boolean }) {
  const name = competitionName(req.competitionId);
  const dates = competitionDates(req.competitionId);
  const badge = SANCTION_BADGE[req.decision];
  return (
    <li className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{name}</span>
          <StatusBadge status={badge.status} label={badge.label} />
        </div>
        <p className="mt-0.5 text-small text-muted-foreground">
          {req.requestedBy} · {req.categories.join(", ")}
          {dates && ` · ${fmtDate(dates.start, "d MMM")} – ${fmtDate(dates.end)}`}
        </p>
        <p className="mt-0.5 text-small text-muted-foreground">
          {req.decidedAt ? `Decided by ${req.decidedBy} · ${fmtStamp(req.decidedAt)}` : `Submitted ${fmtDate(req.submittedAt)}`}
        </p>
      </div>
      {canDecide && onDecide && req.decision === "pending" && (
        <div className="flex gap-2">
          <ConfirmDialog
            trigger={<Button size="sm" variant="outline"><XCircle /> Decline</Button>}
            title={`Decline sanctioning for ${name}?`}
            description="The organizer will be notified. This decision is recorded in the audit log."
            confirmLabel="Decline"
            destructive
            onConfirm={() => { const { request, entry } = decideSanction(req, "rejected", ASSOCIATION_OFFICIAL, nowStamp(), name); onDecide(request, entry); toast("Sanctioning declined", { description: name }); }}
          />
          <ConfirmDialog
            trigger={<Button size="sm"><ShieldCheck /> Sanction</Button>}
            title={`Sanction ${name}?`}
            description="The competition will show “Sanctioned”, and players' participation will be marked as verified on their Football Journey."
            confirmLabel="Sanction competition"
            onConfirm={() => { const { request, entry } = decideSanction(req, "approved", ASSOCIATION_OFFICIAL, nowStamp(), name); onDecide(request, entry); toast.success("Competition sanctioned", { description: name }); }}
          />
        </div>
      )}
    </li>
  );
}

function AuditList({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) return <div className="p-5"><EmptyState title="No decisions yet" /></div>;
  return (
    <ol className="divide-y">
      {entries.map((a) => (
        <li key={a.id} className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="font-semibold">{a.action}</span> <span className="text-muted-foreground">· {a.subject}</span>
            <div className="text-small text-muted-foreground">{a.actor}</div>
          </div>
          <time className="shrink-0 text-small tabular-nums text-muted-foreground">{fmtStamp(a.at)}</time>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------ Organization */

function OrganizationView({ registration, onRenew }: { registration: OrgRegistration; onRenew: (r: OrgRegistration) => void }) {
  const state = registrationState(registration, MOCK_TODAY);
  const badge = REGISTRATION_BADGE[state];
  const name = organizationName(registration.organizationId);
  const left = registration.validTo ? daysUntil(registration.validTo, MOCK_TODAY) : undefined;
  const needsRenewal = state === "expiring" || state === "expired";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <Section>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <OrgCrest orgId={registration.organizationId} size="lg" />
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-h2">{name}</h2>
                  <StatusBadge status={badge.status} label={badge.label} />
                </div>
                <p className="text-small text-muted-foreground">Registered with {ASSOCIATION_NAME}</p>
              </div>
              <InfoList
                className="sm:grid-cols-3"
                items={[
                  { label: "Valid from", value: registration.validFrom ? fmtDate(registration.validFrom) : "—" },
                  { label: "Valid until", value: registration.validTo ? fmtDate(registration.validTo) : "—" },
                  { label: "Approved", value: registration.decidedAt && registration.decision === "approved" ? fmtDate(registration.decidedAt.slice(0, 10)) : "—" },
                ]}
              />
            </div>
          </div>
        </Section>

        {needsRenewal && (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/8 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-h3">{state === "expired" ? "Your registration has expired" : `Your registration ends in ${left} days`}</h3>
              <p className="mt-0.5 text-small text-muted-foreground">Renew now so your teams stay eligible for sanctioned competitions like Makassar Youth Cup 2027.</p>
            </div>
            <ConfirmDialog
              trigger={<Button><FileCheck2 /> Submit renewal</Button>}
              title="Submit registration renewal?"
              description={`We'll send your current organization details and licensing checklist to ${ASSOCIATION_NAME}. Only organization-level numbers are shared, not individual player data.`}
              confirmLabel="Submit renewal"
              onConfirm={() => onRenew(submitRenewal(registration, nowStamp()))}
            />
          </div>
        )}
        {state === "pending" && (
          <div role="status" className="rounded-xl border border-info/25 bg-info/5 p-5">
            <h3 className="text-h3">Renewal submitted {fmtDate(registration.submittedAt)}</h3>
            <p className="mt-0.5 text-small text-muted-foreground">The association usually decides within a week. You'll get a notification when it does.</p>
          </div>
        )}

        <Section title="Licensing criteria" description="What the association checks at each registration." action={<span className="rounded-full border px-2 py-0.5 text-xs font-semibold text-muted-foreground">Next release</span>} flush>
          <ul className="divide-y">
            {registration.criteria.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                {c.met ? <CheckCircle2 className="size-4 shrink-0 text-success" /> : <XCircle className="size-4 shrink-0 text-warning" />}
                <span className={cn("text-sm", !c.met && "font-semibold")}>{c.label}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <aside className="space-y-6">
        <Section title="What the association sees">
          <ul className="space-y-2 text-small text-muted-foreground">
            <li>• Organization details and licensing checklist</li>
            <li>• Counts: {registration.registeredPlayers} players, {registration.licensedCoaches} licensed coaches</li>
            <li>• No individual player profiles, unless needed to verify a registration</li>
            <li>• Every decision is recorded with who decided and when</li>
          </ul>
        </Section>
      </aside>
    </div>
  );
}

/* --------------------------------------------------------------- Organizer */

function OrganizerView({ requests }: { requests: SanctionRequest[] }) {
  const local = requests;
  const sanctioned = useMemo(() => local.filter((r) => r.decision === "approved").length, [local]);
  const hasPending = local.some((r) => r.decision === "pending");
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Your competitions" value={local.length} icon={ClipboardList} />
        <StatCard label="Sanctioned" value={sanctioned} icon={ShieldCheck} />
      </div>
      <Section
        title="Sanctioning requests"
        description={`Approved by ${ASSOCIATION_NAME}. Only association officials can approve.`}
        action={hasPending && (
          <ConfirmDialog
            trigger={<Button size="sm" variant="outline">Send reminder</Button>}
            title="Remind the association?"
            description="We'll send a polite reminder about your pending sanctioning requests."
            confirmLabel="Send reminder"
            onConfirm={() => toast.success("Reminder sent", { description: ASSOCIATION_NAME })}
          />
        )}
        flush
      >
        <ul className="divide-y">
          {local.map((r) => <SanctionRow key={r.id} req={r} />)}
        </ul>
      </Section>
      <p className="text-small text-muted-foreground">
        Sanctioned competitions show their status on the competition page, and players' participation is marked verified on their Football Journey.
      </p>
    </div>
  );
}
