# Application Architecture

This document records the current product structure and a staged module plan. The existing routes, shell, and visual design are treated as approved; module work should preserve them.

## Routes

TanStack Start file routes are the URL layer. They load data, validate search parameters, apply route-level not-found handling, and compose feature and shared components.

| Route | Purpose |
| --- | --- |
| `/` | Role-aware overview |
| `/children` | Guardian's linked children |
| `/children/$playerId` | Child profile, activity, and consent |
| `/competitions` | Competition directory |
| `/competitions/$competitionId` | Competition details, categories, teams, schedule, matches, results, and standings; selected view/category live in search state |
| `/football-id` | Football ID passport and identity view |
| `/identity` | Identity onboarding |
| `/matches` | Match directory |
| `/matches/$matchId` | Match detail |
| `/modules/$moduleId` | Coming-soon module placeholder |
| `/notifications` | Role-filtered notifications |
| `/organizations` | Organization directory |
| `/organizations/$orgId` | Organization workspace |
| `/players` | Player directory |
| `/players/$playerId` | Player profile and tabs |
| `/schedule` | Calendar and schedule |
| `/settings` | Account, role, and privacy settings |
| `/teams` | Team directory |
| `/teams/$teamId` | Team and roster workspace |

`src/routeTree.gen.ts` is generated from `src/routes/` and must not be edited manually.

## Components

- `src/components/shell/` owns the application shell, navigation, role switcher, global search, notifications, and profile menu.
- `src/features/overview/` contains role-specific overview compositions; `src/features/identity/`, `children/`, `players/`, `competitions/`, and `organizations/` contain domain-specific UI. The Players feature owns the directory presentation and pure filter model; its file route remains a thin entry point.
- `src/components/ds/` is the shared product design system: page headers/tabs, sections, state displays, tables, filters, cards, identity, match, schedule, and organization/player/club visuals.
- `src/components/ui/` contains low-level Radix/shadcn-style primitives. Feature code should prefer the design-system layer when an appropriate product component exists.
- `src/routes/` should remain thin: route metadata, URL state, loaders, authorization/not-found decisions, and composition. Business rules belong in data/domain code, not in presentation components.

## Shared UI

The root route wraps every page in `AppShell`, role and notification providers, the TanStack Query client, and the shared toaster. Feature pages reuse `PageHeader`/`Breadcrumbs`, `PageTabs`, `Section`, `EmptyState`/`PermissionState`, `StatusBadge`, `FilterChips`, and domain display components such as `PlayerHeader`, `MatchRow`, `ScheduleRow`, and `TeamCrest`. `DataTable` supplies responsive list/table modes and keyboard-operable navigable rows. Preserve these shared contracts while implementing modules.

## State Management

- TanStack Router owns route parameters, validated search state, loaders, and navigation. Organization and Competition detail selections use URL search state; several older profile tab sets still use local Radix tab state.
- React Context owns the active role (`RoleProvider`, persisted in local storage after hydration) and notification read state (`NotificationProvider`, currently in-memory).
- Local `useState` handles transient view state such as filters, selected categories, tabs, and prototype controls.
- TanStack Query is instantiated per router/request and provided at the root, but current feature data is synchronous and does not use query hooks yet.
- There is no shared application store. Keep new state local unless it is genuinely cross-feature or server-owned.

## Permission UX

The role switcher selects a workspace; it does not create an identity. Coach UI scope is derived from assigned team records through `src/lib/coach-access.ts` and reused by Coach-facing lists, detail gates, global search, and notifications. This is presentation-layer restriction only: it is not a substitute for authorization in a future API/backend. Sensitive access and consent decisions must be enforced at that boundary when it exists.

## API Boundaries

`src/data/types.ts` defines domain contracts. `src/data/mock.ts` is fixture storage. `src/data/repository.ts` is the intended data-access boundary and currently implements synchronous reads and a few in-memory mutations over those fixtures; route and feature code should depend on repository functions, not mock arrays.

