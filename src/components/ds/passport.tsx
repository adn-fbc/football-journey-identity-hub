import { BadgeCheck, Fingerprint } from "lucide-react";
import { getOrganization, getTeam } from "@/data/repository";
import type { Player } from "@/data/types";
import { cn } from "@/lib/utils";
import { FootballIdTag } from "./football-id";

function mrz(player: Player) {
  const [first, ...rest] = player.name.toUpperCase().split(" ");
  const last = rest.pop() ?? "";
  const line1 = `FB<IDN${last}<<${[first, ...rest].join("<")}`.padEnd(40, "<").slice(0, 40);
  const line2 = `${player.footballId.replace(/-/g, "")}<${player.birthYear}${player.gender}<${player.position}`.padEnd(40, "<").slice(0, 40);
  return [line1, line2];
}

/** The Football ID "passport". Persistent identity — the organization is shown as a current relationship only. */
export function FootballPassport({ player, className }: { player: Player; className?: string }) {
  const team = getTeam(player.teamId);
  const org = getOrganization(player.orgId);
  const verified = player.verification === "verified";
  const [l1, l2] = mrz(player);
  return (
    <article className={cn("passport-pattern relative overflow-hidden rounded-3xl text-ink-foreground shadow-elevated", className)}>
      <div className="flex items-center justify-between border-b border-ink-border px-5 py-4 md:px-7">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-signal text-signal-foreground">
            <Fingerprint className="size-4" />
          </span>
          <div className="leading-tight">
            <div className="text-label text-ink-muted">Football ID</div>
            <div className="font-display text-sm font-semibold">Youth Football Passport · Indonesia</div>
          </div>
        </div>
        {verified ? (
          <span className="flex items-center gap-1.5 rounded-full bg-signal/15 px-3 py-1 text-xs font-semibold text-signal">
            <BadgeCheck className="size-3.5" /> Verified identity
          </span>
        ) : (
          <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-semibold text-warning">Verification pending</span>
        )}
      </div>

      <div className="grid gap-6 px-5 py-6 md:grid-cols-[auto_1fr] md:px-7">
        <div className="flex items-center gap-4 md:block">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl ring-1 ring-ink-border md:size-36">
            {player.photo ? (
              <img src={player.photo} alt={player.name} width={144} height={144} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-ink-foreground/10 font-display text-3xl">{player.name[0]}</div>
            )}
          </div>
          <div className="md:hidden">
            <h2 className="font-display text-xl font-semibold leading-tight">{player.name}</h2>
            <FootballIdTag id={player.footballId} tone="ink" className="mt-2" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="hidden md:block">
            <div className="text-label text-ink-muted">Name</div>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">{player.name}</h2>
            <FootballIdTag id={player.footballId} tone="ink" className="mt-3 text-sm" />
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:mt-6 md:grid-cols-3">
            {[
              ["Birth year", player.birthYear],
              ["Primary position", player.positionLabel],
              ["Preferred foot", player.foot],
              ["Current organization", org?.name ?? "—"],
              ["Current team", team ? `${team.name} · #${player.jersey}` : "—"],
              ["Nationality", "Indonesia"],
            ].map(([k, v]) => (
              <div key={k as string} className="min-w-0">
                <dt className="text-label text-ink-muted">{k}</dt>
                <dd className="mt-1 truncate text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-ink-border bg-ink-foreground/[0.03] px-5 py-3 font-mono text-[10px] leading-relaxed tracking-[0.2em] text-ink-muted md:px-7 md:text-xs" aria-hidden>
        <div className="truncate">{l1}</div>
        <div className="truncate">{l2}</div>
      </div>
    </article>
  );
}
