# Player Development User Experience Architecture

## Core principle

The player owns the journey. Every role sees the same core journey through a different authorized lens.

The experience should therefore be:

- player-first
- role-aware
- evidence-based
- longitudinal
- portable across organizations

## Player experience

The player should see a unified development space with sections such as:

- My Football Identity
- My Journey
- My Training
- My Attendance
- My Development
- My Goals
- My Achievements
- My Portfolio
- My Opportunities

### Player journey flow

1. Identity and profile ownership
2. Active team and organization context
3. Training participation history
4. Attendance and participation records
5. Development competencies and formal assessments
6. Goals and progress checkpoints
7. Achievements and verified portfolio artifacts
8. Opportunities and talent visibility

## Guardian experience

Guardians should see the child’s journey in a supportive, consented view.

Examples:

- Child’s football journey
- Training overview
- Attendance overview
- Coach feedback and development notes
- developmental goals and progress
- consent and access management

Guardians should not be granted broad organization-level access by default.

## Coach experience

A coach should be able to:

- review assigned player profiles
- see training activity and attendance
- add observations and feedback
- create or support development plans
- assess competencies with evidence
- track progress over time

The coach workflow should remain separate from official verification and from the player’s broader identity ownership.

## Organization experience

An academy, club, or SSB should operate at the organizational level:

- player development overview
- team development trends
- coaching activity and assessments
- player progression across seasons
- operational reporting and opportunities

Organizations can manage their own operational workflows, but they must not own or erase the player’s broader journey.

## Scouting / talent identification experience

Scouting should consume a limited set of authorized player data:

- verified profile basics
- achievements and milestones
- development summary
- consented player availability
- opportunity fit or talent notes

Scouting should not become a second source of player development truth.

## Analytics / AI experience

Analytics and AI should present derived insights such as:

- trend summaries
- competency movement over time
- next-step recommendation
- risk or support prompts

These experiences must remain clearly labeled as derived, not official, and should not alter the source records.

## UX responsibilities by role

| Role | Primary experience | Data access style |
| --- | --- | --- |
| Player | personal journey, goals, portfolio | full access to own profile and consented data |
| Guardian | child progress and consented context | scoped access to child records |
| Coach | player development and training context | team-scoped access with evidence input |
| Organization admin | operational view across players and teams | organization-scoped access |
| Association | governance and official validity view | review and verification scope |
| Scout | consented player discovery | limited, derived visibility |
| AI | recommendations and summaries | read-only derived access |

## Experience design constraints

- Do not create duplicate journeys for different roles.
- Do not present one role’s view as a separate source record.
- Keep the player at the center of navigation, context, and timeline.
- Distinguish official records from derived insights.
- Maintain continuity even when the active organization changes.

## Approved user experience architecture

The approved experience architecture is player-centric and role-aware, not siloed by organization or feature. The same underlying player data appears through multiple authorized lenses, while source-of-truth ownership remains centralized.
