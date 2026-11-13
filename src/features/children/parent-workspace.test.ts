import { describe, expect, it } from "vitest";
import { listCurrentGuardianChildren } from "@/data/repository";
import { getParentDashboardSnapshot } from "@/features/children/parent-workspace";

describe("parent dashboard snapshot", () => {
  const children = listCurrentGuardianChildren();

  it("scopes today's schedule and consent attention to the selected child", () => {
    const rizky = children.find((child) => child.id === "p-123");
    expect(rizky).toBeDefined();
    const dashboard = getParentDashboardSnapshot(rizky!, () => false);

    expect(dashboard.todaySchedule.map((item) => item.id)).toEqual(["s0"]);
    expect(dashboard.consentRequests.map((item) => item.id)).toContain("n3");
    expect(dashboard.attentionCount).toBeGreaterThan(0);
  });

  it("surfaces a different child's pending registration and due payment", () => {
    const aisyah = children.find((child) => child.id === "p-125");
    expect(aisyah).toBeDefined();
    const dashboard = getParentDashboardSnapshot(aisyah!, () => false);

    expect(dashboard.pendingRegistrations.map((registration) => registration.id)).toContain("cr-2");
    expect(dashboard.duePayments.map((payment) => payment.id)).toContain("cp-2");
  });
});
