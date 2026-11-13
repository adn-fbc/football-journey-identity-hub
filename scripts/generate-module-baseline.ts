/**
 * Generates future-modules-baseline.md from src/config/module-blueprints.ts.
 * Run: bun scripts/generate-module-baseline.ts
 * The markdown is an output — edit the blueprint config, then re-run this script.
 */
import { writeFileSync } from "node:fs";
import { MODULE_BLUEPRINTS, WAVES, blueprintsByWave, type RolloutWave } from "../src/config/module-blueprints";
import { getModule } from "../src/config/modules";
import { getRole } from "../src/config/roles";

const title = (id: string) => getModule(id)?.title ?? id;
const anchor = (id: string) => `#${title(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
const list = (items: string[], empty = "_None_") => (items.length ? items.map((i) => `- ${i}`).join("\n") : empty);
const waves = [1, 2, 3] as RolloutWave[];

const out: string[] = [];
out.push(`# Future Modules Baseline

> Project baseline for every "Coming soon" module of the Youth Football Ecosystem Platform.
> Generated from \`src/config/module-blueprints.ts\` — edit that file, then run \`bun scripts/generate-module-baseline.ts\`.
> The same content is shown in the app at \`/modules\` and \`/modules/<id>\`.

## Guiding principles

1. **The player owns the journey.** Every module attaches records to a Football ID; organizations only hold relationships.
2. **One person, one account, many roles.** Modules declare which roles can use them in \`src/config/modules.ts\`.
3. **Single source of truth per record.** Each module owns the entities listed below and only *reads* the data it consumes.
4. **Journey events, not copies.** Modules publish events to the Football Journey timeline instead of duplicating history.
5. **Consent first for minors.** Guardians control visibility; nothing about a child is exposed beyond existing permissions.

## Rollout overview

| Wave | Theme | Goal | Modules |
| --- | --- | --- | --- |
${waves.map((w) => `| ${WAVES[w].label} | ${WAVES[w].title} | ${WAVES[w].goal} | ${blueprintsByWave(w).map((b) => `[${title(b.id)}](${anchor(b.id)})`).join(", ")} |`).join("\n")}

## Dependency map

| Module | Wave | Depends on | Primary roles |
| --- | --- | --- | --- |
${MODULE_BLUEPRINTS.map((b) => `| ${title(b.id)} | ${b.wave} | ${b.dependsOn.length ? b.dependsOn.map(title).join(", ") : "—"} | ${[...new Set(b.roleJobs.map((r) => getRole(r.role).label))].join(", ")} |`).join("\n")}

## How to ship a module

1. Build the route(s) under \`src/routes/\` and the feature UI under \`src/features/<module>/\`, reusing \`src/components/ds\`.
2. In \`src/config/modules.ts\` set \`status: "live"\` and point \`path\` at the new route — sidebar, mobile bar and search update automatically.
3. Publish the module's journey events to the Football Journey timeline.
4. Keep the blueprint in sync (or remove it once the module is live) and re-generate this document.
`);

for (const w of waves) {
  out.push(`\n---\n\n# ${WAVES[w].label} — ${WAVES[w].title}\n\n${WAVES[w].goal}\n`);
  for (const b of blueprintsByWave(w)) {
    const m = getModule(b.id);
    out.push(`## ${title(b.id)}

**${m?.description ?? ""}** · Route: \`${m?.path ?? "-"}\` · Wave ${b.wave}

${b.summary}

**Problem.** ${b.problem}

### Who it serves
${b.roleJobs.map((r) => `- **${getRole(r.role).label}** — ${r.job}`).join("\n")}

### Scope
**MVP**
${list(b.scope.mvp)}

**Next**
${list(b.scope.next)}

**Later**
${list(b.scope.later)}

### Data it owns
| Entity | Description |
| --- | --- |
${b.entities.map((e) => `| ${e.name} | ${e.description} |`).join("\n")}

### Data it reads (never owns)
${list(b.consumes)}

### Football Journey events
${list(b.journeyEvents, "_Publishes no journey events._")}

### Privacy & consent
${list(b.privacy)}

### Dependencies
${b.dependsOn.length ? list(b.dependsOn.map((d) => `[${title(d)}](${anchor(d)})`)) : "_None — can start independently._"}

### Builds on (already in the app)
${list(b.foundations)}

### Success metrics
${list(b.metrics)}

### Out of scope
${list(b.outOfScope)}
${b.docs?.length ? `\n### Further documents\n${list(b.docs.map((d) => `[${d}](./${d})`))}\n` : ""}`);
  }
}

writeFileSync(new URL("../future-modules-baseline.md", import.meta.url), out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n");
console.log(`Wrote future-modules-baseline.md (${MODULE_BLUEPRINTS.length} modules)`);
