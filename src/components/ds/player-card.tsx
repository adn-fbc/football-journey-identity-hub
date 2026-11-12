import { Link } from "@tanstack/react-router";
import { getOrganization, getTeam } from "@/data/repository";
import type { Player } from "@/data/types";
import { PersonAvatar } from "./avatars";
import { FootballIdTag, VerifiedMark } from "./football-id";
import { StatusBadge } from "./status-badge";

export function PlayerCard({ player, to = "player" }: { player: Player; to?: "player" | "child" }) {
  const team = getTeam(player.teamId);
  const org = getOrganization(player.orgId);
  const inner = (
    <>
      <div className="flex items-start gap-3">
        <PersonAvatar name={player.name} src={player.photo} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-h3">{player.name}</h3>
            <VerifiedMark verified={player.verification === "verified"} />
          </div>
          <p className="text-small text-muted-foreground">
            {player.positionLabel} · {team?.name ?? "No team"}
          </p>
          <FootballIdTag id={player.footballId} className="mt-2" copy={false} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3 text-small">
        <span className="truncate text-muted-foreground">{org?.name}</span>
        <StatusBadge status={player.membership} />
      </div>
    </>
  );
  const cls = "surface block p-4 transition-shadow hover:shadow-elevated";
  return to === "child" ? (
    <Link to="/children/$playerId" params={{ playerId: player.id }} className={cls}>{inner}</Link>
  ) : (
    <Link to="/players/$playerId" params={{ playerId: player.id }} className={cls}>{inner}</Link>
  );
}
