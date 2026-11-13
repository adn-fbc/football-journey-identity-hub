# Player Development Screen Blueprint

## 1. Principle

The primary screen is the Player Development Dashboard. It is the central experience for player growth and should not be duplicated into separate disconnected dashboards for every role.

Instead, the same player data is rendered via different permission-aware views depending on role.

## 2. Screen inventory

| Screen name | Route | Primary role | Purpose |
| --- | --- | --- | --- |
| Player Development Dashboard | /players/$playerId | Player | Central player growth overview |
| Guardian Child Dashboard | /children/$playerId | Parent / Guardian | Consent-aware child progress overview |
| Coach Team Overview | /teams/$teamId | Coach | Team-level development overview |
| Organization Development Overview | /organizations/$orgId | Org Admin | Organization-level trends and support gaps |
| Player Identity & Profile | /football-id or /players/$playerId?view=overview | Player / Guardian / Coach | Identity, profile metadata, verification |
| Player Journey Timeline | /players/$playerId?view=journey | Player / Guardian / Coach | Longitudinal football story |
| Training Calendar | /schedule | Player / Coach / Guardian / Org Admin | Planned and upcoming sessions |
| Training Session Detail | /modules/training | Coach / Player | Session objectives and attendance |
| Attendance Dashboard | /modules/attendance | Coach / Guardian / Player | Attendance health and trends |
| Match Participation Dashboard | /players/$playerId?view=matches | Player / Coach | Recent and upcoming match summary |
| Development Assessment Workspace | /modules/development | Coach / Player | Competency scoring and review |
| Coach Observation Feed | /modules/development | Coach / Player | Notes and recommendations |
| Player Goals Board | /modules/development | Player / Coach | Goal progress and target tracking |
| Development Plan Workspace | /modules/development | Coach / Player | Long-term direction and revisions |
| Portfolio Overview | /players/$playerId?view=achievements or /modules/development | Player / Scout | Achievements and portfolio highlights |
| Achievement Detail | /players/$playerId?view=achievements | Player / Scout / Org Admin | Verified award and milestone details |
| Opportunity Dashboard | /modules/opportunities | Scout / Player | Consent-based scouting and opportunity management |
| Analytics Dashboard | /modules/analytics | Org Admin / Coach / Player | Derived trends and recommendations |
| AI Recommendations Panel | /modules/ai | Player / Coach / Guardian | Explainable next-step support |

## 3. Core screens

### 3.1 Player Development Dashboard
- Route: /players/$playerId or / (player view)
- Primary role: Player
- Purpose: central development overview
- Layout:
  - top summary card
  - current team and organization context
  - progress cards for competencies, goals, attendance, matches
  - recent journey timeline
  - achievements and next milestones
- Components:
  - PlayerHeader
  - StatCard
  - Section
  - JourneyTimeline
  - AchievementList
  - GoalList
- Data displayed:
  - profile summary
  - current team
  - attendance trend
  - goals status
  - competency highlights
  - recent milestones
- User actions:
  - review profile
  - view journey
  - open goals/assessments
  - inspect match history
- Loading state:
  - skeleton summary cards
- Empty state:
  - no goals, no assessments, no matches yet
- Error state:
  - profile unavailable or access denied
- Permission restrictions:
  - player sees own profile
  - coach sees assigned-player summary only
  - guardian sees consented child summary
- Responsive behavior:
  - stacked cards on mobile
  - summary and timeline prioritized first

### 3.2 Guardian Child Dashboard
- Route: /children/$playerId
- Primary role: Parent / Guardian
- Purpose: child-centric monitoring view
- Layout:
  - child overview card
  - development summary
  - attendance and training overview
  - goals and next actions
- Data displayed:
  - child identity
  - current team
  - schedule summary
  - attendance percent
  - feedback observations
- User actions:
  - review progress
  - check consent settings
  - follow-up with team
- Loading state:
  - skeleton summary and schedule cards
- Empty state:
  - child not linked or consent pending
- Error state:
  - inaccessible child profile or consent missing