There are no current HTTP, Supabase, or other backend calls in the route data path. Query integration and asynchronous repository contracts remain future work. Direct fixture imports remain in the shell profile menu, organization-admin overview, Football ID route, settings route, and team detail route; move them one module at a time behind repository contracts. Keep API credentials and persistence concerns outside browser UI when a backend is added.

## Module Dependencies

| Module | Routes | Feature layer | Current data dependency |
| --- | --- | --- | --- |
| Overview | `/` | Role-specific overview components | Repository plus some direct mock imports |
| Children | `/children`, `/children/$playerId` | Child cards/selector/consent; reuses player profile parts | Repository; direct guardian fixture access is removed in the first module slice |
| Identity | `/identity`, `/football-id` | Onboarding and role display | Repository plus some direct mock imports |
| Players | `/players`, `/players/$playerId` | `PlayerDirectory` and pure directory filter model; shared profile header, tabs, and team display | Repository |
| Competitions and matches | `/competitions`, `/competitions/$competitionId`, `/matches`, `/matches/$matchId` | Competition view model, category cards/selectors, match groups, standings table, shared match row/detail | Repository; view/category state in URL |
| Organizations | `/organizations`, `/organizations/$orgId` | Organization context with dashboard, players, teams, training, attendance, competitions, finance overview, and staff views | Repository selectors scoped by `orgId` |
| Teams | `/teams`, `/teams/$teamId` | Shared roster and match visuals | Repository plus direct activity fixture |
| Matches | `/matches`, `/matches/$matchId` | Shared match rows/cards | Repository |
| Schedule | `/schedule` | Shared schedule rows | Repository plus direct guardian fixture |
| Notifications | `/notifications` | Shell notification item | Repository plus notification context |
| Settings and future modules | `/settings`, `/modules/$moduleId` | Shared shell or coming-soon state | Settings currently reads a fixture directly; future modules are placeholders |

Allowed dependency direction: route -> feature -> shared design system; route/feature -> repository -> domain types and fixtures. Shared UI may consume presentation-ready repository selectors, but modules must not import one another's route or implementation internals. Cross-domain behavior should use repository/domain contracts to avoid cycles.

## Modular Implementation Plan

1. **Children and Parent Workspace** (implemented): guardian-child selection and access checks use the repository; Parent Home summarizes schedule, attention, and journey records; the reusable child selector is shared by Home, child profiles, and Schedule.
2. **Organizations** (workspace UI implemented): one `orgId` context powers dashboard, players, teams, training, attendance, competitions, finance overview, and staff for SSB, Club, and Academy types.
3. **Competitions and matches** (UI implemented): category, schedule, result, and standings selectors/components are shared; detail view/category navigation is URL-addressable; Match Detail links back to its competition context.
4. **Players** (implemented): directory filters live in a pure feature model and the directory presentation is owned by `features/players`; the existing route, Garuda organization scope, shared table/cards, and profile access behavior are preserved.
5. **Teams**: move roster, assignment, and activity selections behind a feature/repository boundary; preserve the existing organization and team routes.
6. **Identity and overview**: clarify the preview-only handoff, remove direct fixture imports, and keep role-aware compositions on repository-backed view data.
7. **Schedule, notifications, settings**: complete direct-mock cleanup, then adopt server-backed query state where appropriate.
8. **Future modules**: keep the module registry as navigation metadata and add domain feature folders only when a module is activated.

For each step, define its route boundary, domain/data contract, shared UI reuse, and focused tests before moving to the next module. Avoid cross-module implementation imports and keep presentation free of persistence rules.

---

# Phase 0 — Architecture Stabilization

## 1. Architecture Stabilization Report

### Status
The current codebase is structurally healthy as a prototype ecosystem platform, but it is not yet hardened as a source-of-truth architecture. The strongest signals are:

