import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ds/page-header";
import { getModule, type AppModule } from "@/config/modules";
import { WAVES, blueprintsByWave, type RolloutWave } from "@/config/module-blueprints";
import { getRole } from "@/config/roles";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";

/** Roadmap of every future module, grouped by rollout wave. */
export function ModuleRoadmapPage() {
  const { role } = useRole();
  const waves = Object.keys(WAVES).map(Number) as RolloutWave[];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Coming soon"
        title="Product roadmap"
        description="Every upcoming module plugs into the same Football ID, roles and navigation you use today. Open a module to see its planned scope, privacy rules and dependencies."
      />

      {waves.map((wave) => {
        const info = WAVES[wave];
        const items = blueprintsByWave(wave)
          .map((bp) => ({ bp, mod: getModule(bp.id) }))
          .filter((x): x is { bp: typeof x.bp; mod: AppModule } => Boolean(x.mod));
        return (
          <section key={wave} className="space-y-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-label text-primary">{info.label}</div>
                <h2 className="text-h2">{info.title}</h2>
              </div>
              <p className="max-w-xl text-small text-muted-foreground md:text-right">{info.goal}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {items.map(({ bp, mod }) => {
                const forYou = mod.roles.includes(role);
                return (
                  <Link
                    key={mod.id}
                    to="/modules/$moduleId"
                    params={{ moduleId: mod.id }}
                    className="surface group flex flex-col gap-3 p-5 transition-shadow hover:shadow-elevated"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-xl bg-ink text-signal"><mod.icon className="size-5" /></span>
                      <div className="flex gap-1.5">
                        {mod.status === "preview" && <span className="rounded-full bg-ink px-2 py-0.5 text-label text-signal">Prototype</span>}
                        {forYou && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-label text-primary">For your role</span>}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-h3">{mod.title}</h3>
                      <p className="mt-1 line-clamp-3 text-small text-muted-foreground">{bp.summary}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-1.5">
                      {bp.roleJobs.map((rj) => (
                        <span key={rj.role} className={cn("rounded-md border px-1.5 py-0.5 text-small", rj.role === role ? "border-primary/30 text-primary" : "text-muted-foreground")}>
                          {getRole(rj.role).short}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t pt-3 text-small text-muted-foreground">
                      <span>{bp.scope.mvp.length} features in first release</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
