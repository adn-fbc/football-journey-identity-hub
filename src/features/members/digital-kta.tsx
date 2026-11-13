import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, QrCode, ShieldAlert, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { PermissionState, LoadingState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { useRole } from "@/lib/role-context";

const memberCard = {
  memberName: "Ahmad Rahman",
  memberNumber: "APSSI-00000124",
  primaryRole: "Coach",
  validUntil: "31 December 2026",
  membershipType: "Association Member",
  currentStatus: "Active",
  verifiedBy: "APSSI",
  issuedOn: "12 Jan 2026",
  lastVerified: "Current status",
};

const history = [
  { date: "15 Jan 2026", label: "Digital KTA issued" },
  { date: "12 Nov 2026", label: "Membership status updated" },
  { date: "23 Oct 2026", label: "Verification refreshed" },
];

const qrPattern = [
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
];

export function DigitalKta({ loading = false }: { loading?: boolean }) {
  const navigate = useNavigate();
  const { role } = useRole();

  if (role !== "association") {
    return (
      <PermissionState
        title="Digital KTA access restricted"
        description="You do not currently have permission to view the official digital membership card in this context."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Digital KTA" description="Official digital membership identity and verification status." />
        <LoadingState rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital KTA"
        description="Official digital membership identity and verification status."
        actions={
          <Button variant="outline" onClick={() => navigate({ to: "/members/$memberId", params: { memberId: "APSSI-00000124" } })}>
            <ArrowLeft className="size-4" /> Back to member detail
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="surface rounded-xl p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-small font-semibold uppercase tracking-wide text-muted-foreground">Current card status</div>
                <div className="mt-2 flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-foreground">Active</h2>
                  <StatusBadge status="active" label="Active" />
                </div>
              </div>
              <div className="rounded-full bg-success/10 p-2 text-success">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              This member has an active membership and a valid digital membership card.
            </p>
          </div>

          <div className="surface overflow-hidden rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Sparkles className="size-4" />
              Digital KTA card
            </div>

            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">APSSI</div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">Digital member card</div>
                </div>
                <div className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-200">Official</div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-semibold text-white">
                  AR
                </div>
                <div>
                  <div className="text-xl font-semibold">{memberCard.memberName}</div>
                  <div className="mt-1 text-sm text-slate-300">{memberCard.primaryRole}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Member number</div>
                  <div className="mt-1 text-base font-semibold">{memberCard.memberNumber}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Valid until</div>
                  <div className="mt-1 text-base font-semibold">{memberCard.validUntil}</div>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Role</div>
                  <div className="mt-1 text-sm font-medium text-slate-100">{memberCard.primaryRole}</div>
                </div>
                <div className="grid grid-cols-5 gap-1 rounded-md border border-white/10 bg-white/5 p-2">
                  {qrPattern.flat().map((cell, index) => (
                    <span
                      key={`${cell}-${index}`}
                      className={cell ? "block size-2 rounded-sm bg-white" : "block size-2 rounded-sm bg-transparent"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Section title="Membership validity context" description="Current official status and renewal context.">
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Status</div>
                <div className="mt-1 font-semibold text-foreground">{memberCard.currentStatus}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Valid until</div>
                <div className="mt-1 font-semibold text-foreground">{memberCard.validUntil}</div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="text-small text-muted-foreground">Membership type</div>
                <div className="mt-1 font-semibold text-foreground">{memberCard.membershipType}</div>
              </div>
            </div>
          </Section>

          <Section title="QR verification" description="Official verification pointer for public membership validation.">
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="grid grid-cols-5 gap-1 rounded-md border border-border bg-white p-3 shadow-inner">
                {qrPattern.flat().map((cell, index) => (
                  <span
                    key={`${cell}-mini-${index}`}
                    className={cell ? "block size-2 rounded-sm bg-foreground" : "block size-2 rounded-sm bg-transparent"}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Scan this code to verify the current membership status online.</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  <QrCode className="size-4" /> View QR
                </Button>
                <Button variant="outline" size="sm">
                  <ShieldCheck className="size-4" /> Verification preview
                </Button>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Card availability and restriction" description="This card is only available under current membership and permission rules.">
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/5 p-3">
              <ShieldCheck className="mt-0.5 size-4 text-success" />
              <div>
                <div className="font-semibold text-foreground">Digital KTA is active</div>
                <p className="text-sm text-muted-foreground">This member currently has a valid membership and official digital identity.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
              <ShieldAlert className="mt-0.5 size-4 text-warning" />
              <div>
                <div className="font-semibold text-foreground">Renewal reminder</div>
                <p className="text-sm text-muted-foreground">Membership validity ends on 31 December 2026.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Public verification preview" description="Public trust information is intentionally limited to what is necessary for verification.">
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="text-small text-muted-foreground">Member</div>
              <div className="mt-1 font-semibold text-foreground">{memberCard.memberName}</div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="text-small text-muted-foreground">Member number</div>
              <div className="mt-1 font-semibold text-foreground">{memberCard.memberNumber}</div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="text-small text-muted-foreground">Status</div>
              <div className="mt-1 font-semibold text-foreground">{memberCard.currentStatus}</div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="text-small text-muted-foreground">Verified by</div>
              <div className="mt-1 font-semibold text-foreground">{memberCard.verifiedBy}</div>
            </div>
          </div>
        </Section>
      </div>

      <Section title="Authorized card history" description="Recent official lifecycle and digital-card events.">
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
              <div>
                <div className="font-medium text-foreground">{item.label}</div>
                <div className="text-small text-muted-foreground">{item.date}</div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserRound className="size-4" />
                <span className="text-small">Official record</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm">
            View full membership history
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Section>
    </div>
  );
}
