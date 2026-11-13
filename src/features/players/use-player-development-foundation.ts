import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  getCurrentGuardianId,
  getGuardianAccessDecision,
  getPlayerAccessForActor,
  getWorkspaceActor,
  getPrimaryPlayerContext,
  setPrimaryPlayerContext,
  type PrimaryContextActor,
} from "@/data/repository";
import type { Player } from "@/data/types";

export function usePlayerDevelopmentFoundation(player: Player) {
  const { role } = useRole();
  const [, refresh] = useState(0);
  const access = getPlayerAccessForActor(player.id, getWorkspaceActor(role));
  const affiliations = access.ok ? access.access.affiliations : [];
  const journey = access.ok ? access.access.journey : [];
  const guardianId = role === "parent" ? getCurrentGuardianId() : undefined;
  const selectedContext = getPrimaryPlayerContext(player.id);
  const primaryContext = affiliations.some(
    (affiliation) => affiliation.id === selectedContext?.organizationAffiliationId,
  )
    ? selectedContext
    : undefined;
  const actor: PrimaryContextActor | undefined =
    role === "player" || (role === "parent" && guardianId)
      ? getWorkspaceActor(role)
      : undefined;
  const guardianLinked = access.ok && access.access.scope.kind === "guardian";
  const canChangePrimaryContext = access.ok && (
    (role === "player" && access.access.scope.kind === "player") ||
    (role === "parent" && guardianLinked && Boolean(guardianId &&
      getGuardianAccessDecision(guardianId, player.id, "primary_context").allowed))
  );

  const updatePrimaryContext = (context: Parameters<typeof setPrimaryPlayerContext>[1]) => {
    if (!actor) return { ok: false as const, reason: "forbidden" as const };
    const result = setPrimaryPlayerContext(player.id, context, actor);
    if (result.ok) refresh((current) => current + 1);
    return result;
  };

  return { access, affiliations, journey, primaryContext, canChangePrimaryContext, updatePrimaryContext };
}
