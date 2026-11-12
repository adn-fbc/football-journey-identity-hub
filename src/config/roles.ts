/**
 * Role model. One person = one account = one Football ID, with many roles.
 * Add a role here, then reference it from module `roles` in ./modules.ts.
 */
export type RoleId = "player" | "parent" | "coach" | "org_admin" | "competition_organizer";

export interface RoleDefinition {
  id: RoleId;
  label: string;
  /** Context the role applies to, shown under the role name in the switcher. */
  context: string;
  short: string;
}

export const ROLES: RoleDefinition[] = [
  { id: "org_admin", label: "Organization Admin", short: "Org Admin", context: "SSB Garuda Makassar" },
  { id: "parent", label: "Parent / Guardian", short: "Guardian", context: "2 children" },
  { id: "coach", label: "Coach", short: "Coach", context: "Garuda U8" },
  { id: "competition_organizer", label: "Competition Organizer", short: "Organizer", context: "Makassar Youth Cup 2027" },
  { id: "player", label: "Player", short: "Player", context: "Preview as Rizky" },
];

export const DEFAULT_ROLE: RoleId = "org_admin";

export const getRole = (id: RoleId) => ROLES.find((r) => r.id === id) ?? ROLES[0];
