import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicCompetitionPortal } from "@/features/competition-public/public-competition-portal";
import { getPublicCompetitionSnapshot } from "@/features/competition-public/public-competition-model";

describe("PublicCompetitionPortal", () => {
  it("shows public competition information without private player event details", () => {
    const snapshot = getPublicCompetitionSnapshot("myc-2027");
    if (!snapshot) throw new Error("Expected a published competition");

    render(<PublicCompetitionPortal snapshot={snapshot} />);

    expect(screen.getByRole("heading", { name: "Makassar Youth Cup 2027" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Competition sections" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Latest results" })).toBeInTheDocument();
    expect(screen.queryByText("Muhammad Rizky Pratama")).not.toBeInTheDocument();
    expect(screen.queryByText(/Assist:/)).not.toBeInTheDocument();
  });
});
