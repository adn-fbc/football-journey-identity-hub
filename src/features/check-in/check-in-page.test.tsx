import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckInPage } from "@/features/check-in/check-in-page";

describe("CheckInPage", () => {
  it("confirms a Player check-in with the shared activity details", () => {
    render(
      <CheckInPage
        role="player"
        view="home"
        onShowHistory={vi.fn()}
        onShowHome={vi.fn()}
        onSelectChild={vi.fn()}
        onReturnToSchedule={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /check in/i }));

    expect(screen.getByText("Check-in successful")).toBeInTheDocument();
    expect(screen.getByText("Muhammad Rizky Pratama")).toBeInTheDocument();
    expect(screen.getByText("Ball mastery · close control")).toBeInTheDocument();
    expect(screen.getByText("Lapangan Hasanuddin")).toBeInTheDocument();
  });

  it("denies Parent check-in without an attendance grant", () => {
    render(
      <CheckInPage
        role="parent"
        view="home"
        onShowHistory={vi.fn()}
        onShowHome={vi.fn()}
        onSelectChild={vi.fn()}
        onReturnToSchedule={vi.fn()}
      />,
    );

    expect(screen.getByText("Check-in unavailable")).toBeInTheDocument();
    expect(screen.getByText(/current attendance grant is required/)).toBeInTheDocument();
    expect(screen.queryByText("Ball mastery · close control")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /check in/i })).not.toBeInTheDocument();
  });
});
