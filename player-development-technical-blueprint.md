# Player Development Technical Blueprint

## 1. Architecture alignment

This technical blueprint follows the existing approach used throughout the app:

Page → Hook → Repository → Mock / API

It preserves the current product architecture in:

- [src/router.tsx](src/router.tsx)
- [src/config/modules.ts](src/config/modules.ts)
- [src/config/roles.ts](src/config/roles.ts)
- [src/data/repository.ts](src/data/repository.ts)
- [src/data/types.ts](src/data/types.ts)

No new architectural pattern is introduced without justification.

## 2. Frontend modules

The current feature organization should remain the home for new modules:

- src/features/players/
- src/features/children/
- src/features/competitions/
- src/features/organizations/
- src/features/overview/
- src/features/members/
- new future folders for development-specific features when activated

Proposed future module folders:

- src/features/development/
- src/features/training/
- src/features/attendance/
- src/features/assessment/
- src/features/goals/
- src/features/portfolio/
- src/features/scouting/
- src/features/analytics/
- src/features/ai/

## 3. Frontend responsibilities

### Router layer
Routes remain thin. They should:

- resolve loader data
- apply route validation
- perform not-found flows
- compose feature components
- preserve role checks and redirect conditions

### Feature hook layer
Hooks should own:

- filter logic
- permission-checked selectors
- mapping between domain records and UI models
- loading and empty state decisions

### Repository layer
Repository functions remain the access boundary and should own:

- domain queries
- domain transforms
- read-only access patterns
- future API adapter substitutions

### UI layer
UI components remain presentation-only and should not enforce business logic directly.

## 4. Repository contract design

The current repository pattern is the correct foundation. The next implementation should expand it carefully and only when a module is activated.

### Example repository contract areas

- getCurrentUser()
- getPlayer(id)
- getPlayerByFootballId(fid)
- listPlayers(filter)
- getJourney(playerId)
- getMemberships(playerId)
- getAchievements(playerId)
- getDocuments(playerId)
- listSchedule(teamIds)
- listMatches(filter)
- listCompetitions()

### Future repository additions
- getPlayerDevelopmentSummary(playerId)
- getPlayerGoals(playerId)
- getPlayerPlans(playerId)
- listTrainingSessions(teamId)
- getSessionAttendance(sessionId)
- addAttendanceRecord(payload)
- getAssessmentCycle(playerId)
- getCompetencyProgress(playerId)
- listObservations(playerId)
- getPortfolio(playerId)
- getOpportunityMatches(playerId)
- getAnalyticsSummary(playerId)

Phase 1 contract details are specified in [player-development-phase-1-specification.md](player-development-phase-1-specification.md). In particular, identity lookup, affiliation history, primary-context preference, and journey references must not be conflated into `Player.orgId`/`teamId` as authoritative identity ownership.

## 5. Domain services

The product may introduce small domain services as pure logic layers when justified. They should be used for:

- competency aggregation
- attendance trend calculations
- developmental maturity summaries
- goal progress calculations
- verification checks
- historical snapshot generation

Examples:

- computeCompetencyTrend(playerId, assessmentCycle)
- summarizeAttendance(playerId, sessionRecords)
- calculateGoalProgress(goal, evidence)
- buildPlayerJourneySummary(playerId)
- evaluatePlayerPortfolioRisk(playerId)

## 6. API contract design

The current app is mock-first and does not implement a backend. Future API contracts should remain aligned with the repository and role model.

### Identity API
- GET /players/:id
- GET /players/:id/affiliations
- PATCH /players/:id/profile

### Journey API
- GET /players/:id/journey
- GET /players/:id/journey?domain=

### Training API
- GET /teams/:teamId/sessions
- POST /sessions
- PATCH /sessions/:id

### Attendance API
- GET /sessions/:id/attendance
- POST /attendance
- PATCH /attendance/:id

### Assessment API
- GET /players/:id/assessments
- POST /assessments
- PATCH /assessments/:id/verify

### Goals API
- GET /players/:id/goals
- POST /goals
- PATCH /goals/:id

### Plans API
- GET /players/:id/plans
- POST /plans
- PATCH /plans/:id

### Portfolio API
- GET /players/:id/portfolio
- POST /portfolio/artifacts

### Scouting API
- GET /scouting/search
- GET /players/:id/scouting-view

### Analytics API
- GET /players/:id/analytics
- GET /teams/:id/analytics

### AI API
- POST /ai/development-summary
- POST /ai/recommendations

## 7. Data relationships

Key domain relationships:

- Player has many affiliations
- Player has many training sessions and attendance records
- Player has many match participation records
- Player has many assessments and goals
- Player has many milestones and artifacts
- Guardian has many linked child relationships
- Coach is linked to team and training context
- Organization owns team and roster context
- Analytics and AI consume source data; they do not create it

## 8. State management

Current state patterns should remain:

- TanStack Router for route state and loaders
- React Context for role and notification state
- local component state for UI filters and transient controls
- repository-backed selectors for domain reads

New module state should remain local unless it genuinely spans features.

## 9. Validation and business rules

Validation should be performed at the repository/service boundary and in route-level loaders, especially for:

- player existence
- organization membership and team assignment
- consented guardian access
- competency evidence completeness
- assessment verification rules
- date and plan revision invariants

## 10. Error handling

The current UI already uses EmptyState and PermissionState. New modules should follow the same approach:

- not found state
- permission blocked state
- no data state
- validation failure state
- infrastructure / server error state

Errors should remain explicit and user-readable, not silently hidden.

## 11. Authorization model

Future implementation must honor the working contract:

Identity + Role + Scope + Context + Permission

Examples:

- Player sees their own record and consented data
- Guardian sees only linked child records
- Coach sees only assigned team context
- Org Admin sees organization-scoped records
- Scout sees consented profile subset only
- AI/analytics consume derived context only

For guardian access, relationship verification is not consent. For cross-organization access, a new affiliation is not a historical-data grant. These rules require backend/API enforcement; current role context and access helpers are prototype UI controls only.

## 12. Audit logging

When future modules are activated, they should preserve:

- createdAt
- updatedAt
- createdBy
- updatedBy
- actorRole
- permissionScope
- consentState
- verificationStatus

This is especially important for:

- assessments
- plan revisions
- coaching observations
- achievements verification
- consent changes

## 13. Testing strategy

### Unit tests
- repository selectors
- service logic (goal progress, attendance trends, competency calculations)
- validation rules

### Component tests
- dashboard summaries
- empty and permission states
- role-specific render conditions

### Integration tests
- player journey and profile route rendering
- coach team views
- guardian child access flow
- assessment submission and verification states

### Regression rules
- do not create duplicate member or player views
- do not rebuild the route shell
- preserve current behavior for live modules

## 14. Technical readiness

This blueprint is technically ready as a product specification. It is not backend implementation. The current app architecture supports the next phase because it already has:

- role-aware navigation
- repository abstraction
- route composition model
- mock data pattern
- shared UI components

The next implementation step is sequencing and module activation, not new architecture.
