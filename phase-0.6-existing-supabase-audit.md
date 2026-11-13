# Phase 0.6 — Existing Supabase Audit

**Project:** `football-journey-identity-hub`
**Inspection mode:** Read-only
**Date:** 2026-11-14
**Decision boundary:** No provider selection, Phase 1 authorization, schema change, or production-readiness conclusion is made by this report.

## Executive summary

The owner reports that this Lovable project is connected to GitHub and to a Supabase project, with Authentication configured, Storage available, Edge Functions/backend functions available, and project ownership retained by the repository owner. The owner supplied Supabase project reference `lvnkazaywtjrvsywabck`.

The local repository does **not** contain the corresponding Supabase application integration or schema artifacts: no Supabase SDK dependency/import, client initialization, Supabase config/migrations/functions directory, generated database types, or application Auth/Storage/function invocation was found. The Supabase CLI is unavailable on the current terminal PATH, so no remote read-only query could be performed. No Lovable dashboard or Supabase dashboard access was available in this inspection.

As a result, owner statements and repository evidence are recorded separately. No remote schema, migration history, RLS status, buckets, function inventory, Auth settings, or provider ownership was independently verified. The Supabase integration may exist remotely, but its connection to and usability from this checkout cannot be established from the checked-in repository.

## 1. Repository evidence

| Area | Finding | Evidence | Confidence |
|---|---|---|---|
| Supabase dependencies/imports | No Supabase SDK dependency or source import found. | `package.json`; search under `src/` | High for this checkout |
| Project reference in code/config | No Supabase project reference was found in repository configuration. `.lovable/project.json` contains Lovable template/revision metadata only. | `.lovable/project.json`; repository config/file search | High for checked-in files |
| Environment references | Safe scan of source/config found no `process.env.*`, `import.meta.env.*`, or `Deno.env.get(...)` variable references. No `.env*` paths were found. No environment file values were opened. | `src/`, `vite.config.ts`, `package.json`; file-path search | High for scanned paths |
| Client initialization | No `createClient`, `createServerClient`, or `createBrowserClient` Supabase initialization found. | `src/` source search | High |
| Authentication in application | No provider session/client flow is wired into the app. Identity onboarding is a local preview; active role is stored in localStorage. | `src/features/identity/identity-onboarding.tsx`; `src/lib/role-context.tsx`; `src/start.ts` | High |
| Storage integration | No Supabase Storage client, bucket config, upload, or storage access policy found. Player documents are mock metadata. | `src/`; `src/data/mock.ts`; `src/data/types.ts` | High |
| Edge Functions invocation | No Supabase Edge Function invocation/client found. No `supabase/functions/` directory was found. | `src/`; repository path search | High for checkout |
| Server functions | `src/start.ts` configures TanStack Start error and CSRF middleware; `src/server.ts` wraps the SSR fetch entry. No domain `createServerFn` functions or DB calls were found. Supabase references are conditional comments only. | `src/start.ts`; `src/server.ts`; `src/routes/` search | High |
| Database/schema/migrations | No `supabase/`, `drizzle/`, Prisma, SQL, schema or migration files were found. | Repository path search; `AGENTS.md` | High for checkout |
| Generated DB types | None found. `src/data/types.ts` defines manually maintained UI/domain interfaces and says to mirror them if a real backend is introduced. | `src/data/types.ts` | High |
| Database/RLS patterns | No SQL policies, generated DB client types, RLS helper calls, or database access path found locally. Remote RLS cannot be inferred. | Repository path search; `src/data/repository.ts` | High locally; remote unverified |
| Current data path | Repository imports `src/data/mock.ts`; local Maps hold prototype mutations. | `src/data/repository.ts`; `src/data/mock.ts` | High |
| Lovable database workflow | Project instructions say the project is Lovable-connected and database changes must be managed through Lovable; migrations must not be hand-edited. This is repository governance guidance, not evidence of an active Supabase connection. | `AGENTS.md` | High |

## 2. Owner-confirmed dashboard evidence

The following are **owner-reported** from the Phase 0.5B inspection response and have not been independently checked in the dashboard:

| Item | Owner-reported status | Interpretation |
|---|---|---|
| Lovable project | Exists | Owner confirmation. |
| GitHub | Connected to repository | Owner confirmation. |
| Supabase | Connected through Lovable | Owner confirmation; repository integration is not present in the current checkout. |
| Project reference | `lvnkazaywtjrvsywabck` | Owner-supplied reference, not a credential. It was not found in repository configuration. |
| Authentication | Configured | Owner confirmation; app-side Auth use is not present in repository source. |
| Storage | Available | Owner confirmation; bucket inventory and access policies are not known. |
| Edge Functions/backend functions | Available | Owner confirmation; function names, source, deployment state, and invocation paths are not known. |
| Supabase project owner | Repository owner | Owner confirmation; account-level permissions were not verified. |

