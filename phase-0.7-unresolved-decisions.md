# Phase 0.7 — Unresolved Decisions

**Status:** Carry-forward register for architecture review. Every item below is `PENDING` unless explicitly labeled as an already-approved invariant. This document does not approve provider use, schema, implementation, Phase 1, or real child-data processing.

## Approved domain constraints (not open for silent redesign)

- **DECISION-001 — National Football Identity: `APPROVED`.** Player-owned, organization-independent National Football ID remains stable across affiliation, roster, competition and transfer changes.
- **DECISION-002 — Child Data Development Restriction: `APPROVED`.** Adult accounts only for auth testing; synthetic player records only; no real child data/sharing/scouting during initial development/testing until gates pass.
- **DECISION-003 — Existing Backend Inspection: `APPROVED`.** Inspect before provider selection; this does not authorize creating/connecting/changing a provider.
- **ADR-09–12: retained.** Independent assessment verification and revision history; global player identity and dated affiliations; independent verified guardian relationship and scoped consent; no automatic cross-organization history sharing.

## Carry-forward P-01 through P-23

Statuses below are unchanged from `phase-0-decision-register.md`. The latest owner context provides new **owner-reported** Supabase availability/fresh-project information, but does not independently verify dashboard state or close any decision.

| ID | Topic | Current state | Required decision/evidence | Dependency / risk |
|---|---|---|---|---|
| P-01 | Existing backend/provider inspection | `PENDING` | Owner reports Supabase project exists, is owner-controlled/fresh and has Auth, Storage and Edge Functions configured. Independently inspect Lovable/provider dashboard read-only: exact project connection, status, owner access, app usability and settings. Do not infer remote state from repository. | Blocks provider/integration assessment. |
| P-02 | Provider selection/adoption | `PENDING` | Decide whether and how the owner-reported existing Supabase project is the application system of record after inspection. Availability is not explicit approval to integrate/use it. No provider changes during this phase. | P-01, deployment, data ownership, security and operations. |
| P-03 | Hosting/deployment ownership | `PENDING` | Confirm production host/runtime/region, owner, CDN/cache semantics, bindings/secrets operations, backups, restore, rollback and incident ownership. Repository only implies Nitro/Cloudflare defaults. | Auth cookie/runtime and DB connectivity design. |
| P-04 | Supabase access path/runtime | `PENDING` | After P-01/P-02/P-03, choose user-bound server/Data API or direct PostgreSQL connection; verify claims, RLS context, transactions, caching and Worker compatibility. | Avoid privileged-service bypass and cross-user cache/session leakage. |
| P-05 | Account/person cardinality | `PENDING` | Decide platform account ↔ person cardinality, multiple provider identities, account recovery/linking/merge and shared-account prohibition. | Foundational auth/person relationship and child account model. |
| P-06 | Person roles vs scoped assignments | `PENDING` | Define which roles are person capabilities versus scoped organization/team/event/governance assignments; define assignment revocation and role lifecycle. | RBAC/ABAC correctness and tenant enforcement. |
| P-07 | Organization hierarchy and delegation | `PENDING` | Define organization types, relationship cardinality, parent/child/delegation, verification and whether any authority is inherited (recommend no implicit inheritance). | Association/federation scope and data leakage risk. |
| P-08 | `player_affiliations` versus `team_members` | `PENDING` | Choose polymorphic affiliation relation or distinct organization affiliation and team roster relation. ADR-10 and conceptual model allow team-scoped affiliation; PRD lists both tables; Phase 1 audit prefers distinction. | Affects identity, roster, transfers, query paths, history and integrity. |
| P-09 | Affiliation/roster temporal constraints | `PENDING` | Decide exact same-player/org/team references, date containment, concurrency, overlapping duplicate prevention, backdating and correction rules. | Depends on P-08; requires transactional invariants. |
| P-10 | Transfer workflow | `PENDING` | Decide who initiates/approves transfer, guardian/player role, source/destination acknowledgements, effective dates, dispute/correction and operational access cutoff. | Must preserve identity/history and not grant prior-org data. |
| P-11 | Child account behavior | `PENDING` | Decide whether/when child has login, delegated guardian setup, identity/account linking, recovery and control transition. Do not invent age threshold. | P-05 and guardian/adult policy. |
| P-12 | Guardian verification | `PENDING` | Approve claim/verification process, authorized verifier, evidence minimization/handling, expiry, dispute and revocation. No legal sufficiency or method is assumed. | Blocks real child access. |
| P-13 | Multiple guardians/conflicting authority | `PENDING` | Decide independent authority evidence, conflict/revocation precedence, family dispute and safeguarding escalation. | Must not inherit one guardian's consent to another. |
| P-14 | Consent model/lifecycle | `PENDING` | Define categories, actions, purposes, recipients, effective/expiry, grantor authority, versioning, revoke/suspend, audit and export behavior. | Blocks guardian and scout access; requires classification. |
| P-15 | Assent/adulthood transition | `PENDING` | Establish policy for assent and transfer of control at relevant transition; no age/legal threshold is assumed. ADR-11's suspension pending player authorization remains a planning rule. | Legal/privacy owner input and reliable verified identity data. |
| P-16 | Coach observation visibility | `PENDING` | Resolve feature-catalog rule (raw observations not shared) against consented-observation language elsewhere. Distinguish internal raw notes from reviewed/published feedback if approved. | Child welfare, coach candor and development product contracts. |
| P-17 | Classification taxonomy | `PENDING` | Define record/field classes including public, org-private, person-private, child-sensitive, guardian/legal, financial, safeguarding and audit; define cross-domain visibility. | Required for RLS, search, sharing, exports and storage. |
| P-18 | Retention/deletion/legal hold | `PENDING` | Approve per-class retention, corrections/anonymization, account closure, legal hold, export copies and audit retention. | Historical continuity must coexist with approved retention policy. |
| P-19 | Scout discovery/profile share | `PENDING` | Decide eligibility/search indexing, minimal fields, exact recipient/purpose/time scope, revocation/cache behavior and contact flow. Keep child scouting disabled under DECISION-002. | Consent, classification, privacy and audit. |
| P-20 | Export/analytics permissions | `PENDING` | Define subject/org/guardian export authority, approved fields, recipient controls, aggregate/re-identification safeguards and audit. | Data minimization and inability to recall exported copies. |
| P-21 | Database ownership/change workflow | `PENDING` | Confirm Lovable-managed schema workflow, migration/type ownership, approval boundary, drift control and backup/restore. `AGENTS.md` forbids manual migration edits. | Supabase owner confirmation does not itself approve schema changes. |
| P-22 | Test environment | `PENDING` | Establish isolated test project/database, adult test accounts for auth, synthetic player data only, two-tenant fixtures, no production data and CI credential handling. | Required for safe RLS/consent/security validation. |
| P-23 | External API/integration contract | `PENDING` | Decide when public APIs begin, partner identity/trust, versioning, client scopes, consent delegation, rate limits and integration governance. | PRD is API-first long-term; do not expose endpoints prematurely. |

