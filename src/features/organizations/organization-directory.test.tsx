import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { OrganizationDirectory } from "@/features/organizations/organization-directory";

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <OrganizationDirectory />;
}

describe("OrganizationDirectory", () => {
  it("renders association organization search and filters", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("Organizations")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search by organization name or registration number")).toBeInTheDocument();
    expect(screen.getByText("Active filters")).toBeInTheDocument();
    expect(screen.getByText("Organization overview")).toBeInTheDocument();
  });
});
