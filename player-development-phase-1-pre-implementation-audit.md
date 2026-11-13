# Player Development Phase 1 Pre-Implementation Audit

Audit date: 2026-11-13
Status: Documentation-only audit; Phase 1 implementation has not started.

## 1. Executive summary

The approved architecture and Phase 1 specification are coherent with the product principle, “The player owns the journey.” The codebase already has a global-looking `Player`/Football ID fixture, profile and journey views, organization/team selectors, mock-backed guardian child scoping, and a single repository boundary. It does not yet implement the specified global identity ownership contract, normalized affiliation history, primary context preference, source-referenced journey aggregation, or production authorization.

The full existing test suite passed: 25 files, 57 tests. The worktree is substantially dirty and contains broad in-progress changes that overlap Phase 1 touch points. There are no staged changes or unmerged index entries. The source-file worktree state matches the source changes listed in the previous architecture-closure status snapshot, so those source changes predate that documentation task. Exact uncommitted hunk ownership cannot be proven from Git because these files have not been committed or otherwise snapshotted. Preserve all of it.

**Recommendation: READY WITH CONDITIONS.** Phase 1 may begin only after explicit implementation authorization and after the current in-progress worktree baseline is acknowledged and protected. Keep Phase 1 mock/UI behavior explicitly non-production; backend authorization and jurisdiction-specific privacy policy remain separate prerequisites for production data access.

## 2. Git worktree safety findings

### Captured Git state

- Branch and HEAD: `main` at `f8e834d` (`Add project README`), tracking `origin/main` at the captured time.
- `git status --short`: 37 tracked source files modified; numerous untracked documentation and source files.
- `git diff --stat`: 37 files changed, 2,701 insertions and 887 deletions.
- `git diff --name-only`: the same 37 tracked source files listed below.
- `git diff --cached --stat`: no output; no staged changes.
- `git ls-files -u`: no output; no unmerged index entries.
- `git diff --check`: no whitespace errors. Git reported LF-to-CRLF conversion warnings on several tracked files.
- `git log -5 --oneline`:
  - At audit start: `f8e834d Add project README` was HEAD and matched `origin/main`.
  - `8200af6 Fixed strict type errors`
  - `825c02b Changes`
  - `e93ab24 Fixed build errors & reviewed`
  - `94685f3 Changes`

### Modified tracked source files

