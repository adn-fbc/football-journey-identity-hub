import { describe, expect, it } from "vitest";
import { listCurrentGuardianChildren } from "@/data/repository";
import { players } from "@/data/mock";
import { getParentDashboardSnapshot } from "@/features/children/parent-workspace";

describe("parent dashboard snapshot", () => {
  const children = listCurrentGuardianChildren();

  it("shows only journey categories with a current grant", () => {
    const rizky = children.find((child) => child.id === "p-123");
    expect(rizky).toBeDefined();
    const dashboard = getParentDashboardSnapshot(rizky!, () => false);

    expect(dashboard.todaySchedule).toEqual([]);
    expect(dashboard.hasScheduleAccess).toBe(false);
    expect(dashboard.consentRequests).toEqual([]);
    expect(dashboard.hasNotificationAccess).toBe(false);
    expect(dashboard.hasRegistrationAccess).toBe(false);
    expect(dashboard.hasPaymentAccess).toBe(false);
    expect(dashboard.journey.length).toBeGreaterThan(0);
    expect(dashboard.attentionCount).toBe(0);
  });

  it("denies the expired guardian grant before reading registration or payment records", () => {
    const aisyah = players.find((child) => child.id === "p-125");
    expect(aisyah).toBeDefined();
    const dashboard = getParentDashboardSnapshot(aisyah!, () => false);

    expect(children.some((child) => child.id === "p-125")).toBe(true);
    expect(dashboard.pendingRegistrations).toEqual([]);
    expect(dashboard.duePayments).toEqual([]);
    expect(dashboard.journey).toEqual([]);
  });
});
