# Player Development Phase Plan

## Phase 1 — Player Identity & Journey Foundation

The precise scope, contracts, permissions, and acceptance criteria are defined in [player-development-phase-1-specification.md](player-development-phase-1-specification.md). This plan is not authorization to begin implementation.

### Deliverables
- player identity contract
- player profile experience
- journey timeline foundation
- repository selectors for identity and journey

### Files potentially affected
- [src/data/repository.ts](src/data/repository.ts)
- [src/data/types.ts](src/data/types.ts)
- [src/data/mock.ts](src/data/mock.ts)
- [src/routes/players.$playerId.tsx](src/routes/players.$playerId.tsx)
- [src/features/players](src/features/players)

### Dependencies
- role model
- core identity and player record model
- current profile and journey data
- approved ADR-09 through ADR-12 and an explicitly scoped Phase 1 implementation approval

### Database requirements
- node-level data model only; no migration yet
- future source record model for player and journey

### UI requirements
- player overview summary
- player journey timeline
- identity card and affiliations

### API requirements
- GET /players/:id
- GET /players/:id/journey

### Test scenarios
- player profile loads with access restrictions
- journey timeline shows historical continuity
- role-limited views remain respected

### Acceptance criteria
- one stable player identity remains across affiliations
- player journey aggregates source evidence

### Definition of Done
- route and feature work preserved
- repository contract in place
- player identity is the canonical record

---

## Phase 2 — Training & Attendance Integration

### Deliverables
- training session data model
- attendance records and trend logic
- session calendar and attendance board

### Files potentially affected
- [src/config/modules.ts](src/config/modules.ts)
- [src/data/repository.ts](src/data/repository.ts)
- route and feature directories for training/attendance

### Dependencies
- player identity foundation
- team and session domain context

### Database requirements
- training session and attendance tables conceptualized only

### UI requirements
- training calendar
- attendance dashboard
- session detail and participation list

### API requirements
- GET /teams/:teamId/sessions
- GET /sessions/:id/attendance
- POST /attendance

### Test scenarios
- attendance records bind to team and session context
- role-specific access is respected
- attendance workflows do not overwrite official assessment data

### Acceptance criteria
- training and attendance are connected without duplicate source ownership

### Definition of Done
- training is operational and distinct from assessment
- attendance is evidence-backed and traceable

---

## Phase 3 — Development Competency Framework

### Deliverables
- competency taxonomy
- age-appropriate assessment model
- competency progress tracking

### Files potentially affected
- domain model docs and future feature folders
- repository selectors for competency measures

### Dependencies
- player identity foundation
- training and match evidence data

### Database requirements
- competencies and assessment cycles conceptual model

### UI requirements
- competency dashboard
- rubric matrix
- progress view

### API requirements
- GET /competencies
- GET /players/:id/competency-progress

### Test scenarios
- rating requires evidence context
- single score does not replace full development picture

### Acceptance criteria
- competency model supports longitudinal progression
- assessment is evidence-based and explainable

### Definition of Done
- competency framework supports all major development domains

---

## Phase 4 — Coach Observation & Assessment

### Deliverables
- coach observations
- assessment workflow
- review and verification status

### Files potentially affected
- route and feature modules for assessment and observation
- future repository contracts

### Dependencies
- training attendance
- competency framework
- player identity and team scope

### Database requirements
- observation and assessment record models

### UI requirements
- observation feed
- assessment form
- verification panel

### API requirements
- POST /observations
- POST /assessments
- PATCH /assessments/:id/verify

### Test scenarios
- observation is distinct from formal assessment
- verification requires authority and evidence

### Acceptance criteria
- observations are contextual and attributable
- assessment is formally verified when required

### Definition of Done
- official assessment remains separate from informal notes

---

## Phase 5 — Player Goals & Development Plans

### Deliverables
- personal goals board
- development plan workflow
- progress tracking and revisions

### Files potentially affected
- development feature folder
- repository selectors and service logic

### Dependencies
- competency framework
- assessment and observation workflow

