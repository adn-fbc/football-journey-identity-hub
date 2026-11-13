import type { Notification, Player } from "@/data/types";
import {
  getCurrentGuardianId,
  getGuardianAccessDecision,
  getPlayerAccessForActor,
  getWorkspaceActor,
  listChildPayments,
  listChildRegistrations,
  listNotifications,
  listTodaySchedule,
} from "@/data/repository";

export function getParentDashboardSnapshot(
  child: Player,
  isRead: (notification: Notification) => boolean,
) {
  const guardianId = getCurrentGuardianId();
  const coreAccess = getPlayerAccessForActor(child.id, getWorkspaceActor("parent"));
  const canView = (category: Parameters<typeof getGuardianAccessDecision>[2]) =>
    Boolean(guardianId && getGuardianAccessDecision(guardianId, child.id, category).allowed);
  const teamIds = child.teamId ? [child.teamId] : [];
  const journey = coreAccess.ok ? [...coreAccess.access.journey].sort((a, b) => a.date.localeCompare(b.date)) : [];
  const pendingRegistrations = canView("registrations")
    ? listChildRegistrations(child.id).filter((registration) => registration.status === "pending")
    : [];
  const duePayments = canView("payments")
    ? listChildPayments(child.id).filter((payment) => payment.status === "due")
    : [];
  const consentRequests = canView("notifications")
    ? listNotifications("parent").filter((notification) =>
        notification.type === "consent" && notification.href?.includes(child.id) && !isRead(notification),
      )
    : [];
  const todaySchedule = canView("schedule")
    ? listTodaySchedule(teamIds).filter((item) => item.teamId && teamIds.includes(item.teamId))
    : [];

  return {
    todaySchedule,
    hasScheduleAccess: canView("schedule"),
    pendingRegistrations,
    duePayments,
    consentRequests,
    hasRegistrationAccess: canView("registrations"),
    hasPaymentAccess: canView("payments"),
    hasNotificationAccess: canView("notifications"),
    journey,
    attentionCount: pendingRegistrations.length + duePayments.length + consentRequests.length,
  };
}
