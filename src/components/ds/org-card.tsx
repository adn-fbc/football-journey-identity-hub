import { Link } from "@tanstack/react-router";
import { MapPin, Shield, Users } from "lucide-react";
import type { Organization } from "@/data/types";
import { Crest } from "./avatars";
import { StatusBadge } from "./status-badge";

export function OrgCard({ org }: { org: Organization }) {
  return (
    <Link to="/organizations/$orgId" params={{ orgId: org.id }} className="surface group block p-5 transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <Crest label={org.short} hue={org.color} size="lg" />
        <StatusBadge status={org.verification} />
      </div>
      <h3 className="mt-4 text-h3 group-hover:text-primary">{org.name}</h3>
      <p className="mt-0.5 flex items-center gap-1 text-small text-muted-foreground">
        <MapPin className="size-3.5" /> {org.city} · {org.type} · since {org.founded}
      </p>
      <div className="mt-4 flex gap-4 border-t pt-3 text-small text-muted-foreground">
        <span className="flex items-center gap-1.5"><Users className="size-3.5" /><b className="text-foreground">{org.players}</b> players</span>
        <span className="flex items-center gap-1.5"><Shield className="size-3.5" /><b className="text-foreground">{org.teams}</b> teams</span>
      </div>
    </Link>
  );
}
