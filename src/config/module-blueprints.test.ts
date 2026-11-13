import { describe, expect, it } from "vitest";
import { MODULES } from "./modules";
import { MODULE_BLUEPRINTS, getBlueprint } from "./module-blueprints";

const soon = MODULES.filter((m) => m.status !== "live");

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

describe("blueprint delivery criteria", () => {
  it("gives every module at least 4 complete acceptance criteria", () => {
    for (const bp of MODULE_BLUEPRINTS) {
      expect(bp.acceptance.length, bp.id).toBeGreaterThanOrEqual(4);
      for (const a of bp.acceptance) {
        expect(a.given.trim() && a.when.trim() && a.then.trim(), bp.id).toBeTruthy();
      }
    }
  });

  it("gives every module at least 4 module-specific checklist items", () => {
    for (const bp of MODULE_BLUEPRINTS) expect(bp.checklist.length, bp.id).toBeGreaterThanOrEqual(4);
  });
});

describe("preview modules", () => {
  const preview = MODULES.filter((m) => m.status === "preview");

  it("open a real prototype route instead of the blueprint page", () => {
    for (const m of preview) expect(m.path.startsWith("/modules/"), m.id).toBe(false);
  });

  it("keep their blueprint while in preview", () => {
    for (const m of preview) expect(getBlueprint(m.id), m.id).toBeDefined();
  });
});
