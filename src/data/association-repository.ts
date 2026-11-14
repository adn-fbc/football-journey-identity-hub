/** Read access for the Association preview. UI imports only from here. */
import { getCompetition, getOrganization } from "@/data/repository";
import {
  ASSOCIATION_NAME, ASSOCIATION_OFFICIAL, AUDIT_LOG, ORGANIZER_COMPETITION_IDS, REGISTRATIONS, SANCTION_REQUESTS,
} from "./association-mock";

export type { AuditEntry, LicenceCriterion, OrgRegistration, SanctionRequest } from "./association-mock";
export { ASSOCIATION_NAME, ASSOCIATION_OFFICIAL, ORGANIZER_COMPETITION_IDS };

export const listRegistrations = () => REGISTRATIONS.map((r) => ({ ...r, criteria: r.criteria.map((c) => ({ ...c })) }));
export const listSanctionRequests = () => SANCTION_REQUESTS.map((r) => ({ ...r, categories: [...r.categories] }));
export const listAuditLog = () => AUDIT_LOG.map((a) => ({ ...a }));

export const organizationName = (id: string) => getOrganization(id)?.name ?? id;
export const competitionName = (id: string) => getCompetition(id)?.name ?? id;
export const competitionDates = (id: string) => {
  const c = getCompetition(id);
  return c ? { start: c.start, end: c.end } : undefined;
};