`src/components/ds/data-table.tsx`, `src/components/ds/journey-timeline.tsx`, `src/components/ds/states.tsx`, `src/components/shell/app-shell.tsx`, `src/components/shell/global-search.tsx`, `src/components/shell/notification-center.tsx`, `src/components/shell/profile-menu.tsx`, `src/config/modules.ts`, `src/config/roles.ts`, `src/data/mock.ts`, `src/data/repository.ts`, `src/data/types.ts`, `src/features/overview/coach-overview.tsx`, `src/features/overview/parent-overview.tsx`, `src/features/overview/player-overview.tsx`, `src/features/players/player-header.tsx`, `src/features/players/player-tabs.tsx`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/routes/children.$playerId.tsx`, `src/routes/children.index.tsx`, `src/routes/competitions.$competitionId.tsx`, `src/routes/competitions.index.tsx`, `src/routes/football-id.tsx`, `src/routes/index.tsx`, `src/routes/matches.$matchId.tsx`, `src/routes/matches.index.tsx`, `src/routes/notifications.tsx`, `src/routes/organizations.$orgId.tsx`, `src/routes/organizations.index.tsx`, `src/routes/players.$playerId.tsx`, `src/routes/players.index.tsx`, `src/routes/schedule.tsx`, `src/routes/teams.$teamId.tsx`, `src/routes/teams.index.tsx`, `src/styles.css`, and `src/test/app-routing.test.tsx`.

### Untracked files and change provenance

The worktree also contains untracked project files, including `package-lock.json`; existing architecture/product documents; new routes and feature folders for identity, children, check-in, public competitions, organizations, competitions, members, and overview; and tests for those features. These are existing work, not disposable build artifacts by assumption. In particular, untracked repository/access tests and player/team features may be affected by Phase 1 integration.

The previous architecture-closure task’s captured status already listed the current modified tracked source paths. Its edits were documentation-only: `architecture.md`, the Player Development decision/specification documents and their related planning documents. The audit’s own operations have also been read-only so far. The new audit document is the only file this audit will create.

Git can establish that source paths are currently unstaged and uncommitted, but it cannot attribute individual uncommitted hunks to an author or task. The prior status snapshot establishes that the listed tracked source changes existed before architecture closure; exact hunk-level timing is unavailable. No reset, revert, checkout, clean, stash, commit, or overwrite operation was run.

### Concurrent repository state change during this audit

The initial status and diff above were captured while HEAD was `f8e834d`. A later final status unexpectedly showed the prior changes gone from the worktree and HEAD advanced. Read-only inspection confirmed `HEAD@{0}` is a commit, `63f707c feat: add coach dashboard model and workspace for managing teams and players`, and `HEAD@{1}` is the clone at `f8e834d`. The new commit contains 135 files, including the previously untracked architecture documents and the modified/untracked source changes described above (26,188 insertions, 887 deletions). Its message names a coach workspace, but its file summary shows it bundled the broader existing work. Git/reflog does not identify who initiated it; this audit did not issue a commit command.

At audit completion, `git status --short --untracked-files=all` showed only `?? player-development-phase-1-pre-implementation-audit.md`; `git diff --stat` was empty. Treat `63f707c` as a concurrent commit observed during the audit, not as an action or endorsement by this audit. Do not amend, reset, or otherwise rewrite it. The audit document remains untracked and is the only outstanding worktree file from this audit.

### Conflict and overlap assessment

There are no Git merge-conflict index entries. There is significant **scope overlap**, not a proven textual conflict: Phase 1 is expected to touch `src/data/types.ts`, `src/data/mock.ts`, `src/data/repository.ts`, `src/features/players/player-tabs.tsx`, and the existing player/child routes, all of which are already modified. The generated `src/routeTree.gen.ts` is also modified and must not be hand-edited. Future implementation must integrate against current contents and preserve the existing changes; do not replace these files wholesale.

## 3. Existing implementation inventory

| Area | Verified existing implementation | Evidence / limitation |
| --- | --- | --- |
| Player domain | `Player` includes `id`, `footballId`, profile fields, optional singular `orgId` and `teamId`, a membership status, and guardian ID strings. | [src/data/types.ts](src/data/types.ts). No independent account-to-player identity mapping or normalized affiliation type is present. |
| Football ID | `getPlayer` and `getPlayerByFootballId` search fixture players; `/football-id` renders a passport, journey, membership summaries, and an ID lookup. | [src/data/repository.ts](src/data/repository.ts), [src/routes/football-id.tsx](src/routes/football-id.tsx). The route hardcodes `p-123` for non-parent roles and reads guardian fixtures directly. `IdentityOnboarding` creates a local preview only; it does not persist an identity. |
| Player repository | One synchronous repository module exports player, team, organization, competition, match, schedule, guardian, and journey selectors. `assignPlayerToTeam` and `removePlayerFromTeam` update an in-memory `playerUpdates` map. | [src/data/repository.ts](src/data/repository.ts). It is not a set of separate player/organization/team repository interfaces and has no API adapter or explicit result/error contract. |
| Organization repository | `getOrganization` and `listOrganizations` select fixture records. | [src/data/repository.ts](src/data/repository.ts). No organization-owned affiliation history repository or access service exists. |
| Team repository | `getTeam` and `listTeams` select fixtures; team assignment helpers mutate the player’s current `teamId`. | [src/data/repository.ts](src/data/repository.ts). Team assignment history is not retained by those mutations. |
| Existing affiliation representation | `Membership` contains `orgId`, role, start/end values, status, and team-name strings. `memberships` fixtures include one current and one completed organization for `p-123`; other players fall back to a summary from singular current player fields. | [src/data/types.ts](src/data/types.ts), [src/data/mock.ts](src/data/mock.ts), `getMemberships` in repository. There is no stable affiliation ID, team ID history, simultaneous affiliation fixture coverage, or canonical relationship lifecycle. |
| Player profile route | `/players/$playerId` loads `getPlayer`, validates a `view` tab, renders profile/journey/team/match/development/achievement/document views, and has coach/player presentation checks. | [src/routes/players.$playerId.tsx](src/routes/players.$playerId.tsx). The player identity check is hardcoded to `p-123`; checks run in UI after loader data is resolved. This is not server authorization. |
| Child route | `/children/$playerId` loads from `listCurrentGuardianChildren`, composes child profile, journey, schedule, and consent tabs. | [src/routes/children.$playerId.tsx](src/routes/children.$playerId.tsx). The route checks role in the component; the loader’s fixture selector is not a production access boundary. |
| Journey | `JourneyEvent` has display fields, date, optional organization and `verifiedBy`. `getJourney` returns hardcoded journey fixtures when present; otherwise it synthesizes identity and current-join events from current player fields. | [src/data/types.ts](src/data/types.ts), [src/data/mock.ts](src/data/mock.ts), `getJourney` in repository. No source record ID/domain or explicit verification status is modeled; synthetic current-state events are not an event-sourced history. |
| Role/access | `useRole` stores a workspace role in local storage. Coach helpers filter current assigned teams and players; guardian selectors intersect guardian child IDs with player guardian IDs. | [src/lib/role-context.tsx](src/lib/role-context.tsx), [src/lib/coach-access.ts](src/lib/coach-access.ts), [src/data/repository.ts](src/data/repository.ts). These are UI/mock restrictions only; there is no backend authorization. |
| Guardian consent UI | `ConsentPanel` initializes local switches from component constants and reports changes with toasts; it displays static data-sharing examples. | [src/features/children/consent-panel.tsx](src/features/children/consent-panel.tsx). Changes do not persist or represent verified relationships, scoped grants, revocation audit, expiry, or adult transition. |
| Navigation and screens | Existing `/players/$playerId`, `/children/$playerId`, `/football-id`, `/identity`, player tabs, and shared journey timeline can be reused. | [architecture.md](architecture.md), [src/features/players/player-tabs.tsx](src/features/players/player-tabs.tsx). No new Phase 1 route or Coming Soon activation is required. |

## 4. Phase 1 gap matrix

| Requirement | Existing implementation | Missing work | Files affected |
| --- | --- | --- | --- |
| Global player identity independent of organization | Fixture `Player.id` and `footballId`; lookup by Football ID. | Define identity ownership and lookup contract independent of affiliation; remove any use of current org/team as identity existence. Account linkage is not currently modeled and should not be invented in Phase 1 without a separate product decision. | `src/data/types.ts`, `src/data/repository.ts`, `src/data/mock.ts`, player/Football ID views |
| Multiple active and historical organization affiliations | `Membership` summary and historical fixtures for `p-123`; current `Player.orgId`/`teamId`. | Stable, dated affiliation records; support multiple active affiliations; keep membership status distinct from team assignment and preserve provenance. | `src/data/types.ts`, `src/data/mock.ts`, `src/data/repository.ts`, player profile tabs |
| Team membership history | Team assignment writes current `teamId`; removal clears it. Membership fixtures store team names, not dated team affiliation IDs. | Preserve team assignment history with effective dates and affiliation references; retain current roster behavior. | `src/data/repository.ts`, `src/data/types.ts`, `src/data/mock.ts`, team/player views |
| Primary organization/team preference | No primary-context field or selector. `orgId` and `teamId` are used as current context. | Optional player preference tied to active affiliation IDs; validate consistent organization/team pair; clear when ended, with no silent promotion; never use as permission. | `src/data/types.ts`, `src/data/repository.ts`, mock fixtures, player profile UI and tests |
| Journey aggregation and provenance | Hardcoded `journeys` map or synthesized identity/current-join events. | Stable chronological selector, source references where known, legacy entries retained without fabricated verification, and clear separation between source records and timeline projections. | `src/data/types.ts`, `src/data/mock.ts`, `src/data/repository.ts`, `src/components/ds/journey-timeline.tsx`, player/child views |
| Existing player/guardian screen reuse | Profile tabs, Football ID passport, child view, consent panel, and shared JourneyTimeline exist. | Add affiliation history and primary-context presentation to existing screens; distinguish no history from denied/not-found; do not duplicate directories/dashboards. | `src/features/players/player-tabs.tsx`, `src/routes/players.$playerId.tsx`, `src/routes/children.$playerId.tsx`, shared components |
| Scoped role views | Coach assignment helper and guardian fixture selector exist; player check hardcodes `p-123`. | Use a coherent actor-context contract for selectors; avoid hardcoded player identity; preserve UI scoping while clearly labeling it non-security. No Phase 1 production auth is present. | `src/lib/coach-access.ts`, `src/data/repository.ts`, player/child routes, relevant tests |
| Error/result semantics | `getPlayer` returns `undefined`; guardian selector returns `[]`; route not-found components exist. | Distinguish not-found, forbidden, and valid-empty journey in the proposed boundary; do not disguise denied access as empty data. | `src/data/repository.ts`, route loaders, state components, tests |
| Persistence/API abstraction | Synchronous mock-backed selectors; in-memory player update map; TanStack Query client exists but current features do not use query hooks. | No current backend adapter exists. Keep Phase 1 contracts synchronous/mock-compatible; do not claim persistence or introduce API/migration work. | `src/data/repository.ts`, `src/data/types.ts`; API/backend explicitly excluded |

## 5. Repository contract validation

### Identity ownership
`getPlayer` and `getPlayerByFootballId` are viable lookup starting points, but the current `Player` combines identity with current organization/team convenience fields. Keep the existing public selectors compatible where possible; define the player identity projection separately from affiliation context. Avoid redundant `getPlayerIdentity` if it is only a renamed alias without a clear actor projection.

### Affiliation history
`getMemberships` is not sufficient as the final affiliation contract: `Membership` lacks stable affiliation IDs, team relationship IDs/effective dates, recording actor, and explicit source organization. A Phase 1 model must distinguish organization membership from team assignment and preserve concurrent as well as ended relationships. The repository is a single module, so add selectors there rather than inventing separate repository packages.

### Primary context
No current source supports this preference. If implemented later in mock scope, store it separately from organization affiliation and player identity. A selection must validate active affiliation IDs and team/organization consistency. It must not be an authorization input.

### Journey aggregation
`getJourney` currently returns prebuilt fixtures without querying source records; fallback events are synthesized from current player state. Proposed `listPlayerJourney` must not label this behavior as a source-backed aggregate until source reference contracts exist. During Phase 1, use existing fixture facts as legacy timeline entries, preserve their display, and only attach provenance when verified source IDs are available.

### Mock/API abstraction and consistency
The current repository imports arrays from `mock.ts` and exposes synchronous reads plus in-memory mutations. There is no HTTP or database adapter. Keep new contracts in the existing repository; avoid new technologies or async/query rewrites. The fixtures can demonstrate multiple/historical affiliations, but tests must not imply persistence across reloads or backend authorization.

### Error and authorization boundaries
Current repository functions often collapse missing and forbidden into `undefined`/empty arrays. The Phase 1 specification’s not-found/forbidden/empty distinction is a valid contract improvement but must be applied consistently at the UI boundary. Coach and guardian helpers are view restrictions only. Future server/API authorization must independently evaluate identity, role, scope, context, consent, and permission.

## 6. Testing baseline

### Existing relevant tests

- [src/data/repository.test.ts](src/data/repository.test.ts): three tests for linked guardian children and unknown guardian behavior.
- [src/lib/coach-access.test.ts](src/lib/coach-access.test.ts): assigned-team scoping for players, teams, matches, competitions, notifications, and role navigation.
- [src/features/players/player-directory-model.test.ts](src/features/players/player-directory-model.test.ts): player-directory filtering, not profile identity or journey behavior.
- [src/test/app-routing.test.tsx](src/test/app-routing.test.tsx): route registration checks; it does not run player/child loaders or render their screens.
- Child workspace tests cover parent overview snapshot selection, not consent persistence or child authorization.

### Fresh baseline run

`npx vitest run` completed successfully: **25 test files passed, 57 tests passed**. No test files were edited. `git status --short` was unchanged afterward.

### Missing Phase 1 tests

- Football ID resolves the same global identity regardless of affiliation context.
- Zero, one, multiple active, and historical affiliations preserve date/status semantics.
- Current team membership history is not lost when current roster assignment changes.
- Primary-context selection rejects ended/foreign affiliations and mismatched organization/team pairs; clearing/ending never silently selects another context.
- Journey ordering, legacy fixture retention, provenance display, and unverified/unknown provenance behavior.
- Player-without-affiliation identity view.
- Player, guardian, and coach view projections remain scoped; primary context does not widen access.
- Missing identity, forbidden access, and valid empty journey produce distinct outcomes where supported.
- Existing player/child route composition and profile tabs remain regression-tested.

### Regression and integration requirements

- Preserve existing route tree and test registration; do not hand-edit `src/routeTree.gen.ts`.
- Run focused repository/domain tests, relevant component/route tests, full Vitest suite, and `npm run build` after implementation. Build was not run during this audit because it writes generated output and the request limited checks to safe, non-destructive operations.
- Add tests alongside the existing repository/access suites rather than replacing or reformatting current tests.

## 7. Risks and dependencies

1. **Dirty overlapping worktree:** current uncommitted changes affect the exact Phase 1 types, repository, mocks, player tabs, player route, and child route. Reconcile against current file contents and preserve all changes; do not reset or replace files wholesale.
2. **Identity/account mapping:** `CURRENT_USER` is a fixture user and the player workspace is hardcoded to `p-123`; no canonical account-to-player relationship is modeled. Phase 1 must not claim account identity linkage without a separate contract.
3. **Affiliation normalization:** current membership summaries and team assignment fields do not capture stable relationship identity or dated team history.
4. **Journey provenance:** fixture text includes `verifiedBy`, but there is no source record identifier/verification contract, and fallback events are derived from current state.
5. **Authorization:** role context and client-side helpers are not a security boundary. Do not expose confidential cross-organization records in a mock UI as evidence of production permission enforcement.
6. **Consent policies:** guardian verification, legal authority, age/assent thresholds, retention periods, and sensitive/safeguarding classifications remain deployment policy prerequisites for production authorization.
7. **Generated route tree:** `src/routeTree.gen.ts` is modified and generated; preserve it and do not manually edit it. Phase 1 has no new route requirement.
8. **Untracked lockfile and feature files:** `package-lock.json` and many untracked app files are user work; avoid package-manager operations that rewrite them during this phase.

## 8. Files expected to change during Phase 1

Expected production touch points, subject to the existing dirty worktree:

- `src/data/types.ts` — conceptual identity/affiliation/context and journey provenance contracts.
- `src/data/mock.ts` — fixture representation for valid active/historical affiliations and primary context, only if Phase 1 remains mock-backed.
- `src/data/repository.ts` — identity, affiliation, primary context, and journey selectors/validation.
- `src/features/players/player-tabs.tsx` — existing profile/journey/affiliation presentation reuse.
- `src/routes/players.$playerId.tsx` and `src/routes/children.$playerId.tsx` — only if thin route-level loading/access composition needs adjustment.
- Existing shared journey component only if provenance/empty-state display cannot be represented through its current props.
- Focused tests in `src/data/repository.test.ts` and new/reused player profile or journey tests.

No new route, module registry activation, backend endpoint, database migration, assessment/training/attendance workflow, cross-organization consent/export flow, or unrelated refactor is expected. `src/routeTree.gen.ts` should change only if generated by the established tool as an unavoidable consequence; the approved Phase 1 specification does not require that.

## 9. Recommended implementation sequence

1. Reconfirm the current worktree baseline and preserve all existing tracked and untracked work; agree how overlapping in-progress changes will be handled.
2. Add/clarify domain types for global identity, affiliation records, primary preference, and optional source references without breaking existing consumers.
3. Add repository selectors and invariant validation against current mock fixtures; distinguish membership from team affiliation and preserve legacy fixtures.
4. Add focused repository tests for affiliation combinations, primary context, identity lookup, journey ordering/provenance, and access outcomes.
5. Integrate the existing player profile and journey screens; preserve route shape and child view scope. Add no new modules or routes.
6. Add focused route/component regression tests for player, guardian, and coach projections.
7. Run focused tests, the full suite, and build after implementation; review the resulting diff against the protected baseline.

## 10. Final readiness recommendation

| Readiness area | Status | Rationale |
| --- | --- | --- |
| Architecture | READY | Approved ADRs and Phase 1 specification agree on global identity, source ownership, and no premature module activation. |
| Data model | READY WITH CONDITIONS | Conceptual model is sufficient, but current code lacks normalized affiliations and team history; implementation must preserve legacy contracts. |
| Repository | READY WITH CONDITIONS | Existing central repository is an appropriate integration point, but is synchronous/mock-only and has no distinct forbidden/error result contract. |
| UI | READY | Existing player, Football ID, child, journey, and design-system surfaces can be reused; no route or new module is needed. |
| Authorization | NOT READY FOR PRODUCTION | Current checks are client-side prototype restrictions; guardian consent lifecycle and cross-org grants are not enforced. Phase 1 must not claim otherwise. |
| Tests | READY WITH CONDITIONS | Existing suite passes, but Phase 1 domain and profile/journey behavior have no direct coverage yet. |
| Worktree safety | READY WITH CONDITIONS | The initial worktree contained broad uncommitted overlapping work; it was committed during the audit in `63f707c`. The commit bundled 135 files and its authorship is unknown. The audit report is now the sole untracked file. Do not rewrite the commit; review its full contents under normal project change review before Phase 1 edits. |

### Recommendation: B. READY WITH CONDITIONS

Phase 1 can begin after:

1. The user explicitly authorizes implementation, as required by the approved specification.
2. The 135-file commit `63f707c` is reviewed and accepted as the new baseline by the project owner; preserve its contents and update overlapping files incrementally, not by replacement.
3. Implementation remains mock-backed and UI-level unless backend authorization is separately approved and provided.
4. Production access to guardian or cross-organization data is not enabled until the outstanding legal/privacy policy inputs and server-side authorization boundary are resolved.

This audit does not begin implementation and does not claim that any Phase 1 feature is complete.
