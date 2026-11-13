import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JourneyTimeline } from "@/components/ds/journey-timeline";

describe("JourneyTimeline provenance", () => {
  it("labels legacy events without a source reference and does not trust legacy verifier text", () => {
    render(
      <JourneyTimeline
        events={[
          {
            id: "legacy-event",
            date: "2025-03-22",
            year: 2025,
            type: "achievement",
            title: "Historical achievement",
            detail: "Legacy fixture entry",
            verifiedBy: "Unlinked organization label",
          },
        ]}
      />,
    );

    expect(screen.getByText("Historical record · source record unavailable")).toBeTruthy();
    expect(screen.queryByText("Recorded by Unlinked organization label")).toBeNull();
  });

  it("shows source reference and verification only when provenance is explicit", () => {
    render(
      <JourneyTimeline
        events={[
          {
            id: "identity-event",
            date: "2022-03-04",
            year: 2022,
            type: "identity",
            title: "Football ID created",
            detail: "Identity record",
            provenance: {
              sourceDomain: "player_identity",
              sourceRecordId: "p-123",
              verificationStatus: "verified",
            },
          },
        ]}
      />,
    );

    expect(screen.getByText("Source: Player identity · record p-123")).toBeTruthy();
    expect(screen.getByText("Verified source")).toBeTruthy();
  });
});
