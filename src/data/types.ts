/** Domain types. Mirror these when a real backend is introduced. */
export type Status =
  | "active" | "pending" | "verified" | "draft" | "completed" | "cancelled" | "archived"
  | "scheduled" | "live";

export type Position = "GK" | "DF" | "MF" | "FW";
export type Foot = "Right" | "Left" | "Both";

export interface Organization {
  id: string;
  name: string;
  short: string;
  type: "SSB" | "Academy" | "Club";
  city: string;
  province: string;
  founded: number;
  verification: Status;
  color: string; // crest hue (oklch hue number as string) — rendered via TeamCrest
  players: number;
  teams: number;
  coaches: number;
  homeVenue: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  orgId: string;
  ageCategory: string;
  season: string;
  coach: string;
  assistant?: string | undefined;
  record: { w: number; d: number; l: number };
  status: Status;
}

export interface Player {
  id: string;
  footballId: string;
  name: string;
  nickname?: string | undefined;
  birthYear: number;
  gender: "M" | "F";
  position: Position;
  positionLabel: string;
  foot: Foot;
  orgId?: string | undefined;
  teamId?: string | undefined;
  jersey?: number | undefined;
  membership: Status; // relationship to current organization
  verification: Status;
  memberSince?: string | undefined;
  photo?: string | undefined;
  stats: { matches: number; goals: number; assists: number; minutes: number };
  attendance: number; // percent, last 30 days
  guardianIds: string[];
}

export interface JourneyEvent {
  id: string;
  date: string;
  year: number;
  type: "identity" | "join" | "leave" | "team" | "competition" | "achievement" | "verification";
  title: string;
  detail: string;
  orgId?: string | undefined;
  verifiedBy?: string | undefined;
}

export interface Membership {
  orgId: string;
  role: string;
  from: string;
  to?: string | undefined;
  status: Status;
  teams: string[];
}

export interface Competition {
  id: string;
  name: string;
  short: string;
  organizer: string;
  city: string;
  status: Status;
  start: string;
  end: string;
  categories: CompetitionCategory[];
  venues: string[];
  format: string;
  description: string;
  registrationDeadline?: string | undefined;
}

export interface CompetitionCategory {
  id: string;
  label: string;
  birthYear: string;
  format: string;
  teamIds: string[];
  groups: { name: string; teamIds: string[] }[];
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub" | "half" | "kickoff" | "fulltime";
  side?: "home" | "away" | undefined;
  player?: string | undefined;
  detail?: string | undefined;
}

export interface Match {
  id: string;
  competitionId: string;
  categoryId: string;
  round: string;
  date: string;
  time: string;
  venue: string;
  homeId: string;
  awayId: string;
  score?: { home: number | undefined; away: number };
  status: Status;
  events: MatchEvent[];
  duration: string;
}

export interface ScheduleItem {
  id: string;
  date: string;
  start: string;
  end: string;
  type: "training" | "match" | "event" | "meeting";
  title: string;
  teamId?: string | undefined;
  venue: string;
  matchId?: string | undefined;
}

export interface Notification {
  id: string;
  type: "registration" | "match" | "consent" | "verification" | "schedule" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  roles: string[];
  href?: string | undefined;
}

export interface Achievement {
  id: string;
  title: string;
  competition: string;
  year: number;
  kind: "trophy" | "award" | "milestone";
}

export interface PlayerDocument {
  id: string;
  name: string;
  status: Status;
  updated: string;
  visibleTo: string;
}

export interface Guardian {
  id: string;
  name: string;
  footballId: string;
  relation: string;
  childIds: string[];
}
