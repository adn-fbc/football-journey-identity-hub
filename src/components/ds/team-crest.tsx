import { getOrganization, getTeam } from "@/data/repository";
import { Crest } from "./avatars";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

export function TeamCrest({ teamId, size = "md", tone }: { teamId: string; size?: Size; tone?: "solid" | "soft" }) {
  const team = getTeam(teamId);
  const org = getOrganization(team?.orgId);
  return <Crest label={org?.short ?? "—"} hue={org?.color ?? "250"} size={size} tone={tone} />;
}

export function OrgCrest({ orgId, size = "md", tone }: { orgId: string; size?: Size; tone?: "solid" | "soft" }) {
  const org = getOrganization(orgId);
  return <Crest label={org?.short ?? "—"} hue={org?.color ?? "250"} size={size} tone={tone} />;
}
