import { getCurrentUser, getOrganization, listTeams } from "@/data/repository";
import { getCoachAssignedTeams } from "@/lib/coach-access";

export interface CoachProfileSnapshot {
  name: string;
  footballId: string;
  activeRoles: Array<"player" | "coach" | "parent" | "org_admin" | "competition_organizer" | "referee" | "scout">;
  currentOrganization: string;
  currentTeams: ReturnType<typeof listTeams>;
  license: {
    title: string;
    number: string;
    status: "active" | "pending";
  };
  certificates: Array<{ name: string; issuer: string; year: number }>;
  experience: {
    years: number;
    summary: string;
  };
}

export function getCoachProfileSnapshot(): CoachProfileSnapshot {
  const person = getCurrentUser();
  const teams = getCoachAssignedTeams(person.name);
  const organization = getOrganization("garuda") ?? {
    name: "SSB Garuda Makassar",
  };

  return {
    name: person.name,
    footballId: person.footballId,
    activeRoles: ["coach", "parent"],
    currentOrganization: organization.name,
    currentTeams: teams,
    license: {
      title: "Youth Football Coach License",
      number: "YFC-2027-0184",
      status: "active",
    },
    certificates: [
      { name: "Grassroots Coaching Foundation", issuer: "PSSI Indonesia", year: 2024 },
      { name: "Player Development Methodology", issuer: "Garuda Academy", year: 2025 },
    ],
    experience: {
      years: 5,
      summary: "Developing youth players across training, team routines, and match preparation.",
    },
  };
}
