# Player Development Ecosystem Architecture

## Purpose

This document defines the Player Development Ecosystem for the existing Youth Football Ecosystem Platform without replacing the approved shell, routes, or product architecture.

The core principle remains: The player owns the journey.

This architecture is designed as an ecosystem of connected domains, not a set of isolated product modules. It is intended to connect the existing Football ID, Player, Organization, Competition, and Association foundations to a complete player-growth system.

## Repository-grounded starting point

The current application already contains the foundational product elements that this ecosystem must build on:

- Role-aware navigation and app shell in [src/config/modules.ts](src/config/modules.ts) and [src/components/shell/app-sidebar.tsx](src/components/shell/app-sidebar.tsx)
- Role and scope context in [src/config/roles.ts](src/config/roles.ts) and [src/lib/role-context.tsx](src/lib/role-context.tsx)
- Central player and organization domain data in [src/data/types.ts](src/data/types.ts) and [src/data/mock.ts](src/data/mock.ts)
- Repository boundary intent in [src/data/repository.ts](src/data/repository.ts)
- Existing route composition in [src/router.tsx](src/router.tsx)
- Placeholder module routes in [src/routes/modules.$moduleId.tsx](src/routes/modules.$moduleId.tsx)

The architecture below respects those boundaries and the existing product direction.

## Product vision

The player is the center of the football ecosystem. A player may move across teams, academies, competitions, and organizations, but their personal development history must remain coherent, portable, and owned by the player.

The ecosystem must support:

- persistent football identity
- development timeline across time and organizations
- training and attendance evidence
- coach observations and formal assessment
- player goals and progress tracking
- verified achievements and performance records
- official and consented access by guardian, coach, and organization
- future intelligence layers that consume, rather than own, source records

## Architectural principles

1. One person = one core football identity.
2. The player owns the journey.
3. Every important concept has one source of truth.
4. Coaches, academies, and organizations can support the journey, but they do not own the player's entire history.
5. Training, attendance, and development must be connected as a longitudinal system, not isolated modules.
6. Consumer modules such as Scouting, Analytics, and AI assist, but do not own source data.
7. A player may operate through multiple roles and authorized contexts without duplicate identities.
8. The system must preserve historical development continuity after team or organization changes.

## Core domain model

### 1. Player Identity & Profile
This domain owns the durable personal identity of the player.

Responsibilities:

- Football ID
- personal profile
- position, dominant foot, age group
- affiliations and team history
- guardian relationships
- verification and privacy state

Primary entities:

- Player
- Guardian
- PlayerAffiliation
- PlayerProfileVerification

Authoritative owner:

- Player Identity & Profile domain

Dependencies:

- Organization
- Team
- Guardian relationship context

### 2. Player Journey
This domain is the longitudinal timeline of the player’s football life.

Responsibilities:

- participation timeline
- training references
- match participation references
- achievements and milestones
- development goals
- progress summaries
- historical milestones

Primary entities:

- JourneyEvent
- DevelopmentTimeline
- PlayerMilestone
- AchievementRecord

Authoritative owner:

- Player Journey domain

Dependencies:

- Player Identity
- Training
- Attendance
- Match
- Development assessment

### 3. Training Ecosystem
This domain owns training planning and execution.

Responsibilities:

- session plans
- training objectives
- drill or activity metadata
- coach assignment
- participation context

Primary entities:

- TrainingSession
- TrainingPlan
- TrainingObjective
- TrainingAssignment

Authoritative owner:

- Training domain

Dependencies:

- Team
- Organization
- Coach
- Player

### 4. Attendance & Participation
This domain owns recorded attendance and participation.

Responsibilities:

- training attendance
- match participation
- availability and absence
- participation history

Primary entities:

- AttendanceRecord
- AvailabilityRecord
- ParticipationSummary
- AbsenceRecord

Authoritative owner:

- Attendance domain

Dependencies:

- Training
- Match
- Player
- Team

### 5. Development & Assessment
This domain owns formal development evaluation and capability measurement.

Responsibilities:

- technical/tactical/physical/psychological competencies
- assessment criteria
- evidence-based observations
- baseline and progress tracking
- periodic evaluation snapshots

Primary entities:

- CompetencyFramework
- AssessmentCycle
- CompetencyRating
- AssessmentEvidence
- DevelopmentSnapshot

Authoritative owner:

- Development & Assessment domain

Dependencies:

- Player
- Coach observation
- Training
- Attendance
- Match performance

### 6. Coach Observation & Feedback
This domain owns narrative and contextual coach feedback that may contribute to formal assessment.

Responsibilities:

- observations
- strengths
- improvement recommendations
- evidence notes

Primary entities:

- CoachObservation
- FeedbackNote
- ObservationEvidence

Authoritative owner:

- Coach Observation & Feedback domain

Dependencies:

- Coach
- Player
- Training
- Match
- Development assessment

### 7. Match & Performance Integration
This domain owns match records and in-game performance facts.

Responsibilities:

- player participation in matches
- minutes played
- goals / assists / cards / substitutions
- position and performance context

Primary entities:

- Match
- MatchParticipation
- PlayerMatchStat
- MatchEvent

Authoritative owner:

- Match & Performance Integration domain

Dependencies:

- Competition
- Team
- Player
- Development assessment

### 8. Player Goals & Development Plans
This domain owns planned developmental aims and progress to them.

Responsibilities:

- goals
- coach-supported development plans
- checkpoints
- completion status

Primary entities:

- DevelopmentGoal
- DevelopmentPlan
- GoalCheckpoint
- GoalRevisionHistory

Authoritative owner:

- Player Goals & Development Plans domain

Dependencies:

- Player
- Coach
- Competency framework
- Assessment data

### 9. Player Portfolio & Achievements
This domain owns verified achievements and portfolio artifacts.

Responsibilities:

- verified competition history
- awards and milestones
- certificates
- player highlight portfolio

Primary entities:

- AchievementRecord
- PortfolioArtifact
- VerifiedMilestone

Authoritative owner:

- Player Portfolio & Achievements domain

Dependencies:

- Player Journey
- Match
- Competition
- Development assessment

### 10. Scouting & Opportunities
This domain consumes authorized player information for opportunity identification.

Responsibilities:

- talent discovery
- watchlist and consented visibility
- opportunity recommendation

Primary entities:

- ScoutProfile
- Opportunity
- PlayerInterestRecord

Authoritative owner:

- Scouting & Opportunities domain only for scouting-specific workflow data

Data ownership boundary:

- It does not own the player’s core journey or core assessment data.

### 11. Analytics & AI Development Intelligence
This domain consumes source-domain facts and produces insights.

Responsibilities:

- trend analysis
- progress summaries
- comparison and recommendations
- risk indicators

Primary entities:

- InsightSummary
- TrendAnalysis
- Recommendation

Authoritative owner:

- Analytics & AI consume source-domain data

Critical rule:

- They must not overwrite official assessment records or become a source of truth.

## Source-of-truth summary

The key rule is simple: source domains own their records; downstream modules consume them.

| Business concept | Source domain |
| --- | --- |
| Player identity | Player Identity & Profile |
| Club/team affiliation | Organization / Team |
| Membership validity | Membership domain |
| Competition records | Competition domain |
| Match facts | Match & Performance Integration |
| Training sessions | Training domain |
| Attendance facts | Attendance domain |
| Formal development scores | Development & Assessment |
| Coach observations | Coach Observation & Feedback |
| Player goals | Player Goals & Development Plans |
| Verified achievements | Player Portfolio & Achievements |
| Insights and recommendations | Analytics / AI as consumers |

## Bounded context summary

The ecosystem naturally separates into a few bounded contexts:

- Player identity and affiliation
- Player journey and history
- Training operations
- Attendance and participation
- Development and assessment
- Match performance
- Goals and portfolio
- Intelligence and scouting consumers

These contexts are intentionally interdependent but not overlapping.

## Recommended architecture decisions

- Keep the application shell and navigation model intact.
- Add player development domains behind repository contracts only when activated.
- Keep Player Journey as the center of the ecosystem and the main experience assembly point.
- Treat analytics and AI as downstream interpretive layers.
- Keep all formal decisions tied to source records, not derived summaries.

---

## Deliverable status

This document is the high-level architecture specification for the Player Development Ecosystem and is consistent with the existing architecture and repository pattern.
