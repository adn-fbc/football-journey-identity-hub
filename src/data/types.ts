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
  guardianAccessStatus?: "minor_confirmed" | "adult" | undefined;
}

export interface PlayerIdentity {
  id: Player["id"];
  footballId: Player["footballId"];
}

export type PlayerAffiliationKind = "organization" | "team";
export type PlayerAffiliationStatus = "active" | "pending" | "ended";

export interface PlayerAffiliation {
  id: string;
  playerId: string;
  organizationId: string;
  kind: PlayerAffiliationKind;
  teamId?: string | undefined;
  organizationAffiliationId?: string | undefined;
  role: string;
  status: PlayerAffiliationStatus;
  effectiveFrom?: string | undefined;
  effectiveTo?: string | undefined;
  recordedBy?: string | undefined;
  sourceOrganizationId: string;
  endReason?: string | undefined;
  legacyTeamNames?: string[] | undefined;
}

export interface PrimaryPlayerContext {
  playerId: string;
  organizationAffiliationId: string;
  teamAffiliationId?: string | undefined;
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
  provenance?: JourneyProvenance | undefined;
}

export type JourneySourceDomain =
  | "player_identity"
  | "player_affiliation"
  | "team_affiliation"
  | "competition"
  | "match"
  | "achievement"
  | "training_session"
  | "attendance_record"
  | "development_assessment"
  | "coach_observation";

export interface JourneyProvenance {
  sourceDomain: JourneySourceDomain;
  sourceRecordId: string;
  sourceOrganizationId?: string | undefined;
  sourceTeamId?: string | undefined;
  recordedBy?: string | undefined;
  verificationStatus?: "verified" | "pending" | "unverified" | undefined;
}

export interface Membership {
  orgId: string;
  role: string;
  from?: string | undefined;
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
  publicVisibility?: "public" | "private" | undefined;
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
  score?: { home: number; away: number } | undefined;
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

export interface GuardianRelationship {
  guardianId: string;
  playerId: string;
  verificationStatus: "pending" | "verified" | "revoked";
}

export type GuardianDataCategory =
  | "profile"
  | "journey"
  | "affiliations"
  | "matches"
  | "competitions"
  | "achievements"
  | "development_assessments"
  | "coach_observations"
  | "schedule"
  | "attendance"
  | "registrations"
  | "payments"
  | "notifications"
  | "primary_context"
  | "sensitive_records";

export interface GuardianConsentGrant {
  id: string;
  guardianId: string;
  subjectPlayerId: string;
  categories: GuardianDataCategory[];
  purpose: string;
  effectiveFrom: string;
  effectiveTo?: string | undefined;
  status: "active" | "revoked" | "suspended";
  revokedAt?: string | undefined;
  grantedBy: string;
}

export type RegistrationStatus = "pending" | "confirmed" | "cancelled";

export interface ChildRegistration {
  id: string;
  childId: string;
  title: string;
  organization: string;
  submittedAt: string;
  status: RegistrationStatus;
}

export type PaymentStatus = "due" | "paid";

export interface ChildPayment {
  id: string;
  childId: string;
  title: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paidAt?: string | undefined;
}
