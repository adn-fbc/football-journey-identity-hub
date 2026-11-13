import { useState, type FormEvent } from "react";
import { BadgeCheck, Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { FootballIdTag } from "@/components/ds/football-id";
import { PersonAvatar } from "@/components/ds/avatars";
import { JourneyTimeline } from "@/components/ds/journey-timeline";
import { useRole } from "@/lib/role-context";
import type { JourneyEvent } from "@/data/types";
import type { RoleId } from "@/config/roles";
import { FootballRoleList, IdentityRolePicker } from "./identity-roles";

const STEPS = ["Welcome", "Account", "Identity", "Roles", "Profile", "Football ID"] as const;

export function IdentityOnboarding() {
  const { setRole } = useRole();
  const [step, setStep] = useState(0);
  const [accountMode, setAccountMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roles, setRoles] = useState<RoleId[]>(["player"]);
  const [error, setError] = useState("");

  const continueFlow = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (step === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Enter an email address to continue.");
        return;
      }
      if (password.length < 8) {
        setError("Use at least 8 characters for this demo step.");
        return;
      }
      setPassword("");
    }

    if (step === 2) {
      const year = Number(birthYear);
      if (
        !fullName.trim() ||
        !Number.isInteger(year) ||
        year < 1900 ||
        year > new Date().getFullYear()
      ) {
        setError("Enter your name and a valid birth year.");
        return;
      }
    }

    if (step === 3 && !roles.length) {
      setError("Choose at least one role. You can add more later.");
      return;
    }

    if (step === 4) {
      setRole(roles[0]!);
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setStep(0);
    setAccountMode("signup");
    setEmail("");
    setPassword("");
    setFullName("");
    setBirthYear("");
    setDisplayName("");
    setRoles(["player"]);
    setError("");
  };

  const footballId = `IDN-FB-${birthYear}-000999`;
  const profileName = displayName.trim() || fullName.trim();
  const previewEvent: JourneyEvent = {
    id: "identity-preview",
    date: new Date().toISOString().slice(0, 10),
    year: new Date().getFullYear(),
    type: "identity",
    title: "Football ID preview created",
    detail: "This is a local prototype preview, not a registry record.",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="One identity · many roles"
        title={step === STEPS.length - 1 ? "Your Football ID profile" : "Set up your Football ID"}
        description="A single identity that stays yours as your football journey grows."
      />

      {step < STEPS.length - 1 ? (
        <Section
          title={step === 0 ? "Welcome to Football ID" : STEPS[step]}
          description={
            step === 0
              ? "One person. One identity. Every football role and relationship in one place."
              : undefined
          }
        >
          {step > 0 && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-small">
                <span className="font-semibold">
                  Step {step} of {STEPS.length - 1}
                </span>
                <span className="text-muted-foreground">{STEPS[step]}</span>
              </div>
              <Progress
                value={(step / (STEPS.length - 1)) * 100}
                aria-label={`Step ${step} of ${STEPS.length - 1}`}
              />
            </div>
          )}

          <form onSubmit={continueFlow} className="space-y-5">
            {step === 0 && (
              <div className="max-w-2xl space-y-4">
                <div className="grid size-12 place-items-center rounded-xl bg-ink text-signal">
                  <Fingerprint className="size-6" />
                </div>
                <h2 className="text-h2">The player owns the journey.</h2>
                <p className="text-body text-muted-foreground">
                  Your Football ID belongs to you. Clubs, teams, and competitions connect through
                  relationships that can change without taking your identity with them.
                </p>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 text-small text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Start with only the details needed to create your profile. Sensitive documents
                    are not requested in this setup preview.
                  </span>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="max-w-md space-y-5">
                <div
                  className="inline-flex rounded-lg border bg-muted/40 p-1"
                  role="group"
                  aria-label="Account action"
                >
                  <button
                    type="button"
                    aria-pressed={accountMode === "signup"}
                    onClick={() => setAccountMode("signup")}
                    className={`rounded-md px-3 py-1.5 text-small font-semibold ${accountMode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    aria-pressed={accountMode === "signin"}
                    onClick={() => setAccountMode("signin")}
                    className={`rounded-md px-3 py-1.5 text-small font-semibold ${accountMode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Sign in
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identity-email">Email</Label>
                  <Input
                    id="identity-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identity-password">Password</Label>
                  <Input
                    id="identity-password"
                    type="password"
                    autoComplete={accountMode === "signup" ? "new-password" : "current-password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <p className="flex items-start gap-2 text-small text-muted-foreground">
                  <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
                  Demo only. Do not enter a real password; credentials are not transmitted or saved.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-md space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="identity-name">Full name</Label>
                  <Input
                    id="identity-name"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identity-birth-year">Birth year</Label>
                  <Input
                    id="identity-birth-year"
                    type="number"
                    inputMode="numeric"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                    value={birthYear}
                    onChange={(event) => setBirthYear(event.target.value)}
                    placeholder="2016"
                  />
                  <p className="text-small text-muted-foreground">
                    Only the year is requested here. No full birth date or identity documents.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-small text-muted-foreground">
                  Choose every role that applies to this person. Roles share one identity; they do
                  not create separate accounts.
                </p>
                <IdentityRolePicker value={roles} onChange={setRoles} />
              </div>
            )}

            {step === 4 && (
              <div className="max-w-lg space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="identity-display-name">
                    Preferred name{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="identity-display-name"
                    autoComplete="nickname"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder={fullName || "How should we address you?"}
                  />
                </div>
                <div>
                  <div className="mb-2 text-label text-muted-foreground">
                    Selected football roles
                  </div>
                  <FootballRoleList roles={roles} />
                </div>
                <p className="text-small text-muted-foreground">
                  You can complete other profile details later. Contact details and documents are
                  kept out of the Football ID profile preview.
                </p>
              </div>
            )}

            {error && (
              <p role="alert" className="text-small font-medium text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={goBack}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              <Button
                type={step === 0 ? "button" : "submit"}
                onClick={step === 0 ? () => setStep(1) : undefined}
              >
                {step === 0
                  ? "Get started"
                  : step === 4
                    ? "Create Football ID preview"
                    : "Continue"}
              </Button>
            </div>
          </form>
        </Section>
      ) : (
        <div className="space-y-6">
          <Section
            title="Football ID preview"
            description="This sample ID is not reserved or registered. No account or identity data was sent to a service."
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <PersonAvatar name={profileName} size="xl" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-info" />
                  <span className="text-label text-info">Preview only</span>
                </div>
                <h2 className="mt-1 truncate text-h2">{profileName}</h2>
                <p className="mt-1 text-small text-muted-foreground">Birth year {birthYear}</p>
                <FootballIdTag id={footballId} className="mt-3" copy={false} />
              </div>
            </div>
          </Section>

          <div className="grid gap-6 lg:grid-cols-3">
            <Section title="Football roles" description="One person can hold multiple roles.">
              <FootballRoleList roles={roles} activeRole={roles[0]} />
            </Section>
            <Section
              title="Organization relationships"
              description="Organizations connect to your identity; they do not own it."
            >
              <p className="text-small text-muted-foreground">
                No organization relationship in this preview.
              </p>
            </Section>
            <Section
              title="Team relationships"
              description="Team membership is separate from your Football ID."
            >
              <p className="text-small text-muted-foreground">
                No team relationship in this preview.
              </p>
            </Section>
          </div>

          <Section
            title="Football journey"
            description="Your history follows your identity between teams and organizations."
          >
            <JourneyTimeline events={[previewEvent]} />
          </Section>
          <div className="flex justify-end">
            <Button variant="outline" onClick={restart}>
              Start another preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
