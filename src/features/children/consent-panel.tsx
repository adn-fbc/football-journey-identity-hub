import { Building2, Camera, Eye, Megaphone, ShieldCheck, Telescope, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ds/section";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { OrgCrest } from "@/components/ds/team-crest";
import { getOrganization } from "@/data/repository";
import type { Player } from "@/data/types";

const CONSENTS = [
  { id: "scouting", icon: Telescope, title: "Allow scouting opportunities", body: "Verified scouts may view the football profile and request contact through you.", default: false },
  { id: "photo", icon: Camera, title: "Show photo in competition listings", body: "Photo appears on team sheets and competition pages.", default: true, pending: true },
  { id: "stats", icon: Trophy, title: "Publish match statistics", body: "Goals and appearances shown on public competition pages.", default: true },
  { id: "journey", icon: Eye, title: "Share journey with new organizations", body: "When joining a club, they can see past clubs and competitions.", default: true },
  { id: "media", icon: Megaphone, title: "Club media & social posts", body: "SSB Garuda Makassar may feature your child in posts.", default: false },
];

/** Guardian-controlled consent. Every change is explicit, reversible and logged. */
export function ConsentPanel({ child }: { child: Player }) {
  const [state, setState] = useState<Record<string, boolean>>(Object.fromEntries(CONSENTS.map((c) => [c.id, c.default])));
  const org = getOrganization(child.orgId);
  const name = child.nickname ?? child.name;

  const toggle = (id: string, title: string, value: boolean) => {
    setState((s) => ({ ...s, [id]: value }));
    toast.success(value ? "Permission granted" : "Permission withdrawn", { description: `${title} · ${name}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-2xl bg-ink p-5 text-ink-foreground">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-signal text-signal-foreground"><ShieldCheck className="size-5" /></span>
        <div>
          <h2 className="font-display text-lg font-semibold">You're in control of {name}'s data</h2>
          <p className="mt-1 text-small text-ink-muted">Permissions are off unless you turn them on. You can change them any time — organizations are notified instantly.</p>
        </div>
      </div>

      <Section title="Privacy & consent" flush>
        <ul className="divide-y">
          {CONSENTS.map((c) => (
            <li key={c.id} className="flex items-start gap-4 px-5 py-4">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><c.icon className="size-4" /></span>
              <label htmlFor={`consent-${c.id}`} className="min-w-0 flex-1 cursor-pointer">
                <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {c.title}
                  {c.pending && <span className="rounded-full bg-warning/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">New request</span>}
                </span>
                <span className="mt-0.5 block text-small text-muted-foreground">{c.body}</span>
              </label>
              <div className="flex items-center gap-2 pt-1">
                <span className="hidden w-7 text-right text-small font-semibold text-muted-foreground sm:block">{state[c.id] ? "On" : "Off"}</span>
                <Switch id={`consent-${c.id}`} checked={state[c.id] ?? false} onCheckedChange={(v) => toggle(c.id, c.title, v)} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Who can see this profile" description="Active data-sharing relationships" flush>
        <ul className="divide-y">
          {org && (
            <li className="flex items-center gap-3 px-5 py-4">
              <OrgCrest orgId={org.id} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{org.name}</div>
                <div className="text-small text-muted-foreground">Membership · team, schedule, attendance, verification status</div>
              </div>
              <ConfirmDialog
                trigger={<Button variant="outline" size="sm">Manage</Button>}
                title={`Limit ${org.name}'s access?`}
                description={`${name}'s membership stays active, but the club will only see name, team and verification status.`}
                confirmLabel="Limit access"
                onConfirm={() => toast.success("Access limited", { description: org.name })}
              />
            </li>
          )}
          <li className="flex items-center gap-3 px-5 py-4">
            <span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground"><Building2 className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">Makassar Youth Cup 2027</div>
              <div className="text-small text-muted-foreground">Competition · name, photo, match stats · ends 28 Mar 2027</div>
            </div>
          </li>
        </ul>
      </Section>
    </div>
  );
}
