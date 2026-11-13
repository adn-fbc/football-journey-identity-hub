import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  getCurrentGuardianId,
  getPrimaryPlayerContext,
  getTeam,
  listCurrentGuardianChildren,
  listPlayerAffiliations,
  listPlayerJourney,
  setPrimaryPlayerContext,
  type PrimaryContextActor,
} from "@/data/repository";
import type { Player } from "@/data/types";
import { coachCanAccessPlayer } from "@/lib/coach-access";

export function usePlayerDevelopmentFoundation(player: Player) {
  const { role } = useRole();
  const [, refresh] = useState(0);
  const allAffiliations = listPlayerAffiliations(player.id);
  const allJourney = listPlayerJourney(player.id);
  const guardianId = role === "parent" ? getCurrentGuardianId() : undefined;
  const guardianLinked =
    role === "parent" && listCurrentGuardianChildren().some((child) => child.id === player.id);
  const coachAssigned = role === "coach" && coachCanAccessPlayer(player.id);
  const currentOrganizationId = player.orgId;
  const currentTeamOrganizationId = player.teamId ? getTeam(player.teamId)?.orgId : undefined;
  const canSeeFullHistory = role === "player" || guardianLinked;
  const affiliations = canSeeFullHistory
    ? allAffiliations
    : role === "coach" && coachAssigned
      ? allAffiliations.filter((affiliation) =>
          affiliation.kind === "team"
            ? affiliation.status === "active" && affiliation.teamId === player.teamId
            : affiliation.status === "active" &&
              affiliation.organizationId === currentTeamOrganizationId,
        )
      : role === "org_admin"
        ? allAffiliations.filter(
            (affiliation) =>
              affiliation.organizationId === currentOrganizationId &&
              affiliation.status !== "ended",
          )
        : [];
  const journey = canSeeFullHistory
    ? allJourney
    : role === "coach" && coachAssigned
      ? allJourney.filter((event) => {
          const eventOrganizationId = event.provenance?.sourceOrganizationId ?? event.orgId;
          return (
            eventOrganizationId === currentTeamOrganizationId ||
            (!eventOrganizationId && event.type === "identity")
          );
        })
      : role === "org_admin"
        ? allJourney.filter((event) => {
            const eventOrganizationId = event.provenance?.sourceOrganizationId ?? event.orgId;
            return (
              eventOrganizationId === currentOrganizationId ||
              (!eventOrganizationId && event.type === "identity")
            );
          })
        : [];
  const selectedContext = getPrimaryPlayerContext(player.id);
  const primaryContext = affiliations.some(
    (affiliation) => affiliation.id === selectedContext?.organizationAffiliationId,
  )
    ? selectedContext
    : undefined;
  const actor: PrimaryContextActor | undefined =
    role === "player"
      ? { role: "player", playerId: player.id }
      : role === "parent" && guardianId
        ? { role: "parent", guardianId }
        : undefined;
  const canChangePrimaryContext = role === "player" || guardianLinked;

  const updatePrimaryContext = (context: Parameters<typeof setPrimaryPlayerContext>[1]) => {
    if (!actor) return { ok: false as const, reason: "forbidden" as const };
    const result = setPrimaryPlayerContext(player.id, context, actor);
    if (result.ok) refresh((current) => current + 1);
    return result;
  };

  return { affiliations, journey, primaryContext, canChangePrimaryContext, updatePrimaryContext };
}
