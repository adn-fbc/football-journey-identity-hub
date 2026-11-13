import { ArrowLeft, BadgeCheck, Copy, FileText, ShieldAlert, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatusBadge } from "@/components/ds/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState, ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { useRole } from "@/lib/role-context";

const mockMember = {
  id: "p-001",
  name: "Muhammad Rizky Pratama",
  footballId: "IDN-FB-2016-000123",
  memberNumber: "APSSI-00000124",
  roles: ["Coach", "Youth Development Coordinator"],
  membershipStatus: "Active",
  verificationStatus: "Verified",
  credentialStatus: "Valid",
  organization: "SSB Garuda Makassar",
  validUntil: "31 Dec 2027",
  since: "01 Jan 2025",
  attention: "Credential expires in 30 days",
};

const relationships = [
  { name: "SSB Garuda Makassar", role: "Current · Coach", status: "Current" },
  { name: "Makassar Youth League", role: "Official · Past", status: "Past" },
  { name: "Gowa Football Academy", role: "Referee · Current", status: "Current" },
];

const credentials = [
  { name: "Coaching License", status: "Active", validUntil: "15 Aug 2027" },
  { name: "First Aid Certification", status: "Verified", validUntil: "12 Jun 2027" },
];

const history = [
  { date: "12 Nov 2026", label: "Membership renewed" },
  { date: "03 Oct 2026", label: "Coach credential updated" },
  { date: "18 Aug 2026", label: "Organization affiliation confirmed" },
  { date: "14 Mar 2026", label: "Identity verification completed" },
];

