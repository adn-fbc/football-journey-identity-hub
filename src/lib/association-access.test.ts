import { describe, expect, it } from "vitest";
import { associationCanAccessPath } from "@/lib/association-access";

describe("Association route access", () => {
  it("allows only the Association overview and shared account surfaces", () => {
    expect(associationCanAccessPath("/")).toBe(true);
    expect(associationCanAccessPath("/notifications")).toBe(true);
    expect(associationCanAccessPath("/settings")).toBe(true);
    expect(associationCanAccessPath("/players")).toBe(false);
    expect(associationCanAccessPath("/players/p-123")).toBe(false);
    expect(associationCanAccessPath("/organizations")).toBe(false);
    expect(associationCanAccessPath("/matches")).toBe(false);
    expect(associationCanAccessPath("/check-in")).toBe(false);
  });
});