### Database requirements
- goals and plan revision tables

### UI requirements
- goals board
- plan workspace
- revision history panel

### API requirements
- GET /players/:id/goals
- POST /goals
- GET /players/:id/plans
- PATCH /plans/:id

### Test scenarios
- goal value is tied to evidence and progress
- plan revisions preserve prior versions

### Acceptance criteria
- player and coach can work on a single structured plan
- no duplication of development history occurs

### Definition of Done
- goal and plan workflow is measurable, auditable, and connected to evidence

---

## Phase 6 — Match Performance Integration

### Deliverables
- match participation records
- performance evidence flow into player portfolio and development summaries

### Files potentially affected
- [src/data/repository.ts](src/data/repository.ts)
- competition and match routes
- player match summary components

### Dependencies
- competition and team source domain
- current match structure and player records

### Database requirements
- participation and performance evidence tables

### UI requirements
- player match history
- team and competition summary
- development-linked match view

### API requirements
- GET /matches/:id/participants
- GET /players/:id/matches

### Test scenarios
- match facts remain authoritative in match context
- player summary reads match data without altering match state

### Acceptance criteria
- match evidence is connected to player development without duplication

### Definition of Done
- match performance is visible as a source-backed evidence stream

---

## Phase 7 — Player Portfolio & Achievements

### Deliverables
- portfolio overview
- verified achievement records
- milestone dashboard

### Files potentially affected
- achievement and portfolio feature modules
- repository and mock data

### Dependencies
- player journey
- match participation
- assessment evidence

### Database requirements
- portfolio items and achievement verification tables

### UI requirements
- portfolio cards and gallery
- verified achievement list
- milestone timeline

### API requirements
- GET /players/:id/portfolio
- GET /players/:id/achievements
- PATCH /achievements/:id/verify

### Test scenarios
- verified and unverified records remain distinct
- portfolio reflects source-backed data

### Acceptance criteria
- player portfolio acts as a trust layer over validated achievements and milestones

### Definition of Done
- portfolio is authoritative only in its own curated context

---

## Phase 8 — Scouting & Opportunities

### Deliverables
- consent-based player discovery
- opportunity workflow
- watchlist and shortlisting support

### Files potentially affected
- new scouting feature folder
- privacy and role-aware access flow

### Dependencies
- player identity and portfolio
- consent and data sharing model

### Database requirements
- opportunity and watchlist records

### UI requirements
- scouting dashboard
- opportunity cards
- consented profile summary

### API requirements
- GET /scouting/search
- GET /players/:id/scouting-view

### Test scenarios
- scout sees only consented information
- no source-of-truth duplication occurs

### Acceptance criteria
- scouting remains a consumer layer

### Definition of Done
- scouting is a permissioned, read-only consumer service

---

## Phase 9 — Analytics & AI Development Intelligence

### Deliverables
- trend analysis and progress summaries
- explainable AI recommendations
- support surface for leaders and players

### Files potentially affected
- analytics and AI feature folders
- repository services for derived insights

### Dependencies
- all core player development domains
- consent and permission model

### Database requirements
- derived insight records and recommendation log only

### UI requirements
- analytics dashboard
- recommendation panel
- explainability and audit view

### API requirements
- GET /players/:id/analytics
- POST /ai/development-summary
- POST /ai/recommendations

### Test scenarios
- insights remain derived and explainable
- AI recommendations are traceable to evidence and permissions

### Acceptance criteria
- analytics and AI remain downstream and non-authoritative

### Definition of Done
- intelligence features serve the player and stakeholders without creating a parallel source domain

## Final implementation sequencing

The correct sequence is:

1. Player Identity & Journey Foundation
2. Training & Attendance Integration
3. Development Competency Framework
4. Coach Observation & Assessment
5. Player Goals & Development Plans
6. Match Performance Integration
7. Player Portfolio & Achievements
8. Scouting & Opportunities
9. Analytics & AI Development Intelligence

This order preserves the architecture and minimizes duplication risk.
