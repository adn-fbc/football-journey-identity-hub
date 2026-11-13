import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { CompetitionOversightDetail } from "@/features/competitions/competition-oversight-detail";
import { getCompetition } from "@/data/repository";

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <CompetitionOversightDetail competition={getCompetition("myc-2027")!} />;
}

describe("CompetitionOversightDetail", () => {
  it("renders identity, lifecycle, governance context, and attention summary", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("Makassar Youth Cup 2027")).toBeInTheDocument();
    expect(screen.getByText("Competition Reference")).toBeInTheDocument();
    expect(screen.getByText("Lifecycle & Oversight Status")).toBeInTheDocument();
    expect(screen.getByText("Attention & Governance Signals")).toBeInTheDocument();
    expect(screen.getByText("Governance History")).toBeInTheDocument();
  });
});
