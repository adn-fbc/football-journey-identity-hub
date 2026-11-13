import { describe, expect, it } from "vitest";
import { MODULES } from "./modules";
import { MODULE_BLUEPRINTS, getBlueprint } from "./module-blueprints";

const soon = MODULES.filter((m) => m.status === "soon");

describe("future module blueprints", () => {
  it("has a blueprint for every coming-soon module", () => {
    for (const mod of soon) expect(getBlueprint(mod.id), mod.id).toBeDefined();
  });

  it("only describes modules that are still coming soon", () => {
    const soonIds = new Set(soon.map((m) => m.id));
    for (const bp of MODULE_BLUEPRINTS) expect(soonIds.has(bp.id), bp.id).toBe(true);
  });

  it("depends only on modules from the same or an earlier wave", () => {
    for (const bp of MODULE_BLUEPRINTS) {
      for (const dep of bp.dependsOn) {
        const target = getBlueprint(dep);
        expect(target, `${bp.id} -> ${dep}`).toBeDefined();
        expect(target!.wave).toBeLessThanOrEqual(bp.wave);
      }
    }
  });
});
