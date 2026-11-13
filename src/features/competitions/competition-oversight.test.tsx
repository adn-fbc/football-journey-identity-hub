import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { CompetitionOversight } from "@/features/competitions/competition-oversight";

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <CompetitionOversight />;
}

describe("CompetitionOversight", () => {
  it("renders competition oversight data and governance overview", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("Competition Oversight")).toBeInTheDocument();
    expect(screen.getByText("South Sulawesi Association")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search competition or organizer")).toBeInTheDocument();
    expect(screen.getAllByText("Requires attention").length).toBeGreaterThan(0);
    expect(screen.getByText("Governance signals")).toBeInTheDocument();
  });
});
