import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Flag,
  LockKeyhole,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ds/states";
import { getCurrentUser } from "@/data/repository";
import { fmtDate } from "@/lib/format";
import { getAssociationOverviewSnapshot } from "./association-overview-model";

export function AssociationOverview({
  loading = false,
  empty = false,
  noAttention = false,
  partialError = false,
  restricted = false,
  onRetry,
}: {
  loading?: boolean;
  empty?: boolean;
  noAttention?: boolean;
  partialError?: boolean;
  restricted?: boolean;
  onRetry?: () => void;
}) {
  const [period, setPeriod] = useState("2026-27");
  const currentUser = getCurrentUser();
  const { metrics, attentionItems, activityItems, competitions } = getAssociationOverviewSnapshot();

  if (loading) {
    return (
      <div
        className="space-y-6"
        aria-label="Loading association overview"
        role="status"
        aria-busy="true"
      >
        <LoadingState rows={2} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="surface h-28 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface h-64 animate-pulse rounded-lg bg-muted" />
          <div className="surface h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="space-y-6">
        <AssociationHeader name={currentUser.name} period={period} onPeriodChange={setPeriod} />
        <EmptyState
          icon={Compass}
          title="Welcome to your Association workspace"
          description="Your ecosystem overview will appear as members, organizations, and activities become active in your authorized region."
          action={
            <a href="#quick-access" className="text-sm font-semibold text-primary">
              Explore available summaries
            </a>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AssociationHeader name={currentUser.name} period={period} onPeriodChange={setPeriod} />

      {restricted && (
        <div
          className="flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/10 px-4 py-3"
          role="status"
        >
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-warning" />
          <div>
            <div className="text-sm font-semibold">Access limited</div>
            <p className="text-small text-muted-foreground">
              Some ecosystem information is not available for your current role or association
              scope.
            </p>
          </div>
        </div>
      )}

      <section
        id="snapshot"
        aria-label="Ecosystem snapshot"
        className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon =
            metric.id === "members"
              ? Users
              : metric.id === "organizations"
                ? Building2
                : metric.id === "coaches"
                  ? ShieldCheck
                  : Flag;
          return (
            <div key={metric.id} id={metric.id} className="scroll-mt-24">
              <StatCard
                label={metric.label}
                value={metric.value}
                hint={metric.trend}
                trend="up"
                icon={Icon}
              />
            </div>
          );
        })}
      </section>

      {partialError && (
        <ErrorState
          title="Some information could not be loaded"
          description="Your Association workspace is still available. Some summary data may be incomplete."
          onRetry={onRetry}
          className="py-5"
        />
      )}

      <section id="attention" aria-label="Attention required" className="scroll-mt-24">
        <Section
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning" />
              Attention required
            </span>
          }
          description="Governance items within your South Sulawesi scope."
          action={
            <a href="#quick-access" className="text-small font-semibold text-primary">
              View all tasks
            </a>
          }
          flush
        >
          {noAttention ? (
            <div className="p-5">
              <EmptyState
                icon={CheckCircle2}
                title="All caught up"
                description="There are currently no items requiring your attention."
              />
            </div>
          ) : (
            <ul className="divide-y">
              {attentionItems.slice(0, 5).map((item) => {
                const Icon =
                  item.id === "members"
                    ? ClipboardCheck
                    : item.id === "coaches"
                      ? ShieldCheck
                      : item.id === "organizations"
                        ? Building2
                        : AlertTriangle;
                return (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-label text-primary">{item.priority}</span>
                        <span className="text-sm font-semibold text-foreground">{item.title}</span>
                      </div>
                      <p className="mt-0.5 text-small text-muted-foreground">{item.detail}</p>
                    </div>
                    <a
                      href={`#${item.id}`}
                      className="shrink-0 text-small font-semibold text-primary"
                    >
                      {item.action} <ChevronRight className="inline size-3.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      </section>

      <section id="competitions" aria-label="Active competitions" className="scroll-mt-24">
        <Section
          title="Active competitions"
          description="Regional oversight summary, not organizer controls."
          action={
            <a href="#quick-access" className="text-small font-semibold text-primary">
              View all competitions
            </a>
          }
          flush
        >
          {competitions.length ? (
            <ul className="divide-y">
              {competitions.map((competition) => (
                <li
                  key={competition.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{competition.name}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted-foreground">
                      <span>{competition.categories.join(" · ")}</span>
                      <span>{competition.teamCount} teams</span>
                      {competition.nextMatch && (
                        <span>
                          Next match · {fmtDate(competition.nextMatch.date, "d MMM")}{" "}
                          {competition.nextMatch.time}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge
                    status={competition.status}
                    label={competition.status === "pending" ? "Registration open" : "Active"}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <EmptyState
                title="No active competitions"
                description="Published competitions in your region will appear here."
              />
            </div>
          )}
        </Section>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Recent ecosystem activity" description="Authorized regional summaries.">
          <ol className="space-y-4">
            {activityItems.map((item, index) => {
              const Icon = index === 1 ? CalendarDays : index === 2 ? ShieldCheck : CheckCircle2;
              return (
                <li key={item.id} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 text-sm">
                    <div className="font-semibold text-foreground">{item.text}</div>
                    <div className="text-small text-muted-foreground">
                      {item.context} · {item.time}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        <section id="quick-access" className="scroll-mt-24">
          <Section title="Quick access" description="Jump to an authorized regional summary.">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Members", href: "#members", icon: Users },
                { label: "Organizations", href: "#organizations", icon: Building2 },
                { label: "Verification", href: "#attention", icon: ClipboardCheck },
                { label: "Competitions", href: "#competitions", icon: CalendarDays },
                { label: "Insights", href: "#snapshot", icon: MapPinned },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex min-h-12 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <item.icon className="size-4 text-primary" />
                  {item.label}
                </a>
              ))}
            </div>
          </Section>
        </section>
      </div>
    </div>
  );
}

function AssociationHeader({
  name,
  period,
  onPeriodChange,
}: {
  name: string;
  period: string;
  onPeriodChange: (period: string) => void;
}) {
  const greetingName = name.split(" ")[0];
  return (
    <PageHeader
      eyebrow="Provincial Association · South Sulawesi"
      title={`Good morning, ${greetingName}`}
      description="South Sulawesi Football Association"
      actions={
        <label className="grid w-44 gap-1">
          <span className="text-label text-muted-foreground">Current period</span>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger aria-label="Current period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-27">2026/27 season</SelectItem>
              <SelectItem value="2026-calendar">2026 calendar year</SelectItem>
            </SelectContent>
          </Select>
        </label>
      }
    />
  );
}
