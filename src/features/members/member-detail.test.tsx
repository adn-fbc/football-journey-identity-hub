import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { MemberDetail } from "@/features/members/member-detail";

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <MemberDetail />;
}

describe("MemberDetail", () => {
  it("renders the unified member detail context for association users", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("Unified member detail")).toBeInTheDocument();
    expect(screen.getByText("Identity")).toBeInTheDocument();
    expect(screen.getAllByText("Membership").length).toBeGreaterThan(0);
    expect(screen.getByText("Association relationships")).toBeInTheDocument();
    expect(screen.getByText("Credentials")).toBeInTheDocument();
    expect(screen.getAllByText("Digital KTA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Recent authorized history").length).toBeGreaterThan(0);
  });
});