- clear app shell and route structure
- role-aware home and workspace composition
- a central mock data world and a repository boundary intent
- implementation of the Association membership flow from discovery to detail to KTA

The main risks are not absent apps, but boundary drift:

- direct fixture usage still exists in route-level and feature-level code
- future modules are treated as navigation metadata without domain contracts
- the platform uses role and scope as UI-driven access but not yet as a formal permission contract
- lifecycle and public verification remain incomplete despite the approved architecture

### Stabilization objective
Phase 0 is not a rebuild. It is a controlled alignment exercise to make the platform easier to extend without breaking the original product architecture.

### Key findings
1. The shell and role architecture are intentionally good and should be kept.
2. The source-of-truth principle is mostly clear in concept, but not uniformly enforced in code.
3. The app already contains a meaningful Association membership flow; the gap is the lifecycle/public verification layer.
4. Future modules are architecture-ready in nav shell terms, but not domain-ready in product terms.
5. Repository boundaries need stricter enforcement only where direct mock dependencies create risk.

---

## 2. Domain Ownership Map

| Domain | Primary owner | Source of truth | Consumers | Current implementation | Known GAP |
| --- | --- | --- | --- | --- | --- |
| Football ID | Identity / core platform | Football ID record and identity profile | Player, parent, coach, organization, association, future services | Implemented in core routes and identity features; persisted as prototype data and route-based display | Not yet a canonical API contract or formal identity registry boundary |
| Player | Player domain | Player profile and football journey records | Parent, coach, org admin, scouting, analytics, AI | Player directory, player profile, team and journey views exist | Journey lifecycle, training/attendance/development integration remain partial |
| Organization | Organization domain | Organization profile, teams, staff, membership context | Org admin, coach, parent, competition organizer | Organization workspace and directory are implemented | Organization data is still fixture-backed and not fully normalized against a sovereign domain contract |
| Competition | Competition domain | Competition records, categories, fixtures, standings, match state | Organizer, public portal, players, refs, followers | Private organizer and public portal are implemented and connected to the same domain model | API-ready contracts and deeper official workflow integration still need formalization |
| Membership | Association membership domain | Membership status, validity, role, and governance record | Association users, KTA, public verification, future lifecycle workflows | Directory/detail/review queue/detail flow exists | Membership lifecycle and renewal are not implemented |
| Digital KTA | Membership presentation layer | Membership validity + trusted status snapshot | Association users and public verification consumers | KTA screen exists and is route-connected | It is still a presentation layer, not a complete source-of-truth system |
| Training | Coach / org ops domain | Session plans, training assignments, drills | Coach, org admin, player, parent | Future module only | No domain contract or real feature implementation |
| Attendance | Player ops / club ops | Check-ins, attendance state, reasons, trends | Coach, org admin, parent | Future module only | No domain contract or real feature implementation |
| Player Development | Player progression domain | Goals, milestones, reviews, development record | Coach, player, parent, org admin | Future module only | No domain contract or real feature implementation |
| Finance | Organization / member ops | Fees, invoices, payments, obligations | Parent, org admin | Future module only | No implementation or contract |
| Referee | Referee domain | Match assignments, reports, credentials, availability | Competition organizer, match operations | Future module only | Not started |
| Scouting | Scout domain | Prospect discovery, consented observation, watchlists | Org admin, scout, parent, player | Future module only | Should remain consumer-facing, not a duplicate player source |
| Analytics | Intelligence layer | Derived analytics from source domains | Org admin, competition organizer, AI | Future module only | Must remain downstream and not own source-domain data |
| AI Assistant | Cross-platform assistance layer | Authorized context and assistance responses | All roles | Future module only | Must stay contextual and not become a separate app |

### Architecture principle for this map
Every domain should have one primary source of truth. Consumers may read from that domain, but they must not become duplicate owners.

---

## 3. Coming Soon Activation Matrix

