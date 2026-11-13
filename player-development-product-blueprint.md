# Player Development Product Blueprint

## 1. Product purpose

The Player Development Ecosystem exists to support a player’s lifelong football development across identity, training, participation, assessments, goals, achievements, and opportunities.

This blueprint follows the approved architecture already reflected in [architecture.md](architecture.md), [src/config/modules.ts](src/config/modules.ts), [src/config/roles.ts](src/config/roles.ts), [src/data/repository.ts](src/data/repository.ts), and the current route / shell structure.

The product principle remains unchanged:

> The player owns the journey.

## 2. Product architecture constraints

This implementation blueprint is intentionally architecture-first and non-invasive.

It must preserve:

- the existing role-aware shell and navigation
- the existing route structure and repository boundary
- the current mock-driven prototype world
- the approved domain separation and no-duplicate-source-of-truth rule
- the current “coming soon” module gating pattern

This document is a blueprint only. It does not activate new production modules or add database migrations. It defines how future modules should be implemented when approved.

## 3. Product vision

The platform should help a player progress from first registration to long-term football development while preserving continuity as they move across teams, academies, competitions, and organizations.

The system should connect:

- identity and verification
- team and organization context
- training execution and attendance
- match participation and performance evidence
- formal and informal assessment
- goals and development plans
- achievements and portfolio history
- authorized guardian and coach visibility
- intelligence and scouting as downstream consumers

## 4. Target user groups

1. Player
2. Parent / Guardian
3. Coach
4. Organization Admin
5. Competition Organizer
6. Association / Governance user
7. Scout
8. Analyst or AI consumer

## 5. Core product principles

### 5.1 Player-centric ownership
The player’s Football ID, historical journey, and development context stay with them regardless of team or academy changes.

### 5.2 One source of truth per concept
Each domain has a single owner. Analytics, AI, scouting, and reporting consume data but never own official source records.

### 5.3 Longitudinal continuity
The player’s story is a timeline, not a series of isolated module silos.

### 5.4 Permission-aware access
Role, identity, scope, and context must all be considered before granting access.

### 5.5 Evidence before judgment
A player is not reduced to a single score. Development assessment requires evidence and context.

## 6. Product scope

### In scope
- player identity and profile
- development timeline and historical journey
- training planning and attendance
- match participation and performance evidence
- assessments and competency tracking
- player goals and plans
- portfolio and achievements
- guardian visibility and consent
- scouting and intelligence as consumer surfaces

### Out of scope for this blueprint
- replacing the current architecture
- implementing backend persistence
- activating future modules without an approval gate
- creating duplicate data stores or a second player directory
- direct bypass of repository contracts

## 7. Module map

The product is organized into the following modules:

1. Player Identity & Profile
2. Player Journey
3. Training Management
4. Training Attendance
5. Match Participation
6. Player Development Assessment
7. Coach Observation & Feedback
8. Development Competencies
9. Player Goals
10. Development Plans
11. Player Portfolio
12. Achievements & Milestones
13. Scouting & Opportunities
14. Development Analytics
15. AI Development Intelligence
16. Guardian Monitoring

## 8. Product experience model

The primary experience is a player development dashboard that combines:

- identity summary
- current team and organization context
- recent training and matches
- competency progress
- goals and next steps
- achievements and milestones
- consented guardianship and family visibility

This dashboard is the canonical player development home. Other role-specific dashboards should read from the same underlying player data and only vary by permission, not by duplicate records.

## 9. Implementation guardrails

### 9.1 Files and patterns to preserve
- [src/config/modules.ts](src/config/modules.ts) remains the navigation registry
- [src/config/roles.ts](src/config/roles.ts) remains the role model
- [src/data/repository.ts](src/data/repository.ts) remains the access boundary
- [src/data/types.ts](src/data/types.ts) remains the type contract source
- [src/data/mock.ts](src/data/mock.ts) remains prototype data only
- [src/router.tsx](src/router.tsx) remains the route shell entry
- route files under [src/routes](src/routes) remain thin composition and authorization layers

### 9.2 Required implementation pattern
Page → Hook → Repository → Mock / API

### 9.3 Activation rule
Future modules remain hidden behind the existing “coming soon” pattern until each module has:

- source-of-truth owner
- repository contract
- permission matrix
- acceptance criteria
- UI flow aligned with the shell

## 10. Product outcome

When fully implemented, this ecosystem will enable a player to:

- maintain one continuous football identity
- see their development history over time
- understand training and attendance evidence
- track goal progress and competency development
- compile a trusted portfolio of achievements
- share only consented information with guardians, coaches, and scouts
- receive personalized, explainable recommendations from analytics and AI

This blueprint is therefore a complete implementation-ready foundation for the next product phase without breaking the current application architecture.
