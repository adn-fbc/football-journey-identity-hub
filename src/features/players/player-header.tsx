import type { ReactNode } from "react";
import { PersonAvatar } from "@/components/ds/avatars";
import { FootballIdTag, VerifiedMark } from "@/components/ds/football-id";
import { OrgCrest } from "@/components/ds/team-crest";
import { getOrganization, getTeam } from "@/data/repository";
import type { Player } from "@/data/types";

export function PlayerHeader({ player, actions }: { player: Player; actions?: ReactNode | undefined }) {
  const team = getTeam(player.teamId);
  const org = getOrganization(player.orgId);
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center">
      <PersonAvatar name={player.name} src={player.photo} size="xl" className="rounded-2xl [&>*]:rounded-2xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-h1">{player.name}</h1>
          <VerifiedMark verified={player.verification === "verified"} className="size-5" />
        </div>
        <FootballIdTag id={player.footballId} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted-foreground">
          <span><b className="text-foreground">{player.positionLabel}</b> · {player.foot} foot</span>
          <span>Born {player.birthYear}</span>
          {team && <span>{team.name}{player.jersey ? ` · #${player.jersey}` : ""}</span>}
          {org && <span className="flex items-center gap-1.5"><OrgCrest orgId={org.id} size="xs" />{org.name}</span>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
