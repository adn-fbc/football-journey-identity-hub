import { Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, Check, CircleSlash, FileText, Fingerprint, Gauge, Link2, ShieldCheck, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { InfoList, Section } from "@/components/ds/section";
import { getModule, type AppModule } from "@/config/modules";
import { WAVES, getBlueprint, type ModuleBlueprint } from "@/config/module-blueprints";
import { getRole } from "@/config/roles";
import { cn } from "@/lib/utils";

/** Baseline blueprint for a future module: scope, roles, data ownership, privacy and dependencies. */
export function ModuleBlueprintPage({ module: mod, blueprint }: { module: AppModule; blueprint: ModuleBlueprint }) {
  const wave = WAVES[blueprint.wave];
  const dependencies = blueprint.dependsOn.map((id) => getModule(id)).filter((m): m is AppModule => Boolean(m));
  const dependents = mod.id ? dependentsOf(mod.id) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Roadmap", to: "/modules" }, { label: mod.title }]}
        eyebrow={`Coming soon · ${wave.label} — ${wave.title}`}
        title={mod.title}
        description={blueprint.summary}
        actions={
          <Button onClick={() => toast.success("We'll let you know", { description: `${mod.title} early access` })}>
            <BellRing /> Notify me
          </Button>
        }
      />

      <section className="surface grid gap-6 p-5 md:grid-cols-[auto_1fr_minmax(0,22rem)] md:items-start md:p-6">
        <span className="grid size-14 place-items-center rounded-2xl bg-ink text-signal shadow-elevated">
          <mod.icon className="size-6" />
        </span>
        <div className="min-w-0">
          <div className="text-label text-muted-foreground">The problem today</div>
          <p className="mt-1.5 text-body text-foreground">{blueprint.problem}</p>
        </div>
        <InfoList
          className="md:border-l md:pl-6"
          items={[
            { label: "Rollout", value: wave.label },
            { label: "Status", value: "Planned" },
            { label: "Used by", value: `${blueprint.roleJobs.length} role${blueprint.roleJobs.length === 1 ? "" : "s"}` },
            { label: "Builds on", value: dependencies.length ? dependencies.map((d) => d.title).join(", ") : "Live platform only" },
          ]}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="What it will do" description="Planned scope, split into releases">
            <div className="grid gap-4 md:grid-cols-3">
              <ScopeColumn title="First release" items={blueprint.scope.mvp} emphasis />
              <ScopeColumn title="Next" items={blueprint.scope.next} />
              <ScopeColumn title="Later" items={blueprint.scope.later} />
            </div>
          </Section>

          <Section title="Who it's for" description="The job each role needs this module to do" flush>
            <ul className="divide-y">
              {blueprint.roleJobs.map((rj) => (
                <li key={rj.role} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-4">
                  <span className="w-44 shrink-0 text-sm font-semibold text-foreground">{getRole(rj.role).label}</span>
                  <span className="text-sm text-muted-foreground">{rj.job}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Records it will own" description="This module becomes the single source of truth for these" flush>
            <ul className="divide-y">
              {blueprint.entities.map((e) => (
                <li key={e.name} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-4">
                  <span className="text-id w-52 shrink-0 text-foreground">{e.name}</span>
                  <span className="text-sm text-muted-foreground">{e.description}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Connections" description="What it reads from the platform and what it adds back">
            <div className="grid gap-6 md:grid-cols-2">
              <IconList icon={Link2} title="Reads from" items={blueprint.consumes} />
              <IconList
                icon={Fingerprint}
                title="Adds to the Football Journey"
                items={blueprint.journeyEvents}
                empty="Nothing — this module keeps its data out of the player's journey."
              />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Privacy & consent">
            <IconList icon={ShieldCheck} items={blueprint.privacy} tone="text-success" />
          </Section>

          <Section title="Depends on" description="Modules that need to ship first">
            {dependencies.length ? (
              <ModuleLinks modules={dependencies} />
            ) : (
              <p className="text-sm text-muted-foreground">Can start on the live platform with no other future module.</p>
            )}
            {dependents.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 text-label text-muted-foreground">Unlocks</div>
                <ModuleLinks modules={dependents} />
              </div>
            )}
          </Section>

          <Section title="Already in place">
            <IconList icon={Wrench} items={blueprint.foundations} />
          </Section>

          <Section title="How we'll know it works">
            <IconList icon={Gauge} items={blueprint.metrics} />
          </Section>

          <Section title="Not included">
            <IconList icon={CircleSlash} items={blueprint.outOfScope} tone="text-muted-foreground" />
          </Section>

          {blueprint.docs && blueprint.docs.length > 0 && (
            <Section title="Detailed documents" description="In the project repository">
              <IconList icon={FileText} items={blueprint.docs} mono />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function dependentsOf(id: string) {
  return getModuleIdsDependingOn(id).map((m) => getModule(m)).filter((m): m is AppModule => Boolean(m));
}

function getModuleIdsDependingOn(id: string) {
  return WAVE_ORDER.filter((candidate) => getBlueprint(candidate)?.dependsOn.includes(id));
}

const WAVE_ORDER = ["attendance", "training", "development", "finance", "coach", "referee", "opportunities", "scouting", "analytics", "association", "federation", "ai"];

function ScopeColumn({ title, items, emphasis }: { title: string; items: string[]; emphasis?: boolean | undefined }) {
  return (
    <div className={cn("rounded-xl border p-4", emphasis ? "border-primary/30 bg-primary/5" : "bg-muted/30")}>
      <div className={cn("text-label", emphasis ? "text-primary" : "text-muted-foreground")}>{title}</div>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-foreground">
            <Check className={cn("mt-0.5 size-4 shrink-0", emphasis ? "text-primary" : "text-muted-foreground")} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconList({
  icon: Icon, title, items, empty, tone = "text-primary", mono,
}: {
  icon: typeof Check; title?: string | undefined; items: string[]; empty?: string | undefined; tone?: string | undefined; mono?: boolean | undefined;
}) {
  return (
    <div>
      {title && <div className="mb-2.5 text-label text-muted-foreground">{title}</div>}
      {items.length ? (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-foreground">
              <Icon className={cn("mt-0.5 size-4 shrink-0", tone)} />
              <span className={cn(mono && "text-id break-all")}>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}

function ModuleLinks({ modules }: { modules: AppModule[] }): ReactNode {
  return (
    <ul className="space-y-2">
      {modules.map((m) => (
        <li key={m.id}>
          <Link
            to="/modules/$moduleId"
            params={{ moduleId: m.id }}
            className="group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-muted text-foreground"><m.icon className="size-4" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{m.title}</span>
              <span className="block truncate text-small text-muted-foreground">{m.description}</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
