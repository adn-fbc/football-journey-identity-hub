# Phase 0 Readiness Checklist

**Status:** Planning gate. No production implementation is approved. A checked box means evidence was reviewed; `OWNER_DECISION_REQUIRED` means the accountable owner must decide before the gate is complete.

## Provider readiness

- [x] Repository dependency/source scan found no Supabase SDK, schema, migration, or configured Auth provider.
- [x] `AGENTS.md` confirms Lovable manages database changes; manual `supabase/migrations/` and `drizzle/` edits are prohibited.
- [x] `.lovable/project.json` contains only a template/revision identifier, not a backend/project ID.
- [x] **Owner-confirmed:** A Lovable project exists and is connected to GitHub.
- [x] DECISION-003 (`APPROVED`) makes inspection of the existing backend/provider a prerequisite to provider selection; approval does not authorize connecting or changing a provider.
- [ ] **`OWNER_DECISION_REQUIRED`:** Project owner manually inspects Lovable **More → Supabase/Database** and the provider dashboard to establish whether a backend, Lovable-managed database, or Supabase project exists; whether the owner has access/control; what auth/database/storage/deployment configuration exists; and whether the backend is usable and satisfies security, privacy, tenant-isolation, and child-safety requirements. The Phase 0.5B form did not select a status for database, authentication, storage, or backend/edge functions.
- [ ] Record verifiable dashboard evidence without exposing credentials. Repository metadata and the owner-confirmed GitHub connection do not establish a remote database/provider connection.
- [ ] **`OWNER_DECISION_REQUIRED`:** Backend owner, billing account, region, backup/restore, support path, and data-export/exit plan are identified.
- [ ] **`OWNER_DECISION_REQUIRED`:** Select provider only after comparing ownership, Auth, PostgreSQL, RLS, private storage, backups, audit/operations, pricing, and Lovable workflow.
- [ ] Provider selection remains `PENDING` until inspection evidence is collected and the owner explicitly approves a choice.
- [ ] Any provider connection, disconnection, replacement, configuration push, or database change requires separate explicit approval; none is authorized by DECISION-003.
- [ ] Confirm provider's current SSR/session model against actual TanStack Start and Cloudflare/Nitro versions using a non-production smoke test after approval.
- [ ] Confirm one and only one authoritative database per environment; no shared Lovable project without an explicit schema/secrets ownership plan.

## Deployment readiness

- [x] Local Vite config documents Nitro with Cloudflare as a default build target.
- [x] No production host, Wrangler/deploy configuration, provider binding, or deployment evidence was found in the repository.
- [ ] **`OWNER_DECISION_REQUIRED`:** Confirm actual production host/region/runtime, caching/CDN behavior, secrets/bindings, logs, backups and recovery owner.
- [ ] Verify request-bound session cookies, CSRF behavior, cache headers, response caching, SSR, and server-function behavior on the selected runtime.
- [ ] Establish production/staging separation, deployment review, rollback and incident-response ownership.
- [ ] Confirm runtime supports chosen provider client or direct connection. If Cloudflare + PostgreSQL direct access is selected, explicitly approve Hyperdrive/bindings and transaction-scoped RLS identity; otherwise use a user-bound Data API/server path.

## Authentication readiness

- [x] Current onboarding is a local preview; no real authentication/session management is present.
- [x] Current role context is client-side presentation state, not identity proof.
- [x] Under DECISION-002 (`APPROVED`), use adult test accounts only for account/authentication testing; do not use a child's real account or credentials.
- [ ] **`OWNER_DECISION_REQUIRED`:** Select provider-owned account lifecycle: registration, login, logout, session expiry/revocation, password recovery, email/phone verification, MFA/step-up needs and support recovery.
- [ ] **`OWNER_DECISION_REQUIRED`:** Approve person/account cardinality, multiple IdP linking, account recovery/linking, child-without-account behavior and duplicate-person resolution.
- [ ] Implement server-verified session/claims at every private server-function boundary; do not rely on route guards alone.
- [ ] Ensure logout/account switch clears user-scoped TanStack Query caches and any other cached private projections.

## Authorization readiness

- [x] Existing project contract is identity + role + scope + context + permission; UI role switching is not authorization.
- [ ] **`OWNER_DECISION_REQUIRED`:** Approve the complete role/scope matrix, organization hierarchy/delegation, owner/admin separation, event/referee scope, association/federation mandate, platform support/break-glass procedure.
- [ ] Define source of truth for active memberships/assignments and prompt access revocation semantics.
- [ ] Define per-domain policy functions and typed deny/not-found/error behavior; fail closed on missing/ambiguous context.
- [ ] Approve PostgreSQL RLS design for every exposed table/view/function; include read, insert, update `USING`/`WITH CHECK`, delete, grants and security-invoker view behavior.
- [ ] Test cross-tenant access through direct IDs, nested joins, server functions, views, exports, search, caches and any storage URLs.
- [ ] Keep privileged service credentials out of browser and ordinary user requests.