- Permission restrictions:
  - guardian sees only linked child records

### 3.3 Coach Team Overview
- Route: /teams/$teamId
- Primary role: Coach
- Purpose: team monitoring and coaching context
- Layout:
  - team header
  - roster card group
  - attendance summary
  - upcoming sessions and matches
  - player development highlights
- Data displayed:
  - roster, attendance, performance, training events
- User actions:
  - review assigned players
  - create session
  - mark attendance
  - start assessment
- Permission restrictions:
  - coach sees only team-assigned players

### 3.4 Organization Development Overview
- Route: /organizations/$orgId
- Primary role: Org Admin
- Purpose: organization-level development status
- Layout:
  - overview KPI cards
  - team performance grid
  - attendance trend
  - player support list
- Data displayed:
  - team progress metrics, groups, support needs
- Permission restrictions:
  - org-scoped access only

## 4. Detailed screen map

### Screen: Player profile overview
- Route: /players/$playerId?view=overview
- Primary role: Player, Coach, Guardian
- Layout: summary, profile card, identity, team context
- Components: PlayerHeader, Section, StatusBadge, StatCard
- Data: identity, team, membership, verification
- Actions: open journey, edit profile, contact guardian

### Screen: Player journey timeline
- Route: /players/$playerId?view=journey
- Primary role: Player, Guardian, Coach
- Layout: chronological timeline with filters
- Components: journey timeline, filters
- Data: identity events, team changes, achievements, competitions
- Actions: filter by domain, inspect milestone

### Screen: Match participation history
- Route: /players/$playerId?view=matches
- Primary role: Player, Coach
- Layout: recent matches and performance cards
- Data: match participation, goals, assists, minutes

### Screen: Development summary
- Route: /players/$playerId?view=development
- Primary role: Player, Coach
- Layout: competency cards and trend summary
- Data: rubric scores, snapshots, progression

### Screen: Goals and progress
- Route: /modules/development
- Primary role: Player / Coach
- Layout: goal cards and progress tracker
- Data: goal status, due date, target, progress, competency linkage

### Screen: Development plans
- Route: /modules/development
- Primary role: Coach / Player
- Layout: plan cards, checklist, version history
- Data: plan status, milestones, revisions

### Screen: Assessment workspace
- Route: /modules/development
- Primary role: Coach / Player
- Layout: rubric form and review section
- Data: competency scores, evidence, comments

### Screen: Observation feed
- Route: /modules/development
- Primary role: Coach / Player
- Layout: comment stream and recommendation panel
- Data: notes, suggestions, date, context

### Screen: Portfolio and achievements
- Route: /players/$playerId?view=achievements
- Primary role: Player / Org Admin / Scout
- Layout: card list and verification badges
- Data: awards, milestones, portfolio artifacts

### Screen: Scouting view
- Route: /modules/scouting
- Primary role: Scout
- Layout: filtered discovery list and shortlists
- Data: consented profile subset

### Screen: Analytics dashboard
- Route: /modules/analytics
- Primary role: Org Admin / Coach
- Layout: KPI cards, charts, trends
- Data: attendance, growth, performance trend summary

### Screen: AI recommendations panel
- Route: /modules/ai
- Primary role: Player / Coach / Guardian
- Layout: recommendation feed and explainability panel
- Data: summary and recommendations only

## 5. Responsive requirements

- On mobile, prioritize player dashboard summary and journey cards.
- On tablet, show side-by-side competition and progress panels.
- On desktop, show full summary and detail layout with navigation persisted in app shell.
- Role-specific sections should collapse into a consistent layout rather than separate apps.

## 6. UI composition rules

- Use the existing design-system layer first: PageHeader, PageTabs, Section, StatusBadge, DataTable, EmptyState, PermissionState.
- Keep route files as thin entry points.
- Keep business rules in repository/domain logic rather than in components.
- Do not build parallel dashboard versions that duplicate the underlying player record.

## 7. Final principle

The player dashboard is the canonical experience; all other role dashboards are authorized views onto the same longitudinal player story.
