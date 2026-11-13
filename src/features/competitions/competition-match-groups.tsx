import { CalendarRange } from "lucide-react";
import { MatchRow } from "@/components/ds/match-card";
import { Section } from "@/components/ds/section";
import { EmptyState } from "@/components/ds/states";
import type { Match } from "@/data/types";
import { fmtDay } from "@/lib/format";
import { groupMatchesByDate } from "./competition-view-model";

export function CompetitionMatchGroups({
  matches,
  emptyTitle,
  emptyDescription,
  newestFirst = false,
}: {
  matches: Match[];
  emptyTitle: string;
  emptyDescription?: string;
  newestFirst?: boolean;
}) {
  const groups = groupMatchesByDate(matches, newestFirst ? "newest-first" : "oldest-first");

  if (!groups.length) {
    return <EmptyState icon={CalendarRange} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {groups.map(({ date, matches: groupedMatches }) => (
        <Section
          key={date}
          title={fmtDay(date)}
          description={[...new Set(groupedMatches.map((match) => match.venue))].join(" · ")}
          flush
        >
          <div className="divide-y">
            {groupedMatches.map((match) => (
              <MatchRow key={match.id} match={match} showCompetition={false} />
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
