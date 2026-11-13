import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { OrganizationDetail } from "@/features/organizations/organization-detail";
import { getOrganization } from "@/data/repository";

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <OrganizationDetail organization={getOrganization("garuda")!} />;
}

describe("OrganizationDetail", () => {
  it("renders organization identity, status summary and governance context", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("SSB Garuda Makassar")).toBeInTheDocument();
    expect(screen.getAllByText("Registration Number").length).toBeGreaterThan(0);
    expect(screen.getByText("Status Summary")).toBeInTheDocument();
    expect(screen.getAllByText("Overview").length).toBeGreaterThan(0);
    expect(screen.getByText("Registration & Affiliation")).toBeInTheDocument();
    expect(screen.getByText("Competition Participation")).toBeInTheDocument();
  });
});
