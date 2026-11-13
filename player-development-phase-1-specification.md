# Player Development Phase 1 Specification

## Status

Architecture and product specification only. Phase 1 has not been implemented or authorized to begin. This document depends on accepted ADR-09 through ADR-12 in [player-development-architecture-decisions.md](player-development-architecture-decisions.md).

## 1. Objectives

- Preserve one global player identity independent of organization ownership.
- Represent current and historical organization/team affiliations without destructive replacement.
- Make an optional player-selected primary organization/team context explicit and non-authoritative.
- Provide a repository-backed player identity and journey read path using existing routes and UI.
- Keep journey entries connected to source-domain provenance where that provenance exists.
- Preserve current shell, route structure, visual language, and live behavior.

## 2. Business requirements

1. A Football ID identifies a player globally and survives any team or organization change.
2. A player may have zero, one, or multiple active organization/team affiliations.
3. Affiliation records carry their own status and effective dates. Ending one does not erase it or terminate another affiliation.
4. A primary organization context is an optional presentation preference selected only from the player's active affiliations. It is not ownership, a membership assertion, or permission to access data.
5. A primary team context, if selected, must be active and belong to the selected primary organization context.
6. If the selected affiliation ends, clear the preference; do not silently promote another affiliation.
7. A new affiliation does not grant access to historical records from other organizations.
8. The player journey aggregates and references source-domain facts; it does not become an owner of match, training, assessment, membership, or organization records.
9. Preserve existing player/profile and journey presentation. Do not create a second player directory or parallel player dashboard.
10. Missing source provenance must remain visibly unknown/unverified; do not fabricate a verifier or source reference.

## 3. Technical requirements

### Existing architecture

Retain the current pattern:

Page/Route → Feature Hook → Repository → Mock/API

- Routes stay thin and continue to own loader, URL state, not-found, and route composition.
- Feature hooks apply view mapping and role/scope presentation checks.
- Repository functions own fixture/API reads and domain selection.
- Domain types define contracts; UI does not import fixture arrays.
- TanStack Router remains the URL state owner; React Context remains the active workspace-role selector.

### Compatibility requirements

- Current `Player.orgId` and `Player.teamId` are singular prototype fields. They may be used as a temporary compatibility projection in current fixtures/views, but must not be treated as the authoritative multi-affiliation model.
- Existing `getPlayer`, `getPlayerByFootballId`, `getJourney`, `getMemberships`, and `listCurrentGuardianChildren` are reuse points, not proof of complete identity, consent, or authorization behavior.
- No new route is required for Phase 1. Preserve `/players/$playerId` with its existing `view` search tabs and `/children/$playerId` with its existing `view=journey` tab.
- Any route-tree file is generated and must not be edited manually.

## 4. Data ownership

| Data | Authority | Phase 1 behavior |
| --- | --- | --- |
| Global player identity / Football ID | Player Identity & Profile | Read and display through repository contract |
| Organization/team affiliation facts | Affiliation relationship, stewarded by relevant organization/team source | Read active and historical records; no transfer workflow |
| Primary context preference | Player Identity preference | Read and optionally update only within active affiliations; never used as permission |
| Journey entries | Journey domain aggregation | Read chronological references and preserve provenance |
| Source records referenced by journey | Their respective source domains | Read only; Phase 1 creates or mutates none |
| Guardian relationship | Verified relationship source | Reuse current linked-child fixture only as prototype scope |
| Guardian access grant | Consent/access domain | No lifecycle implementation in Phase 1 |

## 5. Entity relationships

Conceptual contracts only; no database schema or migration is specified here.

- `PlayerIdentity 1 → many PlayerAffiliation`
- `Organization 1 → many PlayerAffiliation`
- `Team 0..1 → many PlayerAffiliation`; a team affiliation must reference an organization-consistent team.
- `PlayerIdentity 0..1 → PrimaryContextPreference`, pointing only to active affiliation IDs.
- `PlayerIdentity 1 → many JourneyEntry`
- `JourneyEntry 0..1 → SourceRecordReference`, containing source domain, source record ID, and source organization where applicable.
- `GuardianIdentity many ↔ many PlayerIdentity` through verified `GuardianRelationship`; access grants are separate and are outside Phase 1 implementation.

Minimum conceptual fields:

### PlayerAffiliation
`id`, `playerId`, `organizationId`, optional `teamId`, `role`, `status`, `effectiveFrom`, optional `effectiveTo`, `recordedBy`, `sourceOrganizationId`, optional `endReason`.

### PrimaryContextPreference
`playerId`, optional `primaryOrganizationAffiliationId`, optional `primaryTeamAffiliationId`, `selectedBy`, `updatedAt`.

### JourneyEntry / SourceRecordReference
Preserve existing journey identifiers and display fields. Add optional `sourceDomain`, `sourceRecordId`, `sourceOrganizationId`, `verificationStatus`, and `recordedAt` only when authoritative source metadata exists. Absence of these fields must not be interpreted as verified.

## 6. Repository contracts

The following are proposed contract names for implementation, not existing methods. Keep them in `src/data/repository.ts` or its established local organization if repository code is later split with approval.

### Identity and affiliations

- `getPlayerIdentity(playerId)` → player identity or `undefined`; no organization-owned duplicate.
- `getPlayerByFootballId(footballId)` → identity or `undefined`; normalize input as current selector does.
- `listPlayerAffiliations(playerId, { status?, includeHistorical? })` → dated affiliations ordered by effective dates, including concurrent records.
- `getPrimaryPlayerContext(playerId)` → optional primary preference plus resolved active organization/team display context.
- `setPrimaryPlayerContext(playerId, affiliationIds | unset, actorContext)` → validated result; only player or authorized guardian may change it, and only to active affiliations. This preference must never alter affiliation status or grant access.

### Journey

- `listPlayerJourney(playerId, { from?, to?, sourceDomain? })` → chronological journey entries.
- Each item includes source attribution when known and retains legacy entries when not known.
- Journey selectors read source records or existing journey facts; they do not mutate source records.

### Scoped access selectors

- `getPlayerIdentityForActor(playerId, actorContext)` → permitted profile projection or explicit denied/not-found result.
- `listPlayerJourneyForActor(playerId, actorContext)` → permitted timeline projection.
- For the current mock prototype, actor context can follow existing role and coach/guardian scope helpers. It must be documented as UI-level restriction only; a future API must independently authorize these reads.

### Result semantics

Repository functions should distinguish not-found, forbidden, and valid-empty data where current repository patterns allow. Do not turn an access failure into an empty journey that appears to be a player with no history.

## 7. Screen specifications

### Player identity and development overview

- Route: existing `/players/$playerId?view=overview` (and current player role profile view)
- Primary role: Player; scoped projections for coach and organization roles
- Reuse: `PlayerHeader`, `PlayerOverviewTab`, `RelationshipSection`, existing design-system components
- Data: Football ID, identity/profile fields already modeled, selected primary context if set, active affiliation summary, verification state
- Actions: navigate to journey and affiliation history; player may select/clear primary context from their active affiliations
- States: existing loader/not-found; add explicit forbidden and no-affiliation states; do not imply identity is absent because no affiliation exists
- Restrictions: primary context is informational and does not widen access

### Player Journey

- Route: existing `/players/$playerId?view=journey`
- Primary role: Player
- Reuse: `PlayerJourneyTab` and `JourneyTimeline`
- Data: chronologically ordered identity/affiliation and existing journey events; source/verifier labels only when known
- Actions: inspect timeline event and its source context where permitted
- States: loading skeleton for future async repository; empty timeline distinct from no access; unavailable source record does not erase timeline entry
- Restrictions: source-linked details use their own domain permissions

### Guardian child journey

- Route: existing `/children/$playerId?view=journey`
- Primary role: Parent / Guardian
- Reuse: existing `ChildProfile`, `ChildSelector`, `ConsentPanel`, and player journey components
- Data: only the child currently returned by the linked guardian repository selector; Phase 1 does not broaden guardian permissions
- Actions: inspect permitted journey and open existing privacy/consent view
- Restrictions: current guardian fixture link is a prototype gate, not verified legal relationship or production consent enforcement

### Affiliation history

- Route: existing player profile/overview, no new route
- Layout: current affiliation context followed by dated historical affiliations; simultaneous active affiliations are all shown and labelled
- Actions: select a primary context only from active affiliations; clearing selection is supported
- Restrictions: selecting an affiliation does not expose that organization’s private records

## 8. User interactions

