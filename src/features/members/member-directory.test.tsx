import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { MemberDirectory } from "@/features/members/member-directory";

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <MemberDirectory />;
}

describe("MemberDirectory", () => {
  it("renders the unified member directory scoped to the Association", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("Member directory")).toBeInTheDocument();
    expect(screen.getByText("Current scope")).toBeInTheDocument();
    expect(screen.getByText("APSSI South Sulawesi")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search member name or Member Number")).toBeInTheDocument();
    expect(screen.getByText("Active filters")).toBeInTheDocument();
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });
});
