import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ds/filter-bar";
import { InfoList, Section } from "@/components/ds/section";
import { EmptyState } from "@/components/ds/states";
import { TeamCrest } from "@/components/ds/team-crest";
import { getOrganization, getTeam } from "@/data/repository";
import type { CompetitionCategory } from "@/data/types";
import { teamGroupsForCategory } from "./competition-view-model";

export function CompetitionCategorySelector({
  categories,
  value,
  onChange,
}: {
  categories: CompetitionCategory[];
  value: string;
  onChange: (categoryId: string) => void;
}) {
  if (!categories.length) return null;

  return (
    <FilterChips
      value={value}
      onChange={onChange}
      options={categories.map((category) => ({
        value: category.id,
        label: category.label,
        count: category.teamIds.length,
      }))}
    />
  );
}

export function CompetitionCategoryCard({
  category,
  matchCount,
  onOpenTeams,
}: {
  category: CompetitionCategory;
  matchCount: number;
  onOpenTeams: (categoryId: string) => void;
}) {
  const groups = teamGroupsForCategory(category);

  return (
    <Section
      title={category.label}
      description={`${category.birthYear} · ${category.format}`}
      flush
      action={
        <Button size="sm" variant="outline" onClick={() => onOpenTeams(category.id)}>
          View teams
        </Button>
      }
    >
      <InfoList
        className="px-5 py-4 sm:grid-cols-3"
        items={[
          { label: "Teams", value: category.teamIds.length },
          { label: "Groups", value: category.groups.length || "—" },
          { label: "Matches", value: matchCount },
        ]}
      />
      {groups.length ? (
        <ul className="divide-y border-t px-5">
          {groups.map((group) => (
            <li key={group.name} className="py-3">
              <div className="flex items-center justify-between text-small font-semibold">
                <span>{group.name}</span>
                <span className="text-muted-foreground">{group.teamIds.length} teams</span>
              </div>
              {group.teamIds.length ? (
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {group.teamIds.map((teamId) => {
                    const team = getTeam(teamId);
                    if (!team) return null;
                    return (
                      <li key={team.id}>
                        <Link
                          to="/teams/$teamId"
                          params={{ teamId: team.id }}
                          className="flex min-w-0 items-center gap-2 text-small hover:text-primary"
                        >
                          <TeamCrest teamId={team.id} size="xs" />
                          <span className="min-w-0 flex-1 truncate">{team.name}</span>
                          <span className="hidden truncate text-muted-foreground md:block">
                            {getOrganization(team.orgId)?.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2 text-small text-muted-foreground">Teams not announced yet.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-t p-5">
          <EmptyState
            title="Groups not announced"
            description="Teams will be listed here when categories are published."
          />
        </div>
      )}
    </Section>
  );
}