## Child protection readiness

- [x] ADR-11 requires verified guardian relationship separate from scoped consent; it explicitly defers policy/legal thresholds.
- [x] ADR-12 blocks automatic historical sharing on new affiliation.
- [x] DECISION-002 (`APPROVED`) prohibits real children's personal data during initial development/testing and permits synthetic/dummy player data only.
- [x] Keep real child-profile sharing, real child scouting discovery, and exposure to scouts/clubs/academies/other organizations disabled and out of scope during initial development/testing.
- [ ] **`OWNER_DECISION_REQUIRED`:** Approve guardian relationship verification method, verifier role, evidence minimization/storage/retention and dispute handling.
- [ ] **`OWNER_DECISION_REQUIRED`:** Approve multiple-guardian conflicts, revocation precedence, family dispute escalation and safeguarding route.
- [ ] **`OWNER_DECISION_REQUIRED`:** Approve consent categories/actions/purposes/recipients/expiry, child assent, age transition, adult reauthorization and identity-data reliability.
- [ ] **`OWNER_DECISION_REQUIRED`:** Approve data classification and access for raw coach observations, development records, medical/safeguarding records, public profile, scouting, exports and AI/analytics.
- [ ] **`OWNER_DECISION_REQUIRED`:** Approve retention, deletion, legal hold, account erasure and historical record policy per class.
- [ ] **`OWNER_DECISION_REQUIRED`:** Independently review and test all child safeguards before any proposal to introduce real child data; this approval does not itself authorize a real child-data system.
- [ ] Keep scout discovery/indexing disabled until explicit consent projection, revocation/cache behavior, search fields, recipient and purpose rules pass tests.
- [ ] Do not load real child data until every above policy gate and technical gate has an owner sign-off.

## Database workflow readiness

- [x] No schema/migrations exist in this workspace inventory.
- [x] `AGENTS.md` requires Lovable-managed DB work; do not hand-edit or execute migrations through repository tools.
- [ ] **`OWNER_DECISION_REQUIRED`:** Confirm provider and designated schema owner; identify the approved Lovable workflow and how schema/migration/type generation is reviewed and recorded.
- [ ] Resolve `player_affiliations` versus `team_members` and date-containment invariants without changing ADR-10 or the Phase 1 specification silently.
- [ ] Define typed organization hierarchy/relationship semantics and whether authority ever delegates through a relationship.
- [ ] Review FK/unique/check constraints, temporal invariants, transactional boundaries, indexes based on tenant query paths, RLS policies and grants before owner-approved schema creation.
- [ ] Establish schema drift review, backup/restore validation, migration rollback/forward-fix policy, and data retention/deletion operation.
- [ ] No schema creation, migration, seed of real data, or DB connection is part of this Phase 0 package.

## Test environment readiness

- [x] Existing test setup is Vitest/jsdom; existing tests are fixture-based and do not prove database authorization.
- [x] Under DECISION-002 (`APPROVED`), use synthetic/dummy player profiles and football records only during development/testing; keep synthetic data isolated from production.
- [ ] Use adult test accounts only for account/authentication tests; no real child account, personal data, profile, document, or football record may enter test fixtures, logs, screenshots, exports, or test providers.
- [ ] **`OWNER_DECISION_REQUIRED`:** Choose isolated local/CI database and provider staging project with no production child data.
- [ ] Create synthetic test subjects for two organizations, multiple roles, unlinked/linked guardians, several consent states and assigned/unassigned coaches.
- [ ] Add automated tests for auth session, RLS and tenant isolation, consent issuance/revocation, audit/transaction atomicity, negative direct server-function calls and storage access.
- [ ] Add test that spoofed role/org/player/guardian IDs never grant access, including unauthenticated and stale-session scenarios.
- [ ] Add E2E cases for role-specific UI, logout/cache clearing, responsive routes and denied/error states without altering design system.
- [ ] Confirm CI can run tests against ephemeral/staging resources without secrets or accidental production writes.

## Phase 1 go/no-go

**NO-GO for real child data or production child-data access.** During initial development/testing, adult accounts may be used only for authentication tests and player records must be synthetic/dummy data only. Real child data, child-profile sharing, and child scouting are prohibited until the release gates are designed, implemented, independently reviewed, and tested: provider/deployment and account decisions; server-verified auth and tenant authorization; guardian relationship verification/evidence handling; multiple-guardian/conflicting-authority handling; scoped, purpose-bound, recipient-bound and time-bounded consent; revocation and audit history; child assent/adulthood transition policy; role/attribute controls; tenant isolation; scouting/profile-share authorization; minimization/retention/deletion/export policy; and negative cross-tenant/consent-denial tests. No legal age threshold is inferred.

A small adult-only authenticated identity slice may be considered separately after provider/session approval, using synthetic data and no player/guardian records. This is a proposal, not authorization to begin.