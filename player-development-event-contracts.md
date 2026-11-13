# Player Development Event Contracts

## Purpose

This document defines key domain events for the Player Development Ecosystem. It focuses on business events that connect domains without creating uncontrolled duplication.

## Event model

The architecture uses a simple event pattern aligned to the existing app structure:

- Domain events are created by source domains.
- Consumer domains may react to them.
- Events do not change source data ownership.
- Integration events are only used when a cross-boundary service or workflow is needed.

## Domain events

### PlayerRegistered
- Producer: Player Identity & Profile
- Consumer: Player Journey, Guardian access, Organization onboarding
- Trigger: new player record accepted
- Payload:
  - playerId
  - footballId
  - displayName
  - registeredAt
  - consentState
- Business meaning: player identity is now available in the ecosystem

### PlayerAffiliationChanged
- Producer: Organization / Team domain
- Consumer: Player Journey, Player Profile, Analytics
- Trigger: player joins or leaves an organization or team
- Payload:
  - playerId
  - previousOrganizationId
  - newOrganizationId
  - teamId
  - effectiveFrom
  - effectiveTo (when ending an affiliation)
  - affiliationId
  - recordedBy
  - reason
- Business meaning: the player’s active environment changed without altering their core identity

### TrainingSessionCreated
- Producer: Training domain
- Consumer: Attendance, Player Journey, Coach feeds
- Trigger: a session is scheduled or published
- Payload:
  - sessionId
  - teamId
  - organizationId
  - coachId
  - date
  - objectives
- Business meaning: planning context is available for participation and analysis

### PlayerAttendanceRecorded
- Producer: Attendance domain
- Consumer: Player Journey, Development assessment, Analytics
- Trigger: a player attendance status is recorded
- Payload:
  - attendanceId
  - playerId
  - sessionId or matchId
  - status
  - reasonCode
  - recordedBy
- Business meaning: participation evidence is now available for review and analytics

### MatchParticipationRecorded
- Producer: Match & Performance domain
- Consumer: Journey, Portfolio, Development assessment
- Trigger: player participation is recorded for a match
- Payload:
  - matchId
  - playerId
  - teamId
  - position
  - minutesPlayed
  - performanceStats
- Business meaning: match evidence is available without rewriting the authoritative match record

### CoachObservationSubmitted
- Producer: Coach Observation & Feedback
- Consumer: Development assessment, Player Journey, Analytics
- Trigger: a coach adds observation evidence
- Payload:
  - observationId
  - playerId
  - observerId
  - contextType
  - summary
  - evidenceRefs
- Business meaning: contextual feedback is available for development review

### PlayerAssessmentCompleted
- Producer: Development & Assessment
- Consumer: Player Journey, Goals, Analytics
- Trigger: a formal assessment cycle is closed
- Payload:
  - assessmentId
  - playerId
  - cycleId
  - competencies
  - overallStatus
  - assessorId
  - revisionNumber
  - organizationId
- Business meaning: official development state is recorded

### PlayerAssessmentSubmitted
- Producer: Development & Assessment
- Consumer: designated organization reviewer, player/guardian view when authorized
- Trigger: author submits a frozen assessment revision for review
- Payload: assessmentId, revisionNumber, playerId, organizationId, assessorId, submittedAt
- Business meaning: the assessment is awaiting independent verification

### PlayerAssessmentDisputed
- Producer: Development & Assessment workflow
- Consumer: author, designated reviewer, player/guardian when authorized
- Trigger: player or authorized guardian opens a dispute
- Payload: assessmentId, revisionNumber, playerId, disputeId, submittedBy, reasonRef, createdAt
- Business meaning: review is required; the source version remains preserved

### GuardianConsentChanged
- Producer: consent/access domain
- Consumer: authorization boundary and affected source domains
- Trigger: a scoped guardian grant is created, changed, revoked, expires, or is suspended
- Payload: grantId, guardianRelationshipId, playerId, categories, actions, status, effectiveAt, version
- Business meaning: future access decisions must use the current grant state

### PlayerDataShareGranted
- Producer: consent/access domain
- Consumer: source domains and receiving organization access boundary
- Trigger: player or authorized guardian grants a scoped cross-organization share
- Payload: grantId, playerId, receivingOrganizationId, categories, purpose, expiresAt, grantedBy
- Business meaning: only the specified categories are available for the specified period

### DevelopmentGoalCreated
- Producer: Player Goals & Development Plans
- Consumer: Player Journey, Coach workflow, Analytics
- Trigger: a player or coach creates a goal
- Payload:
  - goalId
  - playerId
  - competencyId
  - createdBy
  - targetState
  - dueDate
- Business meaning: the journey has a direction and measurable next step

### DevelopmentMilestoneAchieved
- Producer: Development & Assessment or Goals domain
- Consumer: Player Journey, Portfolio, Analytics
- Trigger: a major milestone is reached
- Payload:
  - milestoneId
  - playerId
  - competencyId
  - achievedAt
  - evidenceRefs
- Business meaning: progress becomes part of the player’s longitudinal narrative

### PlayerAchievementVerified
- Producer: Player Portfolio & Achievements
- Consumer: Player Journey, Scouting, analytics
- Trigger: a record is verified as official or trusted
- Payload:
  - achievementId
  - playerId
  - title
  - verificationSource
  - verifiedAt
- Business meaning: the achievement is now trusted in the portfolio

## Event governance rules

- Producers own the event payload definitions.
- Consumers may react, but they may not alter the source record.
- Events must carry provenance and authorization context.
- A consumer should not generate official assessment records from a single event.
- Events are not equivalent to a database mutation layer.

## Domain event vs integration event

### Domain events
These stay inside the ecosystem and describe meaningful business changes.

Examples:
- PlayerAffiliationChanged
- TrainingSessionCreated
- PlayerAssessmentCompleted

### Integration events
These are used when external or downstream systems need a contract to react.

Examples:
- OpportunityMatched
- ExternalScoutingNoteReceived
- ProgressInsightPublished

The system should keep these separate to avoid leaking internal source-of-truth changes into downstream systems.

## Authorization implications

Every event should carry enough metadata to respect the permission architecture:

- actorId
- roleContext
- scopeId
- playerId
- verificationStatus
- consentState

Events must never be used to bypass authorization or create hidden write access.

## Recommended deployment pattern

Use a simple event-driven approach only when justified by cross-domain workflows. The existing application is not yet a highly asynchronous system, so the architecture should favor direct repository-driven coordination for the near term and event contracts for the medium term.
