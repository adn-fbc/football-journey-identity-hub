# Phase 0.7 — Domain Architecture

**Status:** Planning proposal only; not a schema, migration, API contract, or implementation authorization.
**Project:** `football-journey-identity-hub`
**Date:** 2026-11-14

## 1. Authority and evidence

The approved Phase 0 decisions and ADR-09–12 remain controlling. This document elaborates domain boundaries but does not resolve any `PENDING` item in [phase-0-decision-register.md](phase-0-decision-register.md). See [phase-0.7-unresolved-decisions.md](phase-0.7-unresolved-decisions.md) for the complete carry-forward list.

**Owner-reported current context:** the owner says the Supabase project `lvnkazaywtjrvsywabck` exists, is owned by the repository owner, is fresh with no application schema, and has Authentication, Storage, and Edge Functions configured. These statements are not independently verified in this planning task. A configured provider capability does not mean this repository invokes it: the checkout has no Supabase SDK, DB schema/migrations, generated DB types, Auth client, Storage client, or Edge Function invocation. The previous Phase 0.6 report is an earlier evidence snapshot; this newer owner report updates owner-reported context but does not convert it into independent dashboard evidence.

## 2. Domain principles

1. National Football ID belongs to one player identity and is independent of every organization, team, competition, and primary context. It is an identifier, not a password, authentication credential, access token, or login secret (DECISION-001, approved; D-24 remains `PENDING`).
2. Login/account identity and person/player identity are separate concepts. A person does not automatically become a player; person-player cardinality and identity resolution remain unresolved (D-33).
3. Organizations steward their own operational relationships and records; they do not own a player's persistent identity or complete history.
4. Organization and team participation is dated and historical. Concurrent affiliations are allowed by ADR-10 where valid; the physical distinction between `player_affiliations` and `team_members` remains `PENDING` (P-08/P-09).
5. Event, competition, and tournament are distinct conceptual meanings. They may share one physical representation, but their boundary, ownership, scheduling, registration, and lifecycle responsibilities remain conceptual and unresolved while D-34 is `PENDING`.
6. A primary organization/team context is an optional presentation preference; it grants no access and never silently promotes another context when one ends (ADR-10).
7. Season is a domain concept for validity windows and scheduling. Season ownership and lifecycle remain unresolved and are not implied by team or organization assignments (D-35).
8. A new affiliation does not grant historical access. Source domains remain authoritative, and Journey references provenance rather than copying source facts (ADR-12).
9. Guardian relationship verification and consent are separate. A verified guardian relationship does not establish unlimited authority; access is granted only by current, scoped, policy-dependent authorization and grantor authority (ADR-11).
10. Eligibility, team roster, competition registration, and actual match participation are distinct concepts and must not be treated as interchangeable; their rules remain unresolved (D-36).
11. Initial development/testing uses adult accounts for auth testing and synthetic player data only. Real child data, child-profile sharing, and child scouting are prohibited until approved safeguards are implemented, reviewed, and tested (DECISION-002).
12. Role switching and client-side checks are not authorization. Future protected reads/writes require server-derived actor, scope, context, permission, and database enforcement.
13. No microservices, event bus, or provider-specific schema is prescribed here. Keep a modular-monolith/domain boundary as a planning direction only; hosting/provider fit remains pending.

## 3. Bounded contexts and ownership

