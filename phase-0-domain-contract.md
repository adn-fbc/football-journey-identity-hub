# Phase 0 Domain Contract

**Status:** Proposed canonical vocabulary for review. This document does not supersede accepted ADRs or authorize implementation. See [phase-0-decision-register.md](phase-0-decision-register.md) for all unresolved decisions. `OWNER_DECISION_REQUIRED` means the recommendation cannot be treated as approved.

## Approved decision overlays

### DECISION-001 — National Football Identity (`APPROVED`)

The National Football ID belongs to the player, not an organization. The same player retains the same ID across SSBs, clubs, academies, tournaments/competitions, transfers, affiliation changes, and future association/federation integrations. Membership, team assignment, registration, or transfer must never create a replacement player identity. Identity remains independent of current organization and primary context.

**Domain implications:** identity/Football ID is stable and player-owned; organization and team relationships are separate, dated affiliations; the journey references source facts and provenance rather than becoming an organization-owned history copy. A primary context remains a display preference and grants no access. Future data modeling must not make a current `organization_id` or `team_id` the identity owner. This does not resolve whether team participation is a separate `team_members` relation or a team-scoped affiliation; P-08 remains `PENDING`.

### DECISION-002 — Child Data Development Restriction (`APPROVED`)

During initial development/testing, use adult test accounts only for account/authentication tests and synthetic/dummy player data for profiles and football records. Real children's personal data is prohibited: do not import, collect, use, share child profiles, enable child scouting discovery, or expose real child data to scouts, clubs, academies, or other organizations.

This is a development restriction, not permission to implement a real child-data system and not a legal-compliance conclusion. Real child data remains blocked until every child-data release gate in [phase-0-readiness-checklist.md](phase-0-readiness-checklist.md) is designed, implemented, independently reviewed, and tested. No legal age threshold is inferred.

### DECISION-003 — Existing Backend Inspection (`APPROVED`)

Inspect the existing repository and Lovable/provider environment before provider selection. Repository inspection has found no configured Supabase integration/schema and only Lovable template metadata; that does not prove whether a remote Lovable-managed database or Supabase project exists. The owner must manually inspect Lovable and the provider dashboard for backend existence, owner access/control, auth/database/storage/deployment configuration, usability, and ability to meet security, privacy, tenant isolation, and child-safety requirements.

Inspection does not authorize creating, connecting, disconnecting, replacing, configuring, pushing configuration to, or migrating a provider. Provider selection remains P-01/P-02 `PENDING` until evidence is collected and the owner explicitly approves it.

## 1. Identity definitions

| Concept | Proposed canonical meaning | Invariants |
|---|---|---|
| Authentication identity | A credential/subject issued by an authentication provider. It proves control of an account session; it is not itself a person or a football identity. | Provider owns credential and recovery lifecycle. Never expose provider secrets. Validate claims on server requests. |
| Platform account | The platform's account principal linked to a verified auth subject and, when established, a person. | Recommendation: one account principal per person; multiple verified login identities may link to one account. Account sharing is forbidden. Cardinality is `OWNER_DECISION_REQUIRED` (P-05). |
| Person | A durable record for one human across football roles. It may exist without any login account. | Do not merge people solely by name, phone or DOB. Link/merge requires a reviewed, auditable identity-resolution workflow. |
| Player | A football profile for a person who participates as a player. | A person may have multiple roles, including player and guardian/coach. Player record and Football ID do not depend on organization membership. |
| Football ID | A stable, opaque player identifier for ecosystem references. | Not a login credential, not an authorization token, and not an org-owned ID. Avoid embedding birth year, sequential private metadata, or other PII. Public lookup returns only an approved projection. |
| Person role | A person's applicable capability/role label (e.g. player, guardian, coach, referee, scout). | Role label alone confers no authority. Scoped assignments separately define actual organization/team/event/governance access. Exact split is `OWNER_DECISION_REQUIRED` (P-06). |
| Guardian | A person with an independently verified relationship claim to a player and, separately, any active scoped consent grant. | “Parent” or “guardian” entered by a user is an unverified claim until an approved process validates it. Relationship alone grants no access. |
| Organization membership | A dated/status-bearing relationship between a person and one organization, with scoped organization roles. | `org_admin`, owner, and staff authority is scoped to the membership and the specific organization. No implicit global authority. |
| Player affiliation | A dated relationship between a player identity and an organization. | Organizations steward their own affiliation facts; they do not own player identity or entire journey. Multiple concurrent active affiliations are allowed by ADR-10. |
| Team membership | A dated roster relationship between a player and a team. | Proposed to reference a same-player, same-organization player affiliation and remain within its effective period. This table split requires approval (P-08/P-09). |
| Team staff assignment | A dated authorization context linking a person to a team and specific staff function. | Coach access requires current assignment. Ended assignment removes prospective access; authorship/provenance of prior records remains. |
| Primary context | Optional player-selected organization/team lens for navigation and summaries. | It is never ownership, membership proof, or a permission grant. It must reference active affiliations; ending it clears the preference, with no silent promotion. Confirmed by ADR-10. |

## 2. Cardinality and relationship rules

