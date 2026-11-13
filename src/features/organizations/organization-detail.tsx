import { useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Copy,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ds/status-badge";
import { EmptyState, ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { Crest } from "@/components/ds/avatars";
import { listCompetitions, listTeams } from "@/data/repository";
import type { Organization } from "@/data/types";
import { useRole } from "@/lib/role-context";

const registrationMap: Record<string, string> = {
  garuda: "ORG-SS-00124",
  phinisi: "ORG-SS-00131",
  losari: "ORG-SS-00081",
  gowa: "ORG-SS-00098",
  alpha: "ORG-SS-00107",
  toraja: "ORG-SS-00092",
};

function getRegistrationNumber(organization: Organization) {
  return registrationMap[organization.id] ?? `ORG-${organization.province.slice(0, 2).toUpperCase()}-${organization.id.toUpperCase()}`;
}

function getCompetitionStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "draft":
      return "Draft";
    case "cancelled":
      return "Cancelled";
    default:
      return "Scheduled";
  }
}

export function OrganizationDetail({ organization, loading = false, partialError = false }: {
  organization: Organization;
  loading?: boolean;
  partialError?: boolean;
}) {
  const { role } = useRole();
  const [copied, setCopied] = useState(false);

  const registrationNumber = useMemo(() => getRegistrationNumber(organization), [organization]);
  const teams = useMemo(() => listTeams(organization.id), [organization.id]);
  const competitions = useMemo(
    () =>
      listCompetitions()
        .filter(
          (competition) =>
            competition.organizer.toLowerCase() === organization.name.toLowerCase() ||
            competition.categories.some((category) => category.teamIds.some((id) => teams.some((team) => team.id === id))),
        )
        .slice(0, 3),
    [organization.id, organization.name, teams],
  );

  const history = [
    { date: "12 Nov 2026", title: "Affiliation renewed", detail: "South Sulawesi Football Association" },
    { date: "20 Sep 2026", title: "Organization information updated", detail: "Location and contact details reviewed" },
    { date: "15 Aug 2026", title: "Verification completed", detail: "Identity and governance documents verified" },
  ];

  const statusRows = [
    { label: "Organization", badge: <StatusBadge status="active" label="Active" /> },
    { label: "Registration", badge: <StatusBadge status="verified" label="Valid" /> },
    { label: "Verification", badge: <StatusBadge status="verified" label="Verified" /> },
    { label: "Association Affiliation", badge: <StatusBadge status="active" label="Active" /> },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(registrationNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (role !== "association" && role !== "org_admin") {
    return (
      <PermissionState
        title="Limited organization access"
        description="Some organization information is not available for your current role or Association scope."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingState rows={5} />
      </div>
    );
  }

  if (partialError) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Competition information could not be loaded"
          description="The organization summary remains available while other detail sections recover."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
        <Button variant="ghost" size="sm" className="px-0 text-muted-foreground hover:text-foreground">
          ← Back to organizations
        </Button>
      </div>

      <section className="surface overflow-hidden">
        <div className="passport-pattern h-20" />
        <div className="-mt-8 flex flex-col gap-4 px-5 pb-5 md:flex-row md:items-end md:px-6">
          <Crest label={organization.short} hue={organization.color} size="xl" className="ring-4 ring-card" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1">{organization.name}</h1>
              <StatusBadge status={organization.verification === "verified" ? "verified" : "pending"} label="Active" />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-small text-muted-foreground">
              <span>{organization.type} · {organization.city}</span>
              <span>{organization.province}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="size-4" /> {copied ? "Copied" : "Copy registration number"}
            </Button>
            <Button>
              <ShieldCheck className="size-4" /> Review verification
            </Button>
          </div>
        </div>

        <div className="border-t px-5 py-4 md:px-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="text-label text-muted-foreground">Registration Number</div>
              <div className="mt-1 font-semibold text-foreground">{registrationNumber}</div>
            </div>
            <div>
              <div className="text-label text-muted-foreground">Organization Type</div>
              <div className="mt-1 font-semibold text-foreground">{organization.type}</div>
            </div>
            <div>
              <div className="text-label text-muted-foreground">Primary Location</div>
              <div className="mt-1 font-semibold text-foreground">{organization.city}, {organization.province}</div>
            </div>
            <div>
              <div className="text-label text-muted-foreground">Founded</div>
              <div className="mt-1 font-semibold text-foreground">{organization.founded}</div>
            </div>
          </div>
        </div>
      </section>

      <nav className="surface flex flex-wrap gap-2 p-2">
        {[
          "Overview",
          "Registration",
          "People",
          "Competitions",
          "History",
        ].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-full border px-3 py-1.5 text-small font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            {item}
          </a>
        ))}
      </nav>

      <section id="status-summary" className="surface p-5 md:p-6">
        <h2 className="text-h3">Status Summary</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {statusRows.map(({ label, badge }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3">
              <div className="text-label text-muted-foreground">{label}</div>
              <div className="mt-2">{badge}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-warning/30 bg-warning/10 p-3">
          <div className="flex items-center gap-2 text-warning">
            <Sparkles className="size-4" />
            <span className="font-semibold">Attention required</span>
          </div>
          <p className="mt-1 text-small text-muted-foreground">Registration review due in 18 days before the next season cycle.</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section id="overview" className="surface p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-h3">Overview</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><Building2 className="size-4" /> Organization Type</div>
              <div className="mt-2 font-medium text-foreground">{organization.type}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><MapPin className="size-4" /> Primary Location</div>
              <div className="mt-2 font-medium text-foreground">{organization.city}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><CalendarDays className="size-4" /> Registered Since</div>
              <div className="mt-2 font-medium text-foreground">{organization.founded}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><CheckCircle2 className="size-4" /> Current Status</div>
              <div className="mt-2 font-medium text-foreground">Active</div>
            </div>
          </div>
          <p className="mt-4 text-body text-muted-foreground">{organization.description}</p>
        </section>

        <section id="registration" className="surface p-5 md:p-6">
          <h2 className="text-h3">Registration & Affiliation</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border p-3">
              <div className="text-label text-muted-foreground">Registration Number</div>
              <div className="mt-1 font-semibold text-foreground">{registrationNumber}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-label text-muted-foreground"><Landmark className="size-4" /> Registered With</div>
              <div className="mt-1 font-semibold text-foreground">South Sulawesi Football Association</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-label text-muted-foreground">Affiliation Status</div>
              <div className="mt-2"><StatusBadge status="active" label="Active" /></div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-label text-muted-foreground">Valid Until</div>
              <div className="mt-1 font-semibold text-foreground">31 December 2026</div>
            </div>
          </div>
        </section>
      </div>

      <section id="people" className="surface p-5 md:p-6">
        <h2 className="text-h3">People & Affiliations</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-small text-muted-foreground"><UserRound className="size-4" /> Head Coach</div>
            <div className="mt-2 font-semibold text-foreground">{teams[0]?.coach ?? "Coach Hendra Saputra"}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-small text-muted-foreground"><Users className="size-4" /> Organization Administrator</div>
            <div className="mt-2 font-semibold text-foreground">Siti Nur</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-small text-muted-foreground"><Users className="size-4" /> Authorized Member Records</div>
            <div className="mt-2 font-semibold text-foreground">{organization.players} records</div>
          </div>
        </div>
      </section>

      <section id="competitions" className="surface p-5 md:p-6">
        <h2 className="text-h3">Competition Participation</h2>
        <div className="mt-4 space-y-3">
          {competitions.map((competition) => (
            <div key={competition.id} className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-foreground">{competition.name}</div>
                <div className="mt-1 text-small text-muted-foreground">{competition.categories[0]?.label ?? "Youth"} · {competition.status === "completed" ? "Completed" : "Active"}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={competition.status === "completed" ? "completed" : competition.status === "pending" ? "pending" : "active"} label={getCompetitionStatusLabel(competition.status)} />
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          ))}
          {competitions.length === 0 && (
            <EmptyState title="No competition history available" description="Competition participation will appear here once the organization is active in the season calendar." />
          )}
        </div>
      </section>

      <section id="history" className="surface p-5 md:p-6">
        <h2 className="text-h3">History</h2>
        <div className="mt-4 space-y-4">
          {history.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-lg border p-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-small font-semibold text-muted-foreground">
                {item.date.split(" ")[0]}
              </div>
              <div className="flex-1">
                <div className="text-small text-muted-foreground">{item.date}</div>
                <div className="font-semibold text-foreground">{item.title}</div>
                <div className="text-small text-muted-foreground">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <h2 className="text-h3">Contextual Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline"><WalletCards className="size-4" /> View Registration</Button>
          <Button variant="outline"><Landmark className="size-4" /> Review Affiliation</Button>
          <Button variant="outline"><ShieldCheck className="size-4" /> Review Verification</Button>
        </div>
      </section>
    </div>
  );
}