| Module | Existing code | Existing route | Existing navigation | Dependencies | Missing domain contracts | Activation classification |
| --- | --- | --- | --- | --- | --- | --- |
| Training | Navigation registry in [src/config/modules.ts](src/config/modules.ts); placeholder route in [src/routes/modules.$moduleId.tsx](src/routes/modules.$moduleId.tsx) | /modules/training | Yes | Coach, org admin, player contexts; training plan patterns | No session model, no assignment model, no attendance linkage | Placeholder |
| Attendance | Same as above | /modules/attendance | Yes | Coach, parent, org admin, player | No check-in domain, no attendance model, no notification contract | Placeholder |
| Player Development | Same as above | /modules/development | Yes | Player, coach, parent, org admin | No development milestones, no review model, no learning path model | Placeholder |
| Finance & Payments | Same as above | /modules/finance | Yes | Org admin, parent | No fee model, invoice model, payment lifecycle contract | Placeholder |
| Coach Platform | Same as above | /modules/coach | Yes | Coach role, credential context | No coaching profile model or licence/career contract | Architecture Ready |
| Referee Platform | Same as above | /modules/referee | Yes | Referee, organizer | No assignments model, no availability/assessment domain | Placeholder |
| Scouting | Same as above | /modules/scouting | Yes | Scout and consented profile access | No scouting entity, consent model, or watchlist contract | Placeholder |
| Opportunities | Same as above | /modules/opportunities | Yes | Player, parent | No opportunity model or application workflow | Placeholder |
| Analytics | Same as above | /modules/analytics | Yes | Org admin, competition organizer | No analytics domain model, no source-domain contract | Placeholder |
| Association | Same as above | /modules/association | Yes | Association and governance view | Not aligned with the approved membership architecture | Architecture Ready |
| Federation | Same as above | /modules/federation | Yes | Competition organizer | No federation model or licensing contract | Placeholder |
| AI Assistant | Same as above | /modules/ai | Yes | All roles, authorized context | No assistant domain, no source authorization contract, no data usage model | Placeholder |

### Classification notes
- Placeholder: there is a nav entry and a route that states “coming soon,” but no real domain contract or feature module.
- Architecture Ready: the concept is aligned with the product design and can be activated later once contracts are defined, but it is still not product-ready.
- UI Activation Ready: not yet present in this codebase.
- Domain Activation Ready: not yet present in this codebase.

The only materially ready future category is the general architectural intent to activate modules later; the actual domain contracts are not yet implemented.

---

## 4. Repository Boundary Recommendations

### Current pattern
The intended boundary is already visible in [src/data/repository.ts](src/data/repository.ts):

Page
↓
Feature / View Model
↓
Repository Interface
↓
Mock / API

This pattern is the correct stabilization direction.

### Current risk pattern
The risk is not the existence of mock data; it is the fact that some pages and routes still reach directly into mock definitions rather than through repository functions. This creates the following architecture issues:

- duplicated access patterns
- harder domain ownership enforcement
- inconsistent behavior once backend integration begins
- accidental UI coupling to fixture data

High-risk direct dependencies to monitor:

- route-level direct import patterns from [src/data/mock.ts](src/data/mock.ts)
- feature screens that read arrays directly when a repository selector exists
- future modules that read source-domain data without going through repository contracts

### Target repository boundary for new modules
For any new module, apply this pattern:

1. Route or page uses a feature-specific hook.
2. Feature hook calls repository selectors or service methods.
3. Repository is the only layer allowed to know mock/API storage details.
4. UI and route code should never import mock arrays directly.
5. Consumer modules should read domain records, not re-own domain state.

### Recommended action
- KEEP the repository pattern that already exists.
- CONNECT future modules to this boundary before activation.
- STABILIZE LATER any direct-import cleanup that is not a blocker to the current product flow.

This is the correct non-breaking stabilization pattern for Phase 0.

---

## 5. Permission Architecture Contract

