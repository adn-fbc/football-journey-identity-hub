import { Award, BriefcaseBusiness, Building2, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/ds/avatars";
import { FootballIdTag } from "@/components/ds/football-id";
import { PageHeader } from "@/components/ds/page-header";
import { InfoList, Section } from "@/components/ds/section";
import { StatusBadge } from "@/components/ds/status-badge";
import { TeamCrest } from "@/components/ds/team-crest";
import { getCoachProfileSnapshot } from "@/features/identity/coach-profile-model";

export function CoachProfile() {
  const snapshot = getCoachProfileSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="One identity · multiple roles"
        title="Coach Profile"
        description="Your coaching profile extends the same Football ID you already use across the platform. No separate Coach account is created."
      />

      <div className="passport-pattern flex flex-col gap-4 rounded-3xl p-5 text-ink-foreground md:flex-row md:items-center md:p-7">
        <PersonAvatar name={snapshot.name} size="xl" className="ring-2 ring-signal/50" />
        <div className="min-w-0">
          <div className="text-label text-signal">Coach identity</div>
          <h2 className="mt-1 font-display text-xl font-semibold md:text-2xl">{snapshot.name}</h2>
          <p className="text-small text-ink-muted">{snapshot.currentOrganization}</p>
          <FootballIdTag id={snapshot.footballId} tone="ink" className="mt-2" />
          <div className="mt-3 flex flex-wrap gap-2">
            {snapshot.activeRoles.map((role) => (
              <Badge key={role} variant="secondary" className="capitalize">
                {role.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Section
          title="Current identity"
          description="One person, multiple football responsibilities."
        >
          <InfoList
            items={[
              { label: "Full name", value: snapshot.name },
              { label: "Football ID", value: snapshot.footballId },
              { label: "Current organization", value: snapshot.currentOrganization },
              { label: "Coaching license", value: snapshot.license.title },
              { label: "License status", value: <StatusBadge status={snapshot.license.status} /> },
              { label: "Coaching experience", value: `${snapshot.experience.years} years` },
            ]}
          />
        </Section>

        <Section title="Active roles" description="All connected to this same identity.">
          <div className="flex flex-wrap gap-2">
            {snapshot.activeRoles.map((role) => (
              <Badge key={role} variant="outline" className="capitalize">
                {role.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Licenses & certifications"
          description="Credentials attached to the active Coach profile."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="size-4 text-success" />
                {snapshot.license.title}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">License number: {snapshot.license.number}</div>
              <div className="mt-3">
                <StatusBadge status={snapshot.license.status} label={snapshot.license.status === "active" ? "Active" : "Pending"} />
              </div>
            </div>

            <div className="space-y-3">
              {snapshot.certificates.map((certificate) => (
                <div key={`${certificate.name}-${certificate.year}`} className="flex gap-3 rounded-xl border p-3">
                  <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Award className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{certificate.name}</div>
                    <div className="text-small text-muted-foreground">
                      {certificate.issuer} · {certificate.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          title="Coaching experience"
          description="The background behind the active coaching role."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness className="size-5" />
              </span>
              <div>
                <div className="text-label text-muted-foreground">Years coaching</div>
                <div className="text-2xl font-semibold text-foreground">{snapshot.experience.years}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{snapshot.experience.summary}</p>
            <div className="rounded-xl border p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Star className="size-4 text-warning" />
                Current coaching focus
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Player development, technical routines, and match preparation for assigned youth teams.
              </p>
            </div>
          </div>
        </Section>
      </div>

      <Section
        title="Current teams"
        description="Teams currently assigned to this Coach identity."
      >
        {snapshot.currentTeams.length ? (
          <ul className="divide-y">
            {snapshot.currentTeams.map((team) => (
              <li key={team.id} className="flex items-center gap-3 px-1 py-3">
                <TeamCrest teamId={team.id} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">{team.name}</div>
                  <div className="text-small text-muted-foreground">
                    {team.ageCategory} · {team.season}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={team.status} label={team.status === "active" ? "Assigned" : "Draft"} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            No current team assignments are linked to this Coach identity yet.
          </div>
        )}
      </Section>

      <Section
        title="Organization relationship"
        description="Professional connection to the current football organization."
      >
        <div className="flex items-center gap-3 rounded-xl border p-4">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-4" />
          </span>
          <div>
            <div className="font-semibold text-foreground">{snapshot.currentOrganization}</div>
            <div className="text-small text-muted-foreground">
              Active coach profile connected to this organization and assigned teams.
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
