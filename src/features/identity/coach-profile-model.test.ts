import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getCoachProfileSnapshot } from "@/features/identity/coach-profile-model";
import { CoachProfile } from "@/features/identity/coach-profile";

describe("coach profile model", () => {
  it("returns the current identity, active roles, organization, teams, and coaching credentials", () => {
    const snapshot = getCoachProfileSnapshot();

    expect(snapshot.name).toBe("Andi Pratama");
    expect(snapshot.footballId).toBe("IDN-FB-1986-004512");
    expect(snapshot.activeRoles).toContain("coach");
    expect(snapshot.currentOrganization).toBe("SSB Garuda Makassar");
    expect(snapshot.currentTeams.map((team) => team.id)).toEqual(["garuda-u8"]);
    expect(snapshot.license.title).toContain("Youth");
    expect(snapshot.certificates.length).toBeGreaterThan(0);
    expect(snapshot.experience.years).toBeGreaterThan(0);
  });

  it("renders the coach profile for the current identity", () => {
    render(React.createElement(CoachProfile));

    expect(screen.getByText("Coach Profile")).toBeInTheDocument();
    expect(screen.getAllByText("SSB Garuda Makassar").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Youth Football Coach License").length).toBeGreaterThan(0);
  });
});