| Context | Owns (conceptually) | Does not own | Main dependencies |
|---|---|---|---|
| Account & Authentication | External auth subject mapping, account/session lifecycle, recovery and login identities. Provider owns credentials. | Person's football history, player affiliations, organization records. | Auth provider; Person Identity. |
| Person Identity & Roles | Durable person identity, identity-resolution lifecycle, role claims/labels, person-to-account links when verified. | Passwords, organization memberships, player domain facts beyond person identity. | Auth subject; verification workflow; policy. |
| Player Identity & Football ID | Player profile identity and stable National Football ID; identity corrections/verification under approved rules. | Organization ownership, roster operations, match/competition source records. | Person Identity; Organization/Team identifiers as references only. |
| Guardian Relationship & Consent | Guardian relationship claims/verification references, individual scoped consent grants and consent-event history. | Source-domain records being shared; provider credentials. | Person/Player Identity; source-domain classifications; audit. |
| Organization & Governance | Organization identity/type/status, hierarchy/mandates, organization member lifecycle and scoped roles. | Player identity and cross-organization player history. | Person Identity; policy/verification. |
| Team & Staff Assignment | Team/season/roster context and person-to-team staff assignments. | Organization membership or player identity as a duplicate source. | Organization; Person roles; Player affiliation contract (unresolved). |
| Player Affiliation | Historical relationship between a global player identity and an organization; source, effective dates and status. | National identity, team roster fact if team membership is modeled separately, historical source records of other domains. | Player Identity; Organization; Team under unresolved model. |
| Event / Competition / Tournament | Event, competition, and tournament are distinct conceptual meanings; they may share a common representation, but ownership, scheduling, registration, and lifecycle boundaries remain conceptual design and pending decisions (D-34). | Player identity ownership, organization membership, match facts not owned by its match context. | Organization, Team, Player Identity, season scope, competition registration rules, and event lifecycle. |
| Match & Participation | Match lifecycle, official result/events, match participants/lineups and their provenance. | Player identity, competition registration, development verdict. | Competition, Team, Player Identity, assigned officials. |
| Player Journey | Chronological player-facing projection/reference to authoritative source events with provenance and permitted visibility. | Authoritative ownership or mutation of affiliation, competition, match, training, attendance, assessment, finance, or safeguarding source facts. | All source domains; authorization and classification. |
| Development & Assessment | Competency framework, observations, assessments, goals, plans and review/version workflow per existing specifications. | Player identity or source match/training facts. | Player Identity, Team/Coach assignments, training/match evidence, consent/classification policy. |
| Audit & Platform Operations | Restricted security/admin events, authorization outcomes and support actions. | Routine business-data ownership or unaudited data access. | All contexts; retention and access policy. |
| Scouting / Analytics / AI | Consumer workflows and explicitly derived outputs. | Source player identity, affiliation, match or assessment truth. | Authorized projections, consent, data classification and audit. These remain unavailable for real child data under DECISION-002. |

## 4. Conceptual entity ownership and lifecycle

The lifecycle labels below are conceptual planning vocabulary, not approved state machines or physical schema. Unknown lifecycle transitions remain unresolved as listed in the decision document.