### Shared contract
The product principle is not only identity + role. It must be represented as:

Identity
+
Role
+
Scope
+
Context
+
Permission

### Interpretation
- Identity: the person or legal entity behind the profile.
- Role: the workspace lens a user is currently operating in.
- Scope: the operational or organizational boundary (team, club, organization, competition, association, region).
- Context: the active object of the view or workflow (e.g., player, team, competition, member record).
- Permission: the actual action or visibility granted within that combined frame.

### Current code alignment
The existing implementation aligns with this requirement in a prototype sense:

- [src/config/roles.ts](src/config/roles.ts) defines role identity and workspace-level lens
- [src/lib/role-context.tsx](src/lib/role-context.tsx) manages the active role in context
- [src/lib/coach-access.ts](src/lib/coach-access.ts) and [src/lib/association-access.ts](src/lib/association-access.ts) apply visible restrictions by scope
- [src/config/modules.ts](src/config/modules.ts) determines navigation by role

### Important limitation
This is not yet a complete RBAC backend, and it should not be mistaken for one. The current code is UI and scope-aware permission logic, not authorization enforcement. That remains a future system boundary.

### Architecture contract for future modules
Future modules should define:

- identity contract
- role contract
- scope contract
- context contract
- permission matrix

This ensures that modules remain composable and do not create silent duplicate ownership.

---

## 6. Prioritized list of changes

### KEEP
- role-aware shell and navigation structure
- repository pattern intent
- core player/guardian/organization/competition domains
- the existing Football ID and membership flow patterns
- the current Association membership flow architecture

### CONNECT
- connect future modules to repository contracts before activation
- connect missing lifecycle and public verification to the membership source of truth
- connect player journey domains to training, attendance, and development as a single lifecycle
- connect analytics and AI to source-domain data rather than treating them as data owners

### STABILIZE LATER
- direct fixture cleanup where it creates architectural drift
- full RBAC/backend permission contract
- full lifecycle and renewal implementation
- public QR verification and public trust workflows
- deeper coach, referee, scouting, analytics, and AI implementations

---

## 7. Phase 0 conclusion

The platform is in a good prototype state, but the real next step is not a visual redesign. The correct Phase 0 stabilization work is to protect domain ownership, enforce repository discipline, and keep future modules architecture-ready without activating them prematurely.

The strongest product alignment is already in place for:

- core platform shell
- identity and role context
- player and guardian journeys
- organization workspace
- competition domain
- association membership flow

The strongest product gaps are:

- lifecycle and renewal
- public verification
- deeper journey integration
- true permission architecture contracts
- future module domain contracts

This is the right stopping point for Phase 0. No new modules should be built yet. The platform should remain stable and aligned until approval for the next implementation phase.

## 8. Player Development Decision Closure

The architecture questions for assessment verification, organization context, guardian access, and cross-organization continuity are resolved in ADR-09 through ADR-12 in [player-development-architecture-decisions.md](player-development-architecture-decisions.md). The implementation boundary for the first Player Development phase is specified in [player-development-phase-1-specification.md](player-development-phase-1-specification.md).

These documents establish a planning baseline, not authorization to begin implementation. The existing shell, live modules, membership flow, routes, and source code remain unchanged by this decision closure. Before Phase 1 starts, the implementation scope must be explicitly approved and the outstanding legal/privacy policy inputs identified in the ADRs must be assigned for resolution. Current role-aware UI checks remain prototype restrictions, not backend authorization.

The baseline decisions are:

- Football ID is a global player identity independent of organization affiliation.
- Affiliations are dated relationships; an optional player-selected primary context is informational and grants no access.
- Assessment authorship and verification are separate; versions, disputes, and corrections preserve history.
- Guardian relationship and scoped consent are separate; a new organization affiliation does not grant historical access.
- Source records remain with their authoritative domains; journey and portable exports reference them with provenance.

---