1. **One person, multiple roles:** supported by the PRD. Do not create a separate account per role. Scoped roles are stored/derived independently from general person-role labels.
2. **Person and accounts:** allow a person without an account. Recommended: one platform account per person, multiple verified provider login identities linked to that account; no shared accounts. Product/identity owner must approve this cardinality.
3. **Player and organizations:** one player identity may have zero or more affiliations; more than one can be active concurrently when valid. An organization affiliation is not a permanent owner field on `players`. Under DECISION-001, the National Football ID remains unchanged through every membership, team, competition, transfer, or governance integration.
4. **Organization and team:** each team belongs to one owning organization for operations. Governance/affiliation relationships between organizations are typed and do not automatically inherit privileges. Whether an organization can have multiple parent/governance relationships remains `OWNER_DECISION_REQUIRED` (P-07).
5. **Team membership:** proposed membership must reference a team in the same organization as the referenced player affiliation, for the same player; its active period must be within that affiliation’s period. Mutations validate this atomically. Exceptions require a documented business rule, not a bypass.
6. **Organization staff:** `organization_members` and scoped roles grant organization-level operations. `team_staff_assignments` narrows coach/referee/official scope further. A membership does not automatically grant access to every player history record.
7. **Governance roles:** association/federation assignments identify region and delegated governance action. Parent-child organization edges do not automatically grant data access.

## 3. Historical continuity and transfers

- A transfer does not create a new person, player, or Football ID.
- Keep ended affiliation and team-membership records with effective dates, actor/source provenance, and correction history according to approved retention policy.
- A transfer workflow should close/open applicable relationships in a single transaction after the owner-approved confirmation process. Do not mutate historical facts in place without an auditable correction/version.
- Ending one affiliation does not end another concurrent affiliation.
- New organization affiliation grants only current operational scope. It does not reveal prior organization records or grant a historical share.
- The Journey domain references source records and provenance. It does not copy/own authoritative match, training, attendance, membership, assessment, payment, or safeguarding facts.
- A receiving organization may author its own new records. It cannot change source organization authorship or verification.
- Data export is a provenance-bearing non-authoritative copy; recipient, purpose, categories, version and export time must be represented where sharing is approved.
- Retention, erasure, anonymization, legal hold and contested transfer processes are unresolved policy decisions (P-10, P-18).

## 4. Guardian and consent concepts

- A **guardian relationship claim** records the claimed relationship type and its verification lifecycle/evidence reference. It is not consent.
- A **verification decision** records verifier/method/status/time and restricted evidence reference. The verification method and evidence retention are `OWNER_DECISION_REQUIRED`; do not store more proof than needed.
- A **consent grant** is independent per guardian-player relationship and names subject, grantor, categories, actions, purpose, recipient/scope, effective period, status and version.
- A **consent event** is append-only lifecycle history: request, grant, change, revoke, expiry, suspension, or resume. It records actor and time without embedding unnecessary child data.
- Revocation/suspension blocks future access at the authorization boundary promptly. It does not erase source records or retract information already viewed/exported.
- Adult transition suspends guardian grants pending the player's explicit authorization per ADR-11; applicable age, assent and process rules remain unapproved and must not be inferred.
- Sensitive, legal, medical, safeguarding and confidential organization material is excluded by default. A guardian grant alone cannot bypass a stronger policy prohibition.
- Raw coach observations are provisionally private to the source organization and authorized staff. A reviewed/published feedback object may be separately shareable. Existing documents disagree on this; owner decision P-16 blocks development-data release until resolved.

## 5. Authorization contract

### Decision procedure

For every server read/write, derive and verify the actor from the request session, then evaluate:

`verified identity + active scoped assignment + resource relationship + requested action + classification + current consent/policy`

All relevant predicates must pass. Missing, stale, contradictory or unknown context is denied. Client parameters are selectors only, never proof:

- Client role cannot grant a role.
- Client organization ID cannot grant organization membership.
- Client player ID cannot grant player or guardian access.
- Client team/event IDs cannot grant assignment.
- Client consent flags cannot prove a current grant.

A route-level gate is UX only. Every server function and database path reauthorizes independently. Database RLS/policies complement service policy and must use ownership/tenant predicates; `authenticated` alone is not sufficient. Privileged service-role credentials must not be used for ordinary user traffic.

### Role matrix (proposed; owner approval required)

