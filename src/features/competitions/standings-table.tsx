import { Link } from "@tanstack/react-router";
import { TeamCrest } from "@/components/ds/team-crest";
import { getTeam, type StandingRow } from "@/data/repository";
import { cn } from "@/lib/utils";

export function StandingsTable({ rows, compact, qualify = 2 }: { rows: StandingRow[]; compact?: boolean | undefined; qualify?: number | undefined }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="border-b bg-muted/40 text-label text-muted-foreground">
            <th className="w-8 px-3 py-2.5 text-left">#</th>
            <th className="px-2 py-2.5 text-left">Team</th>
            <th className="px-2 py-2.5 text-center">P</th>
            {!compact && <><th className="px-2 py-2.5 text-center">W</th><th className="px-2 py-2.5 text-center">D</th><th className="px-2 py-2.5 text-center">L</th><th className="hidden px-2 py-2.5 text-center sm:table-cell">GF</th><th className="hidden px-2 py-2.5 text-center sm:table-cell">GA</th></>}
            <th className="px-2 py-2.5 text-center">GD</th>
            <th className="px-3 py-2.5 text-center">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, i) => (
            <tr key={r.teamId} className="hover:bg-muted/30">
              <td className="px-3 py-2.5">
                <span className={cn("grid size-6 place-items-center rounded-md text-xs font-bold", i < qualify ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>{i + 1}</span>
              </td>
              <td className="px-2 py-2.5">
                <Link to="/teams/$teamId" params={{ teamId: r.teamId }} className="flex items-center gap-2 font-semibold hover:text-primary">
                  <TeamCrest teamId={r.teamId} size="xs" />
                  <span className="truncate">{getTeam(r.teamId)?.name}</span>
                </Link>
              </td>
              <td className="px-2 py-2.5 text-center">{r.p}</td>
              {!compact && <><td className="px-2 py-2.5 text-center">{r.w}</td><td className="px-2 py-2.5 text-center">{r.d}</td><td className="px-2 py-2.5 text-center">{r.l}</td><td className="hidden px-2 py-2.5 text-center sm:table-cell">{r.gf}</td><td className="hidden px-2 py-2.5 text-center sm:table-cell">{r.ga}</td></>}
              <td className="px-2 py-2.5 text-center text-muted-foreground">{r.gf - r.ga > 0 ? "+" : ""}{r.gf - r.ga}</td>
              <td className="px-3 py-2.5 text-center font-display font-semibold">{r.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
