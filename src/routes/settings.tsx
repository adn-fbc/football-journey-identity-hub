import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatusBadge } from "@/components/ds/status-badge";
import { FootballIdTag } from "@/components/ds/football-id";
import { PersonAvatar } from "@/components/ds/avatars";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/ds/page-tabs";
import { ROLES } from "@/config/roles";
import { CURRENT_USER } from "@/data/mock";
import { useRole } from "@/lib/role-context";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => pageHead("Settings", "Manage your account, roles, notifications and privacy."),
  component: SettingsPage,
});

function SettingsPage() {
  const { role } = useRole();
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="One account for every role you hold in football." />
      <PageTabs defaultValue="account">
        <PageTabsList>
          <PageTabsTrigger value="account">Account</PageTabsTrigger>
          <PageTabsTrigger value="roles">Roles & access</PageTabsTrigger>
          <PageTabsTrigger value="notifications">Notifications</PageTabsTrigger>
          <PageTabsTrigger value="privacy">Privacy</PageTabsTrigger>
        </PageTabsList>
        <PageTabsContent value="account">
          <Section title="Profile" className="max-w-2xl">
            <div className="flex items-center gap-4">
              <PersonAvatar name={CURRENT_USER.name} size="lg" />
              <div>
                <div className="text-h3">{CURRENT_USER.name}</div>
                <FootballIdTag id={CURRENT_USER.footballId} className="mt-1" />
              </div>
            </div>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}>
              <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" defaultValue={CURRENT_USER.name} /></div>
              <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue={CURRENT_USER.email} /></div>
              <div className="space-y-1.5">
                <Label>Language</Label>
                <Select defaultValue="id"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="id">Bahasa Indonesia</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="city">City</Label><Input id="city" defaultValue="Makassar" /></div>
              <div className="sm:col-span-2"><Button type="submit">Save changes</Button></div>
            </form>
          </Section>
        </PageTabsContent>
        <PageTabsContent value="roles">
          <Section title="Your roles" description="Switch between them from the top bar — no separate accounts." flush className="max-w-2xl"
            action={<Button variant="outline" size="sm" onClick={() => toast("Request sent for review (prototype)")}><Plus /> Request role</Button>}>
            <ul className="divide-y">
              {ROLES.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{r.label}</div><div className="text-small text-muted-foreground">{r.context}</div></div>
                  {r.id === role ? <StatusBadge status="active" label="Current" /> : <StatusBadge status="verified" />}
                </li>
              ))}
            </ul>
          </Section>
        </PageTabsContent>
        <PageTabsContent value="notifications">
          <Section title="Notify me about" flush className="max-w-2xl">
            <ul className="divide-y">
              {["Match results & live scores", "Schedule changes", "Registration requests", "Consent requests", "Weekly summary email"].map((n, i) => (
                <li key={n} className="flex items-center justify-between px-5 py-3.5">
                  <Label htmlFor={`n-${i}`} className="text-sm font-semibold">{n}</Label>
                  <Switch id={`n-${i}`} defaultChecked={i < 4} />
                </li>
              ))}
            </ul>
          </Section>
        </PageTabsContent>
        <PageTabsContent value="privacy">
          <Section title="Your own Football ID" flush className="max-w-2xl">
            <ul className="divide-y">
              {["Show my name on team staff lists", "Allow organizations to find me by Football ID", "Share coaching history with new clubs"].map((n, i) => (
                <li key={n} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <Label htmlFor={`p-${i}`} className="text-sm font-semibold">{n}</Label>
                  <Switch id={`p-${i}`} defaultChecked={i !== 2} />
                </li>
              ))}
            </ul>
          </Section>
        </PageTabsContent>
      </PageTabs>
    </div>
  );
}
