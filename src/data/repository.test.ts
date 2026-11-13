import { describe, expect, it } from "vitest";
import { listCurrentGuardianChildren, listGuardianChildren } from "@/data/repository";

describe("guardian child repository", () => {
  it("returns only children linked to the requested guardian", () => {
    expect(listGuardianChildren("g-1").map((child) => child.id)).toEqual(["p-123", "p-125"]);
  });

  it("returns no children for an unknown guardian", () => {
    expect(listGuardianChildren("unknown")).toEqual([]);
  });

  it("resolves children for the current guardian without exposing fixture lookup to routes", () => {
    expect(listCurrentGuardianChildren().map((child) => child.id)).toEqual(["p-123", "p-125"]);
  });
});