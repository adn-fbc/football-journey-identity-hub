import type { RoleId } from "@/config/roles";

const ASSOCIATION_ALLOWED_PATHS = new Set(["/", "/members", "/notifications", "/settings", "/association", "/federation"]);

export function associationCanAccessPath(pathname: string) {
  return ASSOCIATION_ALLOWED_PATHS.has(pathname) || pathname.startsWith("/members/");
}

/** What the Association preview shows for each role. Only association officials decide. */
export type AssociationView = "official" | "organization" | "organizer" | "none";

export function getAssociationView(role: RoleId): AssociationView {
  if (role === "association") return "official";
  if (role === "org_admin") return "organization";
  if (role === "competition_organizer") return "organizer";
  return "none";
}

export const canDecideAssociationRequests = (role: RoleId) => getAssociationView(role) === "official";

/** Mock assignment: the org admin manages SSB Garuda Makassar. */
export const MANAGED_ORGANIZATION_ID = "garuda";