These statements are not treated as independently verified remote evidence. No ArenaFlow configuration, project reference, or credentials were used.

## 3. Independently verified remote evidence

**None.**

- `supabase` was not recognized as an installed/available command in the current terminal, so the Supabase CLI is not available on PATH in this environment.
- No authenticated dashboard or Supabase MCP inspection capability was available in this session.
- No remote request, login, project link, or provider configuration was attempted.

Therefore the following remain **UNVERIFIED**: schema/table inventory, migration history, RLS enabled state/policies, database grants, Edge Function list/deployment state, Storage bucket list/policies, Auth configuration details, project ownership/permissions, and whether the remote project is operationally usable by this application.

## 4. Security gaps and risks

1. **No app-side authenticated data path found.** Owner-reported Auth configuration does not itself wire Auth into this app. Route visibility and the local role switcher are not server authorization.
2. **No local RLS evidence.** The checkout contains no schema or policy definitions to review. Remote RLS coverage must not be assumed from Supabase being connected.
3. **No service-role usage found, but isolation is not verified.** No service-role reference appears in the scanned source/config, and no secret values were accessed. Because remote Edge Function code and dashboard secrets were not inspected, their handling cannot be assessed.
4. **No Storage policy evidence.** Owner-reported Storage availability does not establish private buckets, object authorization, or secure links.
5. **No Edge Function code or invocation evidence in this repository.** Remote functions may exist, but the client/server connection, auth checks, input validation, and secret isolation cannot be audited locally.
6. **Client-side prototype checks only.** `src/lib/role-context.tsx`, `src/data/repository.ts`, and `src/lib/coach-access.ts` implement mock-role/scope behavior. These are not trusted boundaries for real data.
7. **Child-data restriction remains in force.** Use adult test accounts only for auth testing and synthetic player records only. Do not use real children's personal data or enable child sharing/scouting while the Phase 0.6 remote posture is unknown.

No vulnerability in a live remote database was independently confirmed; remote database security was not inspected.

## 5. Integration gaps

- Add no integration until existing remote functions/configuration are inventoried and owners authorize changes.
- No application Auth session/client, Supabase server client, or authorization middleware is in the repository.
- No server-side repository adapter or database-backed domain function was found; current reads/mutations are mock-backed.
- No generated database types, schema/migration history, RLS policies, storage client/bucket policies, or Edge Function invocations are checked in.
- The owner-reported remote backend and current app appear disconnected in this repository snapshot; confirm whether code is missing, generated elsewhere, or the remote services are currently unused.

## 6. Unverified items and dashboard follow-up

An authorized project owner should inspect the existing Lovable **More → Supabase** view and Supabase dashboard read-only, then capture non-secret evidence for:

- Connected project name/reference and status; confirm access/ownership without exposing credentials.
- Schema/table list and migration history (metadata only; do not read user rows).
- RLS enabled state and policy names/commands for each exposed table; inspect policy definitions read-only.
- Auth enabled providers/settings at a high level; do not expose secrets or user data.
- Storage bucket names and public/private status plus policy metadata; do not enumerate or download user files.
- Edge Function names, deployment status, and whether functions use user JWT verification or privileged credentials; do not display secret values.
- Owner/admin access and whether the project is the same Supabase reference supplied by the owner.
- Whether the current Lovable application actually invokes the connected services or only has them provisioned.

If CLI access becomes available later, first verify an already-authenticated state without printing tokens. Use only list/metadata commands after checking current CLI help. Do not run `login`, `link`, `db push`, migration commands, deploy, or data queries as part of this audit.

## 7. Git status and changes

At final inspection:

- Branch: `main`.
- Staged changes: none (`git diff --cached --name-status` returned no entries).
- Existing modified file: `src/routeTree.gen.ts`.
- Existing untracked files include `prd.txt` and Phase 0 documentation created in prior tasks.
- New file from this audit: `phase-0.6-existing-supabase-audit.md`.
- No existing Git changes were staged, reset, stashed, committed, or discarded.

No application code, dependency, migration, database object, provider configuration, authentication setting, environment value, or external service was changed. No remote database change occurred because no remote connection was made.

## Recommendation

Keep the owner-reported Supabase connection as a **candidate existing resource**, not a verified application integration. Do not select another provider, reconnect Supabase, authorize Phase 1, or introduce real child data from this audit. Preserve the existing provider only provisionally while the owner gathers the dashboard evidence above; a keep/replace decision requires independent review of Auth, RLS, Storage, function code, ownership, tenant isolation, and child-data safeguards.
