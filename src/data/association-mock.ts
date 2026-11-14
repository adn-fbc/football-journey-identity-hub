/** Fictional sample data for the Association preview. Nothing here is an official record. */
export const ASSOCIATION_NAME = "Asprov PSSI Sulawesi Selatan (fictional)";
export const ASSOCIATION_OFFICIAL = "H. Baso Amir · Registration desk";

export interface LicenceCriterion { id: string; label: string; met: boolean }

export interface OrgRegistration {
  id: string;
  organizationId: string;
  kind: "new" | "renewal";
  decision: "approved" | "pending" | "rejected";
  submittedAt: string;
  validFrom?: string | undefined;
  validTo?: string | undefined;
  decidedBy?: string | undefined;
  decidedAt?: string | undefined;
  /** Only the counts the association needs; no individual player data. */
  registeredPlayers: number;
  licensedCoaches: number;
  criteria: LicenceCriterion[];
}

export interface SanctionRequest {
  id: string;
  competitionId: string;
  requestedBy: string;
  categories: string[];
  submittedAt: string;
  decision: "approved" | "pending" | "rejected";
  decidedBy?: string | undefined;
  decidedAt?: string | undefined;
}

export interface AuditEntry { id: string; at: string; actor: string; action: string; subject: string }

const criteria = (met: boolean[]): LicenceCriterion[] =>
  [
    "Legal entity documents on file",
    "At least one licensed coach per active team",
    "Safeguarding officer named",
    "Home venue meets youth safety checklist",
    "Guardian consent process in place",
  ].map((label, i) => ({ id: `c${i + 1}`, label, met: met[i] ?? false }));

export const REGISTRATIONS: OrgRegistration[] = [
  { id: "reg-garuda", organizationId: "garuda", kind: "renewal", decision: "approved", submittedAt: "2026-03-02", validFrom: "2026-04-01", validTo: "2027-03-31", decidedBy: ASSOCIATION_OFFICIAL, decidedAt: "2026-03-18T10:20:00", registeredPlayers: 148, licensedCoaches: 11, criteria: criteria([true, true, true, true, true]) },
  { id: "reg-phinisi", organizationId: "phinisi", kind: "renewal", decision: "approved", submittedAt: "2026-11-20", validFrom: "2027-01-01", validTo: "2027-12-31", decidedBy: ASSOCIATION_OFFICIAL, decidedAt: "2026-12-02T09:05:00", registeredPlayers: 112, licensedCoaches: 8, criteria: criteria([true, true, true, true, true]) },
  { id: "reg-losari", organizationId: "losari", kind: "renewal", decision: "approved", submittedAt: "2026-09-01", validFrom: "2026-10-01", validTo: "2027-09-30", decidedBy: ASSOCIATION_OFFICIAL, decidedAt: "2026-09-10T14:40:00", registeredPlayers: 96, licensedCoaches: 6, criteria: criteria([true, true, true, false, true]) },
  { id: "reg-gowa", organizationId: "gowa", kind: "new", decision: "pending", submittedAt: "2027-02-08", registeredPlayers: 74, licensedCoaches: 5, criteria: criteria([true, true, false, true, true]) },
  { id: "reg-alpha", organizationId: "alpha", kind: "renewal", decision: "approved", submittedAt: "2026-01-10", validFrom: "2026-02-01", validTo: "2027-01-31", decidedBy: ASSOCIATION_OFFICIAL, decidedAt: "2026-01-22T11:00:00", registeredPlayers: 58, licensedCoaches: 4, criteria: criteria([true, true, true, true, false]) },
  { id: "reg-toraja", organizationId: "toraja", kind: "renewal", decision: "pending", submittedAt: "2027-02-11", registeredPlayers: 63, licensedCoaches: 4, criteria: criteria([true, true, true, true, true]) },
];

export const SANCTION_REQUESTS: SanctionRequest[] = [
  { id: "san-myc", competitionId: "myc-2027", requestedBy: "Askot PSSI Makassar (fictional)", categories: ["U8", "U10", "U12"], submittedAt: "2026-12-05", decision: "approved", decidedBy: ASSOCIATION_OFFICIAL, decidedAt: "2026-12-12T15:30:00" },
  { id: "san-fud", competitionId: "festival-2026", requestedBy: "Dispora Makassar (fictional)", categories: ["U8"], submittedAt: "2026-08-20", decision: "approved", decidedBy: ASSOCIATION_OFFICIAL, decidedAt: "2026-08-24T09:00:00" },
  { id: "san-las", competitionId: "liga-anak-2027", requestedBy: "Liga Anak Sulsel (fictional)", categories: ["U10", "U12"], submittedAt: "2027-02-09", decision: "pending" },
  { id: "san-gjc", competitionId: "gowa-cup-2027", requestedBy: "Gowa Football Academy", categories: ["U10"], submittedAt: "2027-02-12", decision: "pending" },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: "a3", at: "2026-12-12T15:30:00", actor: ASSOCIATION_OFFICIAL, action: "Sanctioned competition", subject: "Makassar Youth Cup 2027" },
  { id: "a2", at: "2026-12-02T09:05:00", actor: ASSOCIATION_OFFICIAL, action: "Approved registration renewal", subject: "Akademi Phinisi Muda" },
  { id: "a1", at: "2026-09-10T14:40:00", actor: ASSOCIATION_OFFICIAL, action: "Approved registration renewal", subject: "SSB Losari Putra" },
];

/** Competitions the organizer role can still request sanctioning for (prototype). */
export const ORGANIZER_COMPETITION_IDS = ["myc-2027", "liga-anak-2027"];