1. Player opens their existing profile; repository resolves the single global identity.
2. Profile shows the current primary context if valid, otherwise a neutral “choose context”/unset state; identity remains available without an affiliation.
3. Player opens affiliation history and sees all active and ended relationships in date order.
4. Player selects an active organization context, optionally with an active team in that organization. The repository validates the references and records the preference only.
5. Player opens journey and reviews existing events. Each event displays provenance only if supplied by its source; old entries remain readable if they have no source-record ID.
6. A guardian opens the existing linked-child route. The current mock child-list restriction remains; no new data categories are exposed.
7. When an affiliation ends in future workflows, its historical row remains and the invalid primary preference is cleared; Phase 1 does not implement transfer or termination workflows.

## 9. Permission rules

- Player: may read own identity, active/historical affiliations, and own journey; may set own primary presentation context.
- Guardian: may access only the linked child projections that existing mock selectors permit. Relationship verification, granular consent, adult transition, and backend enforcement remain outside Phase 1.
- Coach: may access only assigned-team player projections under existing coach scope helpers. Primary context does not grant access.
- Organization Admin: may access their organization-scoped player/affiliation context only; historical records from other organizations are not exposed by a new affiliation.
- Association: no general player journey access is implied by its membership/governance role.
- Scout: no Phase 1 access or scouting view.
- All roles: current role-switching and client-side access checks are not security boundaries. Future API authorization must independently evaluate identity + role + scope + context + permission.

## 10. Integration requirements

- Keep `src/config/modules.ts` unchanged; no Coming Soon module activation.
- Reuse `src/config/roles.ts`, current player/guardian routes, player feature tabs, and design-system components.
- Extend repository and domain types only after Phase 1 is approved; no component reads from `mock.ts` directly.
- Do not change membership ownership, Digital KTA, competitions, match facts, organization records, or schedule behavior.
- No assessment records/workflow, training module, attendance module, cross-organization grant, export, scouting, analytics, or AI integration in Phase 1.
- No migration, backend endpoint, external service, or new technology is included. API shapes remain future contracts.

## 11. Testing scenarios

### Repository/domain tests
- Football ID lookup resolves one global identity independent of organization.
- Multiple simultaneous affiliations are returned without collapsing them.
- Historical affiliations remain after active status changes in test data.
- Primary context accepts only active affiliation IDs and team/org-consistent pairs.
- Ending the selected affiliation clears the preference without promoting another.
- Journey ordering is stable and legacy entries without source references remain present and are not represented as verified.
- Missing identity, forbidden access, and valid empty journey are distinct outcomes.

### Route/component tests
- Existing player profile and journey routes render without route duplication.
- Player can see identity without any active organization affiliation.
- Guardian can see only fixture-linked child data; unrelated player IDs remain unavailable.
- Coach sees only assigned-team profiles according to existing helper behavior.
- Primary-context selection does not change data visibility.
- Empty, loading, not-found, and permission states are accessible and distinct.

### Regression/build
- Existing member, competition, player, child, route, and repository tests remain passing.
- Production build remains successful.
- No route tree is manually modified.

## 12. Acceptance criteria

1. One global player identity exists independently of organization context.
2. Multiple active and historical affiliations can be represented and displayed without loss.
3. Primary organization/team is optional, player-preferred, constrained to active affiliations, and never an access grant.
4. Ending an affiliation cannot delete history or silently choose another primary context.
5. Journey is a chronological view that references source data and does not take ownership of it.
6. Missing provenance is not fabricated or mislabeled as verified.
7. Guardian and coach views remain within existing scoped behavior; no sensitive or historical cross-org data is exposed by default.
8. Existing routes, shell, membership flow, and Coming Soon states remain intact.
9. Repository contracts mediate all new feature data access.
10. No database or production authorization claims are made by mock/UI implementation.

## 13. Definition of Done

- The approved scope has been implemented only after a separate Phase 1 start approval.
- Repository contracts and domain types are documented and tested.
- Existing profile, journey, child, and team experiences are reused rather than duplicated.
- Role-scoped views and primary-context invariants have focused tests.
- Existing regression suites and build pass.
- No future module is activated and no out-of-scope domain workflow is partially implemented.
- Any mock-level access behavior is clearly identified as non-production authorization.
- The user receives a concise account of files changed, tests run, unresolved backend/security policy dependencies, and any deviation from this specification.
