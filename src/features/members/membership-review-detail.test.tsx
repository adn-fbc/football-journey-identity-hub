import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { MembershipReviewDetail } from "@/features/members/membership-review-detail";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

function AssociationHarness() {
  const { setRole } = useRole();

  useEffect(() => {
    setRole("association");
  }, [setRole]);

  return <MembershipReviewDetail />;
}

describe("MembershipReviewDetail", () => {
  it("renders the review detail workflow for association users", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getAllByText(/membership renewal review/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Review status & attention")).toBeInTheDocument();
    expect(screen.getByText("Member context")).toBeInTheDocument();
    expect(screen.getByText("Membership context")).toBeInTheDocument();
    expect(screen.getByText("Required verification")).toBeInTheDocument();
    expect(screen.getByText("Decision area")).toBeInTheDocument();
    expect(screen.getByText("RV-000124")).toBeInTheDocument();
  });
});
