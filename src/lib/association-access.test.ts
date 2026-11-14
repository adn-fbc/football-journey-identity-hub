import { describe, expect, it } from "vitest";
import { associationCanAccessPath, canDecideAssociationRequests, getAssociationView } from "@/lib/association-access";

describe("association workspace access", () => {
  it("keeps association officials inside their workspace", () => {
    expect(associationCanAccessPath("/")).toBe(true);
    expect(associationCanAccessPath("/notifications")).toBe(true);
    expect(associationCanAccessPath("/settings")).toBe(true);
    expect(associationCanAccessPath("/association")).toBe(true);
    expect(associationCanAccessPath("/federation")).toBe(true);
    expect(associationCanAccessPath("/players")).toBe(false);
    expect(associationCanAccessPath("/players/p-123")).toBe(false);
    expect(associationCanAccessPath("/organizations")).toBe(false);
    expect(associationCanAccessPath("/matches")).toBe(false);
    expect(associationCanAccessPath("/check-in")).toBe(false);
  });

  it("only association officials can approve registrations and sanctioning", () => {
    expect(canDecideAssociationRequests("association")).toBe(true);
    expect(canDecideAssociationRequests("org_admin")).toBe(false);
    expect(canDecideAssociationRequests("competition_organizer")).toBe(false);
  });

  it("gives each role its own association view", () => {
    expect(getAssociationView("org_admin")).toBe("organization");
    expect(getAssociationView("competition_organizer")).toBe("organizer");
    expect(getAssociationView("parent")).toBe("none");
  });
});