| Entity/concept | Authoritative owner | Conceptual lifecycle | Invariants / open points |
|---|---|---|---|
| Auth subject / login identity | Chosen authentication provider | Created → active → recovered/linked → disabled/revoked | Credentials remain provider-owned. Account/person cardinality, child access, identity linking and recovery are P-05/P-11. |
| Platform account | Account & Authentication | Pending → active → locked/disabled → closed (proposed) | Not a person or player. Exact mapping and merge behavior are P-05. |
| Person | Person Identity | Claimed/created → verified or unresolved → corrected/merged under review → retained/closed per policy | A person does not automatically become a player. Verification, duplicate resolution, retention and account mapping require decisions, including D-33. |
| Person role | Person Identity / role assignment authority | Proposed → active → suspended/ended | Person can hold multiple roles. Global role labels versus scoped grants is P-06; role alone never grants access. |
| Player | Player Identity & Football ID | Created → active → corrected/verified as applicable → retained under policy | One person/player identity must retain the same Football ID through organization, team, competition and transfer changes. DECISION-001 approved; identity resolution remains D-33. |
| National Football ID | Player Identity & Football ID | Issued → stable → retired only under an approved correction/exception policy | It is an identifier, not a credential. Never reused or reissued because of affiliation changes; issuance, collision, duplicate merge and exceptional correction process require owner/domain approval. |
| Event / Competition / Tournament | Conceptual event domain | Illustrative only: draft → defined → scheduled/open → active → completed/cancelled → archived | Distinct conceptual meanings; they may share a common representation. Ownership, schedule, registration, and lifecycle remain unresolved (D-34 PENDING). |
| Season | Undetermined | Not defined; remains PENDING | Season is a domain concept. Team and Competition may be related domain contexts, but no Team, Competition, or Organization is established as owner. Ownership, lifecycle, and relationships remain unresolved (D-35 PENDING). |
| Eligibility / Roster Rule | Competition & Team domain | Draft → evaluated → approved → active → closed/appealed | Eligibility, competition registration, team roster and match participation are distinct concepts and must each be governed separately (D-36). |
| Guardian | Person Identity | Person record plus claimed guardian capability | Guardian identity is not proof of legal authority. Guardian verification/evidence handling P-12. |
| Guardian relationship | Guardian Relationship domain | Claimed → verification pending → verified/rejected → ended/revoked | Relationship alone grants no data access. Multiple guardian conflict and authority rules P-13. |
| Consent grant | Consent domain | Requested → active → changed/versioned → revoked/expired/suspended | One grant per guardian/player/defined scope; revocation blocks future access. Exact categories/actions/purpose/recipient/time and adulthood rules P-14/P-15. |
| Organization | Organization & Governance | Proposed → verified/active → suspended/closed (proposed) | Organization types in PRD; hierarchy and authority inheritance P-07. Verification and lifecycle details need owner approval. |
| Organization membership | Organization & Governance | Invited/requested → active → suspended/ended | Scoped to one organization. Membership role must not create platform-wide authority. Role lifecycle/approval needs policy. |
| Team | Team domain | Draft → active by season → inactive/archived (proposed) | Belongs to an organization operationally. Season continuity and team ownership changes need domain rules. |
| Team staff assignment | Team & Staff Assignment | Proposed → active → ended/revoked | Coach/official scope requires exact current assignment; ending access does not erase authorship. Assignment approval/role taxonomy remains open. |
| Player affiliation | Player Affiliation domain | Pending → active → ended/corrected with history | Dated organization relationship; concurrency allowed where valid; ending one does not end another. Distinct from team roster at conceptual level, but physical model P-08/P-09. |
| Team membership / roster entry | Team domain or affiliation domain depending on P-08 | Proposed → active → ended/season-closed | Must refer to player and team context with org/date consistency if adopted as separate concept. Do not select physical table or constraints until P-08/P-09 approval. |
| Competition registration | Competition / Event domain | Requested → reviewed/accepted/rejected → withdrawn/cancelled (illustrative) | Must reference player identity and participating team/event context; never creates a new player identity. Eligibility, guardian authorization, roster, payment coupling and state transitions need approval. |
| Match / result | Match & Participation | Scheduled → in progress → submitted/confirmed → corrected/disputed/cancelled (illustrative) | Match domain owns official facts. Referee/organizer authority, result confirmation/correction, lineup and participation lifecycle need explicit rules. |
| Player participation | Match & Participation | Draft/lineup → confirmed participation → corrected with audit (illustrative) | References player and match/team; does not alter identity or competition registration. Data visibility is restricted, especially for children. |
| Journey entry | Player Journey projection | Derived/referenced → visible when authorized → source may become unavailable while provenance remains | Journey is not a source of truth. Preserve origin/version/status; do not fabricate provenance or verification. |
| Audit event | Audit & Platform Operations | Append-only event → retained/archived/deleted only under approved policy | Content minimization and retention policy P-18; audit records must not become a blanket access bypass. |

## 5. Relationship contract and the affiliation conflict

### Shared semantic facts already approved

- Player identity and National Football ID are independent of organizations.
- Organization and team participation have dates/status and preserve history.
- Multiple concurrent organization/team affiliations are allowed when valid.
- New affiliation does not expose prior organization history.
- Primary context is not authority or permission.

### Competing physical-model interpretations — P-08 remains `PENDING`

**Option A — One polymorphic affiliation relation.** A single conceptual/physical `PlayerAffiliation` carries an affiliation kind (`organization` or `team`) and may refer to a team and parent organization affiliation. This aligns with ADR-10 wording and `player-development-data-model.md`, where `PlayerAffiliation` may optionally contain `teamId`.