export function MemberDetail({
  loading = false,
  notFound = false,
  limited = false,
  partialError = false,
}: {
  loading?: boolean;
  notFound?: boolean;
  limited?: boolean;
  partialError?: boolean;
}) {
  const navigate = useNavigate();
  const { role } = useRole();

  if (role !== "association") {
    return (
      <PermissionState
        title="Limited member access"
        description="This member detail is restricted to authorized Association roles."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Unified member detail" description="Authorized member context across identity, membership, roles and credentials." />
        <LoadingState rows={6} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <PageHeader title="Unified member detail" description="Authorized member context across identity, membership, roles and credentials." />
        <EmptyState
          title="Member not available"
          description="This member record is not available in your current authorized scope."
          action={
            <Button variant="outline" onClick={() => navigate({ to: "/members" })}>
              <ArrowLeft className="size-4" /> Back to member directory
            </Button>
          }
        />
      </div>
    );
  }

  if (partialError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Unified member detail" description="Authorized member context across identity, membership, roles and credentials." />
        <ErrorState title="Membership information could not be loaded" description="Identity and membership context remains available, while part of the record is temporarily unavailable." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified member detail"
        description="Authorized member context across identity, membership, roles and credentials."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/members" })}>
            <ArrowLeft className="size-4" /> Back to directory
          </Button>
        }
      />

      <div className="surface rounded-xl p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16" fallback="MR" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-h1">{mockMember.name}</h1>
                <BadgeCheck className="size-5 text-info" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-small text-muted-foreground">
                <span className="font-medium text-foreground">Primary role</span>
                <span className="rounded-md border bg-muted px-2 py-1 text-[11px] font-medium">{mockMember.roles[0]}</span>
                <span className="rounded-md border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">{mockMember.memberNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="active" label={mockMember.membershipStatus} />
            <StatusBadge status="verified" label={mockMember.verificationStatus} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-label text-muted-foreground">Member number</div>
            <div className="mt-1 font-semibold">{mockMember.memberNumber}</div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-label text-muted-foreground">Football ID</div>
            <div className="mt-1 font-semibold">{mockMember.footballId}</div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-label text-muted-foreground">Association relationship</div>
            <div className="mt-1 font-semibold">{mockMember.organization}</div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-label text-muted-foreground">Valid until</div>
            <div className="mt-1 font-semibold">{mockMember.validUntil}</div>
          </div>
        </div>
      </div>

      {limited && (
        <PermissionState
          title="Limited member access"
          description="Only the information authorized for your current role and scope is shown."
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Status summary" description="Membership, verification and attention context.">
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2">
              <dt className="text-muted-foreground">Membership</dt>
              <dd><StatusBadge status="active" label={mockMember.membershipStatus} /></dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2">
              <dt className="text-muted-foreground">Verification</dt>
              <dd><StatusBadge status="verified" label={mockMember.verificationStatus} /></dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2">
              <dt className="text-muted-foreground">Digital KTA</dt>
              <dd><StatusBadge status="active" label="Available" /></dd>
            </div>
          </dl>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/8 p-3">
            <ShieldAlert className="mt-0.5 size-4 text-warning" />
            <div>
              <div className="font-semibold text-foreground">Attention</div>
              <p className="text-small text-muted-foreground">{mockMember.attention}</p>
            </div>
          </div>
        </Section>

        <Section title="Identity" description="Authorized identity context for this Association record.">
          <dl className="grid gap-3 text-sm">
            <div><dt className="text-label text-muted-foreground">Full name</dt><dd className="mt-1 font-semibold">{mockMember.name}</dd></div>
            <div><dt className="text-label text-muted-foreground">Football ID</dt><dd className="mt-1 font-semibold">{mockMember.footballId}</dd></div>
            <div><dt className="text-label text-muted-foreground">Profile context</dt><dd className="mt-1 text-muted-foreground">Authorized member identity only</dd></div>
          </dl>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Membership" description="Association membership scope and validity period.">
          <dl className="grid gap-3 text-sm">
            <div><dt className="text-label text-muted-foreground">Member number</dt><dd className="mt-1 font-semibold">{mockMember.memberNumber}</dd></div>
            <div><dt className="text-label text-muted-foreground">Status</dt><dd className="mt-1"><StatusBadge status="active" label={mockMember.membershipStatus} /></dd></div>
            <div><dt className="text-label text-muted-foreground">Valid until</dt><dd className="mt-1 font-semibold">{mockMember.validUntil}</dd></div>
            <div><dt className="text-label text-muted-foreground">Membership started</dt><dd className="mt-1 font-semibold">{mockMember.since}</dd></div>
          </dl>
        </Section>

        <Section title="Association relationships" description="Current and prior authorized Association context.">
          <ul className="space-y-3">
            {relationships.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-small text-muted-foreground">{item.role}</div>
                </div>
                <StatusBadge status={item.status === "Current" ? "active" : "archived"} label={item.status} />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Roles" description="Role context without exposing full permission configuration.">
          <div className="flex flex-wrap gap-2">
            {mockMember.roles.map((role) => (
              <span key={role} className="rounded-full border bg-background px-3 py-1.5 text-sm font-semibold">{role}</span>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
              <span className="text-sm font-medium">Primary role</span>
              <StatusBadge status="verified" label={mockMember.roles[0]} />
            </div>
            <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
              <span className="text-sm font-medium">Additional role</span>
              <StatusBadge status="active" label={mockMember.roles[1]} />
            </div>
          </div>
        </Section>

        <Section title="Credentials" description="Credential summary and validity context.">
          <ul className="space-y-3">
            {credentials.map((item) => (
              <li key={item.name} className="rounded-md border bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{item.name}</div>
                  <StatusBadge status={item.status === "Active" ? "active" : "verified"} label={item.status} />
                </div>
                <div className="mt-2 text-small text-muted-foreground">Valid until {item.validUntil}</div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Digital KTA" description="Current membership representation and availability status.">
          <div className="rounded-md border bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-label text-muted-foreground">Status</div>
                <div className="mt-1 font-semibold">Available</div>
              </div>
              <StatusBadge status="active" label="Available" />
            </div>
            <div className="mt-3 text-small text-muted-foreground">Last issued 12 Jan 2026</div>
            <Button variant="outline" className="mt-4" onClick={() => navigate({ to: "/members/$memberId/kta", params: { memberId: mockMember.memberNumber } })}>
              <Sparkles className="size-4" /> View Digital KTA
            </Button>
          </div>
        </Section>

        <Section title="Recent authorized history" description="The latest allowed events for this member record.">
          <ul className="space-y-3">
            {history.map((item) => (
              <li key={item.label} className="flex gap-3 rounded-md border bg-muted/20 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary">
                  <FileText className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.label}</div>
                  <div className="text-small text-muted-foreground">{item.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Contextual actions" description="Permission-aware actions only.">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigator.clipboard?.writeText(mockMember.memberNumber)}>
            <Copy className="size-4" /> Copy member number
          </Button>
          <Button variant="outline">
            <ShieldCheck className="size-4" /> View credential details
          </Button>
          <Button variant="outline">
            <Users className="size-4" /> View relationship history
          </Button>
        </div>
      </Section>
    </div>
  );
}
