import { describe, expect, it } from "vitest";
import { getCheckInSnapshot, recordSelfCheckIn } from "@/features/check-in/check-in-model";

describe("check-in view model", () => {
  it("limits player activities to the player's team and enables personal check-in", () => {
    const snapshot = getCheckInSnapshot("player");

    expect(snapshot.canSelfCheckIn).toBe(true);
    expect(snapshot.activities.length).toBeGreaterThan(0);
    expect(snapshot.activities.every((activity) => activity.teamIds.includes("garuda-u10"))).toBe(
      true,
    );
  });

  it("limits Coach activities to assigned teams", () => {
    const snapshot = getCheckInSnapshot("coach");

    expect(snapshot.canSelfCheckIn).toBe(true);
    expect(snapshot.activities.length).toBeGreaterThan(0);
    expect(snapshot.activities.every((activity) => activity.teamIds.includes("garuda-u8"))).toBe(
      true,
    );
  });

  it("denies Parent check-in history without an attendance grant", () => {
    const snapshot = getCheckInSnapshot("parent");

    expect(snapshot.canSelfCheckIn).toBe(false);
    expect(snapshot.access).toBe("restricted");
    expect(snapshot.personId).toBe("");
    expect(snapshot.activities).toEqual([]);
    expect(snapshot.history).toEqual([]);
  });

  it("denies expired linked-child consent before loading check-in history", () => {
    const snapshot = getCheckInSnapshot("parent", "p-125");

    expect(snapshot.access).toBe("restricted");
    expect(snapshot.personId).toBe("");
    expect(snapshot.canSelfCheckIn).toBe(false);
    expect(snapshot.activities).toEqual([]);
    expect(snapshot.history).toEqual([]);
  });

  it("restricts roles without an activity relationship", () => {
    expect(getCheckInSnapshot("scout").access).toBe("restricted");
    expect(getCheckInSnapshot("referee").activities).toEqual([]);
  });

  it("creates one shared attendance record and rejects duplicate check-ins", () => {
    const snapshot = getCheckInSnapshot("player");
    const activity = snapshot.activities.find((item) => item.availability === "available");
    if (!activity) throw new Error("Expected an activity open for check-in");

    const record = recordSelfCheckIn(snapshot, activity, [], "2027-02-14T08:00:00");
    expect(record?.activityId).toBe(activity.id);
    expect(record?.personId).toBe(snapshot.personId);
    expect(record?.status).toBe("checked_in");
    expect(record && recordSelfCheckIn(snapshot, activity, [record])).toBeUndefined();
  });
});