- Benefits: one historical relationship vocabulary; consistent timeline/provenance handling.
- Risks: kind-dependent nullable fields and constraints; organization membership and roster semantics may be conflated; cross-row temporal integrity is harder to express.

**Option B — Organization affiliation plus separate team roster membership.** `PlayerAffiliation` means the player's relationship to an organization; `TeamMembership`/PRD `team_members` means roster placement for a team/season.

- Benefits: clearer distinction between organization participation and team roster placement; aligns with PRD listing both `player_affiliations` and `team_members` and Phase 1 audit desire to distinguish them.
- Risks: duplication or inconsistent dates/status if the relationship between the two is not explicit; cross-table invariants and atomic transfer/roster operations are needed.

**No physical model is selected here.** The domain may speak separately about organization affiliation and team roster placement as business concepts while the owner/domain/database architect decides whether those concepts use one relation or two. P-09 separately remains `PENDING` on exact constraints/date containment. No migration or schema is authorized.

## 6. Dependency and data-flow map

1. Authenticated account subject is verified by the provider, then mapped to a platform person under an approved account-linking policy.
2. Person roles identify participation capabilities; scoped organization/team/event assignments provide operational context. Neither browser-selected role nor a client-supplied ID is authority.
3. Player Identity creates/maintains the stable player identity and National Football ID. Organization membership, team placement, event registration and match participation reference it; they do not mint another identity.
4. Organization/Team domains steward organizational and roster relationships. Affiliation/roster lifecycle mutations preserve effective dates and history.
5. Competition registration refers to player/team/event context. Match participation and results belong to match/event domains.
6. Player Journey projects or references authorized source facts. It cannot change source facts or grant access to them.
7. Guardian relationship and consent policy authorizes only approved projections; an active affiliation does not substitute for consent. Real-child processing is prohibited during initial development/testing by DECISION-002.
8. Scouting, analytics and AI consume authorized, classified outputs only; no source ownership. They are blocked from real child data until the explicit safeguards and release gates are approved and tested.

## 7. Risk and dependency summary

- **Identity duplication:** if organization/registration flows create their own player record, National Football ID continuity breaks. All operational domains must reference Player Identity, and person-player resolution remains D-33.
- **Affiliation ambiguity:** selecting one affiliation representation affects history, roster dates, transfer semantics, team staffing access and journey provenance. P-08/P-09 block physical schema design.
- **Event boundary ambiguity:** event, competition and tournament semantics can blur without clear ownership and lifecycle rules. D-34 remains open.
- **Season lifecycle ambiguity:** season ownership and rollover conditions affect rosters, schedules, registrations and eligibility windows. D-35 remains open.
- **Eligibility and roster ambiguity:** competition eligibility, registration, roster approval and match participation are separate decisions. D-36 remains open.
- **Auth/account ambiguity:** provider Auth is owner-reported as configured, but no repository integration is present. P-05/P-06 and secure account/person mapping block trusted actor derivation.
- **Tenant/role boundary:** org hierarchy, memberships, staff assignments and event scopes must be defined before RLS or server authorization design; P-06/P-07/P-21 remain open.
- **Guardian and child safety:** no real-child data during development/testing. Relationship verification, consent scope, multiple-guardian handling, age/assent, data classification and retention are dependencies for any later child access.
- **Source-of-truth duplication:** journey, analytics, scouting, and exports must reference sources and preserve provenance, not create authoritative copies.
- **Competition and result trust:** registration, roster eligibility, match-result authority, correction and referee/organizer scope need lifecycle decisions before operational writes.
- **Provider/runtime connection:** owner reports a fresh Supabase project with Auth/Storage/Edge Functions available, but the app has no integration. Deployment compatibility, project access evidence, database workflow and test environment remain pending.
- **Auditability/retention:** append-only history requirements intersect with retention/deletion policy; P-18 remains open, and journey provenance plus audit minimization must remain explicit.

## 8. Scope and approval notice

This is a conceptual domain architecture document only. It adds no tables, columns, SQL, migrations, RLS policy, server function, auth flow, storage configuration, or data. It does not update the status of P-01 through P-23, approve provider use, authorize Phase 1, or permit real child data.