## Additional domain lifecycle decisions surfaced by Phase 0.7

These details are not fully closed by the existing P-register; they are recorded here as pending domain work and must not be treated as approved merely because a conceptual lifecycle is shown in `phase-0.7-domain-architecture.md`.

| ID | Topic | Pending question | Consequence if left open |
|---|---|---|---|
| D-24 | National Football ID identifier lifecycle | Issuance authority, collision/duplicate resolution, merge/split, lost or compromised ID response, lookup projection, and exceptional retirement/reissue policy. Keep National Football ID as an identifier only; it is never a password, authentication credential, access token, or login secret. | Duplicate players, identity takeover, and misuse of identity as a credential. |
| D-25 | Organization verification | Who verifies organization identity, registration evidence, renewal/suspension/closure, and external registry references? | Fake organizations and unauthorized staff enrollment. |
| D-26 | Organization membership lifecycle | Invitation, acceptance, approval, suspension/end, role grant/revocation, conflicting roles, and owner transfer. | Stale tenant access or privilege escalation. |
| D-27 | Team/season lifecycle | Team creation/closure, season rollover, roster effective dates, staff assignment, and roster correction workflow. | Roster history ambiguity and incorrect event eligibility. |
| D-28 | Competition/registration lifecycle | Organizer assignment, competition/category publication, team/player registration, eligibility, roster lock, withdrawal, cancellation, fees coupling and appeal states. | Duplicate or unauthorized entries and unclear source of truth. |
| D-29 | Match/result authority | Who may schedule, record, confirm, dispute, correct or void a match/result; role of referee, commissioner and organizer; version history. | Untrusted match facts propagated to journey/analytics. |
| D-30 | Journey event contract | Which domain events are authoritative sources versus derived timeline summaries; ordering, unavailable source handling, verification labels, correction and visibility. | Duplicated facts or fabricated historical provenance. |
| D-31 | Organization-to-governance association | Whether organizations can join multiple associations/regions and how mandates are explicitly delegated without inherited data access. | Cross-region data exposure and ambiguous oversight. |
| D-32 | Audit operations | Required audit event coverage, access to logs, tamper evidence, retention, support break-glass and user-visible access history. | Insufficient incident investigation or overbroad audit access. |
| D-33 | Person–Player Relationship and Identity Resolution | Whether a person becomes a player by explicit player-profile creation or another policy, how person-player cardinality is modeled, when identity verification occurs, and how merge/split/correction decisions preserve historical references and an auditable resolution trail. | Conflicting person/player identities, duplicate records, broken historical references, and unverifiable corrections. |
| D-34 | Event, Competition, and Tournament Boundary | Distinguish event, competition, and tournament as distinct conceptual domains without requiring separate physical entities; define their ownership boundaries, schedule context, and relation to participations and registrations while the lifecycle remains a conceptual proposal only. | Ambiguous event semantics, incorrect grouping, and inconsistent access or reporting boundaries. |
| D-35 | Season Ownership and Lifecycle | Who owns season definitions, how seasons are created/closed, how they relate to teams, competitions, registrations, and rosters, and what constitutes valid season state and rollover across periods. | Broken roster windows, stale access, and incorrect competition or team eligibility. |
| D-36 | Competition Eligibility and Roster Rules | Define how eligibility is determined, how roster composition is approved, how competition registration differs from team roster and match participation, and how eligibility windows are enforced and audited. | Ineligible player participation, roster disputes, and invalid competition outcomes. |

## Phase 0 decision audit

- DECISION-001/002/003 remain `APPROVED` only within their stated scope.
- ADR-09–12 and other accepted ADRs remain unchanged.
- Existing P-01–P-23 remain `PENDING`; owner-reported Supabase availability updates evidence, not approval status.
- D-24–D-36 are additional pending domain decisions surfaced for owner/domain review; this document does not silently add approvals or alter the master Phase 0 register.
- No item here authorizes a database schema, migration, Supabase integration, Phase 1 coding, or use of real child data.
