import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { MembershipReviewQueue } from "@/features/members/membership-review-queue";

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <MembershipReviewQueue />;
}

describe("MembershipReviewQueue", () => {
  it("renders the review queue for association users", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("Membership review")).toBeInTheDocument();
    expect(screen.getByText("Current review scope")).toBeInTheDocument();
    expect(screen.getByText("Open reviews")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search member name, Member Number or Review ID")).toBeInTheDocument();
    expect(screen.getAllByText("Open").length).toBeGreaterThan(0);
    expect(screen.getAllByText("RV-000124").length).toBeGreaterThan(0);
  });
});
