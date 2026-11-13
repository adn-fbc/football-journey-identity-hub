import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { Button } from "@/components/ui/button";
import type { Competition } from "@/data/types";
import { listMatches } from "@/data/repository";
import { useRole } from "@/lib/role-context";
import { fmtDate } from "@/lib/format";

const competitionReferences: Record<string, string> = {
  "myc-2027": "COMP-SS-2027-014",
  "liga-anak-2027": "COMP-SS-2027-021",
  "gowa-cup-2027": "COMP-SS-2027-118",
  "festival-2026": "COMP-SS-2026-008",
  "maros-open-2026": "COMP-SS-2026-093",
};

function lifecycleLabel(status: Competition["status"]) {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Upcoming";
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

function oversightStatus(competition: Competition) {
  if (competition.status === "draft") return "Attention Required";
  if (competition.status === "cancelled") return "Under Review";
  if (competition.name.toLowerCase().includes("gowa")) return "Attention Required";
  return "Normal";
}

export function CompetitionOversightDetail({
  competition,
  loading = false,
  partialError = false,
}: {
  competition: Competition;
  loading?: boolean;
  partialError?: boolean;
}) {
  const { role } = useRole();
  const [copied, setCopied] = useState(false);
  const matches = listMatches({ competitionId: competition.id });
  const reference = competitionReferences[competition.id] ?? `COMP-${competition.city.slice(0, 2).toUpperCase()}-${competition.id.toUpperCase()}`;

  const attentionItems = [
    {
      title: "Eligibility Review",
      status: "Attention Required",
      summary: "Some participant records need a governance check before the next match cycle.",
      updated: "12 Nov 2026",
    },
    {
      title: "Credential Status",
      status: "Under Review",
      summary: "Assigned role credentials were validated and are awaiting final association confirmation.",
      updated: "10 Nov 2026",
    },
  ];

  const governanceHistory = [
    { date: "12 Nov 2026", title: "Eligibility signal created", detail: "Review triggered for participation context." },
    { date: "10 Nov 2026", title: "Competition became active", detail: "Association monitoring activated for the current season." },
    { date: "02 Nov 2026", title: "Association review completed", detail: "Initial governance context confirmed." },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (role !== "association" && role !== "org_admin") {
    return (
      <PermissionState
        title="Limited competition access"
        description="Some competition information is not available for your current role or Association scope."
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
          title="Match context could not be loaded"
          description="Competition governance information is still available. Please try again."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
        <a href="/competitions/oversight" className="hover:text-foreground">Competition Oversight</a>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-foreground">Competition detail</span>
      </nav>

      <section className="surface overflow-hidden">
        <div className="passport-pattern h-20" />
        <div className="-mt-8 flex flex-col gap-4 px-5 pb-5 md:flex-row md:items-end md:px-6">
          <div className="grid size-16 place-items-center rounded-2xl bg-muted text-foreground ring-4 ring-card">
            <Trophy className="size-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1">{competition.name}</h1>
              <StatusBadge status={competition.status === "active" ? "active" : competition.status === "pending" ? "pending" : competition.status === "completed" ? "completed" : "scheduled"} label={lifecycleLabel(competition.status)} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-small text-muted-foreground">
              <span>{competition.format} · {competition.categories[0]?.label ?? "Youth"}</span>
              <span>{competition.city}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="size-4" /> {copied ? "Copied" : "Copy reference"}
            </Button>
            <Button>
              <ShieldCheck className="size-4" /> Review governance context
            </Button>
          </div>
        </div>

        <div className="grid gap-3 border-t px-5 py-4 md:grid-cols-2 xl:grid-cols-4 md:px-6">
          <div>
            <div className="text-label text-muted-foreground">Competition Reference</div>
            <div className="mt-1 font-semibold text-foreground">{reference}</div>
          </div>
          <div>
            <div className="text-label text-muted-foreground">Organized by</div>
            <div className="mt-1 font-semibold text-foreground">{competition.organizer}</div>
          </div>
          <div>
            <div className="text-label text-muted-foreground">Competition Type</div>
            <div className="mt-1 font-semibold text-foreground">{competition.format}</div>
          </div>
          <div>
            <div className="text-label text-muted-foreground">Primary location</div>
            <div className="mt-1 font-semibold text-foreground">{competition.city}</div>
          </div>
        </div>
      </section>

      <nav className="surface flex flex-wrap gap-2 p-2">
        {[
          "Overview",
          "Governance",
          "Participation",
          "Match Context",
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

      <section id="lifecycle-oversight-status" className="surface p-5 md:p-6">
        <h2 className="text-h3">Lifecycle & Oversight Status</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-label text-muted-foreground">Competition Lifecycle</div>
            <div className="mt-2"><StatusBadge status={competition.status === "active" ? "active" : competition.status === "pending" ? "pending" : competition.status === "completed" ? "completed" : "archived"} label={lifecycleLabel(competition.status)} /></div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-label text-muted-foreground">Oversight Condition</div>
            <div className="mt-2"><StatusBadge status={oversightStatus(competition) === "Normal" ? "active" : oversightStatus(competition) === "Under Review" ? "draft" : "pending"} label={oversightStatus(competition)} /></div>
          </div>
        </div>
      </section>

      <section id="attention-governance-signals" className="surface p-5 md:p-6">
        <h2 className="text-h3">Attention & Governance Signals</h2>
        <div className="mt-4 space-y-3">
          {attentionItems.map((item) => (
            <div key={item.title} className="rounded-lg border border-warning/30 bg-warning/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-label text-muted-foreground">{item.title}</div>
                  <div className="mt-1 font-semibold text-foreground">{item.status}</div>
                  <p className="mt-2 text-small text-muted-foreground">{item.summary}</p>
                </div>
                <div className="text-small text-muted-foreground">Last updated<br />{item.updated}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section id="overview" className="surface p-5 md:p-6">
          <h2 className="text-h3">Overview</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><Building2 className="size-4" /> Competition Type</div>
              <div className="mt-2 font-medium text-foreground">{competition.format}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><Trophy className="size-4" /> Category</div>
              <div className="mt-2 font-medium text-foreground">{competition.categories[0]?.label ?? "Youth"}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><CalendarDays className="size-4" /> Competition Period</div>
              <div className="mt-2 font-medium text-foreground">{fmtDate(competition.start, "d MMM yyyy")} – {fmtDate(competition.end, "d MMM yyyy")}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><MapPin className="size-4" /> Primary Location</div>
              <div className="mt-2 font-medium text-foreground">{competition.city}</div>
            </div>
          </div>
          <p className="mt-4 text-body text-muted-foreground">{competition.description}</p>
        </section>

        <section className="surface p-5 md:p-6">
          <h2 className="text-h3">Organizer & Association Context</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><Landmark className="size-4" /> Organizer</div>
              <div className="mt-2 font-semibold text-foreground">{competition.organizer}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-label text-muted-foreground">Association relationship</div>
              <div className="mt-2 font-medium text-foreground">Authorized competition oversight</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-label text-muted-foreground">Oversight scope</div>
              <div className="mt-2 font-medium text-foreground">Provincial</div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="surface p-5 md:p-6">
          <h2 className="text-h3">Participation</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border p-3"><div className="text-label text-muted-foreground">Registered organizations</div><div className="mt-2 text-xl font-semibold">16</div></div>
            <div className="rounded-lg border p-3"><div className="text-label text-muted-foreground">Active teams</div><div className="mt-2 text-xl font-semibold">24</div></div>
            <div className="rounded-lg border p-3"><div className="text-label text-muted-foreground">Authorized participants</div><div className="mt-2 text-xl font-semibold">384</div></div>
          </div>
        </section>

        <section className="surface p-5 md:p-6">
          <h2 className="text-h3">Match summary</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border p-3"><div className="text-label text-muted-foreground">Scheduled</div><div className="mt-2 text-xl font-semibold">{matches.filter((match) => match.status === "scheduled").length}</div></div>
            <div className="rounded-lg border p-3"><div className="text-label text-muted-foreground">Completed</div><div className="mt-2 text-xl font-semibold">{matches.filter((match) => match.status === "completed").length}</div></div>
            <div className="rounded-lg border p-3"><div className="text-label text-muted-foreground">Operational attention</div><div className="mt-2 text-xl font-semibold">1 item</div></div>
          </div>
        </section>

        <section className="surface p-5 md:p-6">
          <h2 className="text-h3">Check-in context</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-small text-muted-foreground"><ClipboardCheck className="size-4" /> Match check-in</div>
              <div className="mt-2"><StatusBadge status="active" label="Normal" /></div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-label text-muted-foreground">Recent exceptions</div>
              <div className="mt-2 text-xl font-semibold">1 item</div>
            </div>
          </div>
        </section>
      </div>

      <section id="history" className="surface p-5 md:p-6">
        <h2 className="text-h3">Governance History</h2>
        <div className="mt-4 space-y-4">
          {governanceHistory.map((item) => (
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
          <Button variant="outline"><Trophy className="size-4" /> View competition</Button>
          <Button variant="outline"><Building2 className="size-4" /> View organizer</Button>
          <Button variant="outline"><AlertTriangle className="size-4" /> Review governance context</Button>
        </div>
      </section>
    </div>
  );
}
