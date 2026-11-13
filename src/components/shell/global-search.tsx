import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { modulesForRole } from "@/config/modules";
import { listCompetitions, listOrganizations, listPlayers, listTeams } from "@/data/repository";
import {
  getCoachAccessibleCompetitions,
  getCoachAssignedPlayers,
  getCoachAssignedTeams,
} from "@/lib/coach-access";
import { useRole } from "@/lib/role-context";
import { PersonAvatar } from "@/components/ds/avatars";
import { TeamCrest, OrgCrest } from "@/components/ds/team-crest";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useRole();
  const searchPlayers = role === "coach" ? getCoachAssignedPlayers() : listPlayers();
  const searchTeams = role === "coach" ? getCoachAssignedTeams() : listTeams();
  const searchCompetitions =
    role === "coach" ? getCoachAccessibleCompetitions() : listCompetitions();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground shadow-card transition-colors hover:text-foreground"
      >
        <Search className="size-4" />
        <span className="flex-1 truncate text-left">Search players, Football IDs, teams…</span>
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] lg:inline">⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search by name or Football ID (e.g. IDN-FB-2016-000123)" />
        <CommandList>
          <CommandEmpty>No results. Try a Football ID or player name.</CommandEmpty>
          <CommandGroup heading="Players">
            {searchPlayers.slice(0, 8).map((p) => (
              <CommandItem key={p.id} value={`${p.name} ${p.footballId}`} onSelect={() => go(() => navigate({ to: "/players/$playerId", params: { playerId: p.id } }))}>
                <PersonAvatar name={p.name} src={p.photo} size="xs" />
                <span className="flex-1">{p.name}</span>
                <span className="text-id text-muted-foreground">{p.footballId}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Teams">
            {searchTeams.slice(0, 6).map((t) => (
              <CommandItem key={t.id} value={`team ${t.name}`} onSelect={() => go(() => navigate({ to: "/teams/$teamId", params: { teamId: t.id } }))}>
                <TeamCrest teamId={t.id} size="xs" /> {t.name}
              </CommandItem>
            ))}
          </CommandGroup>
          {role !== "coach" && (
            <CommandGroup heading="Organizations">
              {listOrganizations().map((o) => (
                <CommandItem key={o.id} value={`org ${o.name}`} onSelect={() => go(() => navigate({ to: "/organizations/$orgId", params: { orgId: o.id } }))}>
                  <OrgCrest orgId={o.id} size="xs" /> {o.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading="Competitions">
            {searchCompetitions.map((c) => (
              <CommandItem key={c.id} value={`competition ${c.name}`} onSelect={() => go(() => navigate({ to: "/competitions/$competitionId", params: { competitionId: c.id } }))}>
                {c.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Go to">
            {modulesForRole(role).filter((m) => m.status !== "soon").map((m) => (
              <CommandItem key={m.id} value={`page ${m.title}`} onSelect={() => go(() => navigate({ to: m.path }))}>
                <m.icon /> {m.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
