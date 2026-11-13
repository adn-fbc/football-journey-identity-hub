import { listCompetitions, listMatches } from "@/data/repository";

const AUTHORIZED_CITIES = new Set(["Makassar", "Sungguminasa", "Maros"]);

export function getAssociationOverviewSnapshot() {
  const competitions = listCompetitions()
    .filter(
      (competition) =>
        AUTHORIZED_CITIES.has(competition.city) &&
        (competition.status === "active" || competition.status === "pending"),
    )
    .slice(0, 5)
    .map((competition) => {
      const nextMatch = listMatches({ competitionId: competition.id }).find(
        (match) => match.status === "live" || match.status === "scheduled",
      );

      return {
        id: competition.id,
        name: competition.name,
        status: competition.status,
        categories: competition.categories.map((category) => category.label),
        teamCount: new Set(competition.categories.flatMap((category) => category.teamIds)).size,
        nextMatch: nextMatch ? { date: nextMatch.date, time: nextMatch.time } : undefined,
      };
    });

  return {
    metrics: [
      { id: "members", label: "Active members", value: "12,480", trend: "+8.4% this period" },
      { id: "organizations", label: "Active organizations", value: "84", trend: "+3 this period" },
      { id: "coaches", label: "Active coaches", value: "684", trend: "+5.2% this period" },
      { id: "referees", label: "Active referees", value: "231", trend: "+2.1% this period" },
    ],
    attentionItems: [
      {
        id: "members",
        priority: "Action required",
        title: "12 memberships pending verification",
        detail: "Membership records are waiting for an authorized review.",
        action: "Review",
      },
      {
        id: "coaches",
        priority: "Needs attention",
        title: "8 coach credentials expiring soon",
        detail: "Credential validity needs follow-up within this period.",
        action: "View",
      },
      {
        id: "organizations",
        priority: "Needs attention",
        title: "3 organization applications require review",
        detail: "New organization submissions are awaiting a decision.",
        action: "Review",
      },
      {
        id: "competitions",
        priority: "Information",
        title: "2 competitions have unresolved issues",
        detail: "Competition operations have flagged items for oversight.",
        action: "View",
      },
    ],
    activityItems: [
      {
        id: "a1",
        time: "Today",
        text: "Organization verification completed",
        context: "Makassar Youth Academy",
      },
      {
        id: "a2",
        time: "Today",
        text: "Competition schedule updated",
        context: "South Sulawesi Youth League",
      },
      {
        id: "a3",
        time: "Yesterday",
        text: "Coach membership renewal recorded",
        context: "Professional membership",
      },
      {
        id: "a4",
        time: "Yesterday",
        text: "Referee credential verified",
        context: "Regional officiating",
      },
    ],
    competitions,
  };
}
