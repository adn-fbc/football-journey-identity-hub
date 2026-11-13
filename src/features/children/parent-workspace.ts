import type { Notification, Player } from "@/data/types";
import {
  getJourney,
  listChildPayments,
  listChildRegistrations,
  listNotifications,
  listTodaySchedule,
} from "@/data/repository";

export function getParentDashboardSnapshot(
  child: Player,
  isRead: (notification: Notification) => boolean,
) {
  const teamIds = child.teamId ? [child.teamId] : [];
  const journey = [...getJourney(child.id)].sort((a, b) => a.date.localeCompare(b.date));
  const pendingRegistrations = listChildRegistrations(child.id).filter(
    (registration) => registration.status === "pending",
  );
  const duePayments = listChildPayments(child.id).filter((payment) => payment.status === "due");
  const consentRequests = listNotifications("parent").filter(
    (notification) =>
      notification.type === "consent" &&
      notification.href?.includes(child.id) &&
      !isRead(notification),
  );

  return {
    todaySchedule: listTodaySchedule(teamIds),
    pendingRegistrations,
    duePayments,
    consentRequests,
    journey,
    attentionCount: pendingRegistrations.length + duePayments.length + consentRequests.length,
  };
}