| Role | Scope / required assignment | Permitted reads | Permitted writes | Forbidden by default | Consent requirement | Audit |
|---|---|---|---|---|---|---|
| Player | Authenticated account linked to the same person/player. | Own identity, active/historical affiliations, journey and own domain records allowed by classification. | Own profile/preferences; own goals and authorized privacy choices. | Other players; edit official match/organization/assessment source facts; grant rights beyond own authority. | Not needed for own permitted data; required when sharing own restricted records with a recipient. | Profile/privacy changes, exports, grants, identity/account linking. |
| Guardian | Verified active relationship and current per-guardian grant for exact child/category/action. | Only granted child projections. | Issue/revoke own permitted grants; limited child actions explicitly authorized. | Unrelated players; evidence documents; sensitive/safeguarding data by default; another guardian's grant; own grant expansion by URL. | Required for every non-public child category covered by grant. | Relationship verification, each grant event, access to high-risk categories, export. |
| Coach | Active organization membership and current assignment to the exact team/session/player scope. | Operational roster, schedules, attendance and records allowed by classification. | Assigned team sessions/attendance; authored observations; submit assessment drafts. | Unassigned team/player; finance; verification of own assessment; private guardian/legal data; unrelated org history. | Required for categories whose policy demands player/guardian grant; assignment alone does not grant historical access. | Assignment changes, observations, assessments, attendance and exports. |
| Organization owner | Explicit active owner/delegated authority for one organization; ownership must be verified by organization governance policy. | Organization administration and necessary current operational records. | Manage organization profile, delegated staff/team/operational records in scope. | Platform-wide access, other orgs, unrestricted player history, guardian evidence, sensitive records absent policy. | Required for child record categories where policy requires it; org membership is not universal consent. | Owner transfer, role/assignment changes, bulk access/export, sensitive reads. |
| Organization administrator | Active org membership with explicit admin capability for that organization. | Current organization players/teams/operations according to classification. | Manage teams, memberships and organization records explicitly delegated. | Global role grants, other tenants, source records from former orgs, guardian/legal evidence by default. | Required where scoped child data policy requires. | Membership/roster mutations, bulk export, privileged access. |
| Event/competition organizer | Active organizer assignment to exact competition/event. | Competition, registered teams/rosters and match minimum necessary for operation. | Competition registration, schedule and authorized result workflow. | General player directory, historical development, guardian/legal details, unrelated competitions. | Required for optional/sensitive player fields beyond necessary event operations. | Registration approvals, roster changes, match/result changes and export. |
| Referee | Active assignment to exact match/competition and valid official role. | Match context, minimum roster and referee tools. | Match events/report within assigned workflow. | Unassigned match, guardian info, finance, private development, identity verification evidence. | Not a substitute for permitted match-data policy; no unrelated profile consent. | Match report and corrections; assignment and sensitive access. |
| Scout | Verified scout identity plus active recipient-specific share/consent for the player and purpose. | Minimal consented scouting projection only. | Scout-owned watchlist/opportunity notes, not source-player records. | Search/view non-consenting players; raw private observations; legal, contact, medical, safeguarding, finance data; edit source records. | Required before indexing, search result disclosure and detail access; recheck expiry/revocation. | Search/access, shortlist, contact request, export and consent denials. |
| Association administrator | Explicit active association membership, region, mandate and action scope. | Governance records and aggregates in authorized jurisdiction; named player data only by mandate. | Membership/governance review within assigned authority. | National/other-region data, child detail absent mandate, source-record edits outside governance ownership. | Required for child detail where policy requires; mandate is not a substitute for guardian grant. | All named-person access, decisions, bulk queries and exports. |
| Federation administrator | Explicit federation assignment and delegated national/regional function. | Aggregate/national reporting by default; drill-down only with named scope/mandate. | Federation-owned licensing/governance data in scope. | Unrestricted player browsing, guardian/legal/safeguarding records, edits to other source domains. | Required for child-level details where policy requires. | Drill-down, data extracts, administrative changes and sensitive reads. |
| Platform administrator | Dedicated, strongly controlled operational role; no routine business-data entitlement. | Minimum operational metadata needed to support service; audited break-glass only for data access. | Account/security recovery and platform configuration; no normal business record mutation. | Routine browsing of player/guardian records, consent bypass, silent impersonation, unaudited exports. | No blanket consent bypass; emergency access requires approved policy and rationale. | All elevation, break-glass, impersonation, account recovery and support access. |

## 6. Domain ownership

| Domain/data | Authoritative owner | Consumers and limits |
|---|---|---|
| Person/account link | Identity/account domain | Role-aware UI and account settings; no duplicate identity per role. |
| Player / Football ID | Player Identity & Profile | Journey and scoped profile views; organizations cannot own or reissue identity. |
| Guardian relationship and consent | Identity relationship / Consent domain | Source domains consume current authorization result; relationship alone is not a grant. |
| Organization/team and staff assignments | Organization / Team domains | Player context and operations; no automatic cross-org history. |
| Player affiliation | Affiliation relationship, stewarded by relevant organization | Journey references; ended history retained under policy. |
| Match/competition/training/attendance | Respective source domains | Player Journey/analytics read references; no consumer rewrites source facts. |
| Assessments/observations | Development domain with author/reviewer provenance | Player/guardian views only under resolved visibility policy. |
| Finance | Finance domain | Org admin and guardian views only; never leak into public player profile or coach views by default. |
| Audit/compliance | Restricted platform control plane | Authorized audit/compliance access; immutable event design subject to retention policy. |

## 7. Unresolved policy gates

Before a real child record is readable/writable, owners must approve: guardian verification method/evidence handling; multiple-guardian conflict and safeguarding escalation; category/action/recipient/purpose/expiry semantics; assent and age transition; raw observation visibility; sensitive-data classification; retention/deletion/legal hold; scout search and export behavior. No age or legal threshold is supplied or inferred by this contract.