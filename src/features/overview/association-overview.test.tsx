import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AssociationOverview } from "@/features/overview/association-overview";
import { modulesForRole } from "@/config/modules";
import { getAssociationOverviewSnapshot } from "@/features/overview/association-overview-model";
import { IdentityRolePicker } from "@/features/identity/identity-roles";

describe("AssociationOverview", () => {
  it("shows regional aggregate context, governance attention, competitions, and quick access", () => {
    render(<AssociationOverview />);

    expect(screen.getByText("South Sulawesi Football Association")).toBeInTheDocument();
    expect(screen.getByText("Provincial Association · South Sulawesi")).toBeInTheDocument();
    expect(screen.getByText("Active members")).toBeInTheDocument();
    expect(screen.getByText("Attention required")).toBeInTheDocument();
    expect(screen.getByText("Makassar Youth Cup 2027")).toBeInTheDocument();
    expect(screen.getByText("Quick access")).toBeInTheDocument();
    expect(screen.queryByText("Muhammad Rizky Pratama")).not.toBeInTheDocument();
  });

  it("provides explicit empty, loading, no-attention, and partial-error states", () => {
    const { rerender } = render(<AssociationOverview loading />);
    expect(screen.getByLabelText("Loading association overview")).toBeInTheDocument();

    rerender(<AssociationOverview empty />);
    expect(screen.getByText("Welcome to your Association workspace")).toBeInTheDocument();

    rerender(<AssociationOverview noAttention partialError />);
    expect(screen.getByText("All caught up")).toBeInTheDocument();
    expect(screen.getByText("Some information could not be loaded")).toBeInTheDocument();

    rerender(<AssociationOverview restricted />);
    expect(screen.getByText("Access limited")).toBeInTheDocument();
  });

  it("does not inherit broad operational access from Organization Admin", () => {
    const moduleIds = modulesForRole("association").map((module) => module.id);

    expect(moduleIds).toContain("overview");
    expect(moduleIds).not.toContain("players");
    expect(moduleIds).not.toContain("organizations");
    expect(moduleIds).not.toContain("matches");
  });

  it("composes competition summaries from shared records without exposing personal data", () => {
    const snapshot = getAssociationOverviewSnapshot();
    const competition = snapshot.competitions.find(
      (item) => item.name === "Makassar Youth Cup 2027",
    );

    expect(competition?.teamCount).toBeGreaterThan(0);
    expect(competition?.nextMatch).toMatchObject({
      date: expect.any(String),
      time: expect.any(String),
    });
    expect(snapshot.attentionItems.every((item) => !item.detail.includes("Football ID"))).toBe(
      true,
    );
  });

  it("does not offer Association as a self-selected identity role", () => {
    render(<IdentityRolePicker value={[]} onChange={() => {}} />);

    expect(screen.queryByText("Association")).not.toBeInTheDocument();
  });
});
