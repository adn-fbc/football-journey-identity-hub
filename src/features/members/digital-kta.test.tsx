import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { RoleProvider, useRole } from "@/lib/role-context";
import { DigitalKta } from "@/features/members/digital-kta";

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

  return <DigitalKta />;
}

describe("DigitalKta", () => {
  it("renders the official member card and verification context for association users", () => {
    render(
      <RoleProvider>
        <AssociationHarness />
      </RoleProvider>,
    );

    expect(screen.getByText("Digital KTA")).toBeInTheDocument();
    expect(screen.getByText("Official digital membership identity and verification status.")).toBeInTheDocument();
    expect(screen.getByText("Current card status")).toBeInTheDocument();
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getByText("QR verification")).toBeInTheDocument();
    expect(screen.getAllByText("APSSI-00000124").length).toBeGreaterThan(0);
    expect(screen.getByText("Public verification preview")).toBeInTheDocument();
  });
});
