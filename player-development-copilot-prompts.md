# Player Development Copilot Implementation Prompts

## Prompt 1 — Phase 1: Player Identity & Journey Foundation

### Objective
Implement a production-ready player identity and journey foundation aligned to the current app architecture.

### Existing architecture context
- Use the current route, repository, and role patterns already present in [src/routes](src/routes), [src/data/repository.ts](src/data/repository.ts), and [src/config/roles.ts](src/config/roles.ts).
- Preserve the current app shell and navigation.

### Files to inspect
- [src/config/roles.ts](src/config/roles.ts)
- [src/data/repository.ts](src/data/repository.ts)
- [src/data/types.ts](src/data/types.ts)
- [src/routes/players.$playerId.tsx](src/routes/players.$playerId.tsx)
- [src/features/players](src/features/players)

### Business requirements
- Create a stable player identity layer.
- Keep player journey continuous across organizations and seasons.
- Distinguish identity ownership from organization or team context.

### Implementation requirements
- Add repository selectors for player profile and journey.
- Keep all route logic thin and consistent.
- Use the shared UI patterns already in the app.

### Integration requirements
- Integrate with current player and journey models only.
- Do not create a second player source domain.

### Permission requirements
- player sees own identity and journey
- guardian sees consented child context
- coach sees only assigned-player context

### Testing requirements
- player profile route renders
- permission restrictions work
- journey shows historical continuity

### Acceptance criteria
- a player keeps one identity across team changes
- journey records reference source evidence and remain continuous

### Restrictions
- no new architectural pattern
- no database migrations
- no premature future module activation

### Final reporting requirements
Provide a summary of repository changes, role restrictions, and validation coverage.

---

## Prompt 2 — Phase 2: Training & Attendance Integration

### Objective
Add a training and attendance layer that integrates with the player development model without becoming a duplicate source domain.

### Existing architecture context
- Follow the current route and repository patterns and the existing team / schedule structures.

### Files to inspect
- [src/data/repository.ts](src/data/repository.ts)
- [src/data/mock.ts](src/data/mock.ts)
- [src/config/modules.ts](src/config/modules.ts)
- [src/routes](src/routes)
- [src/components/ds](src/components/ds)

### Business requirements
- session plans and attendance must connect to player progress without replacing official assessments
- attendance is evidence, not a final judgment

### Implementation requirements
- add domain selectors for sessions and attendance
- respect the current app shell and route composition model

### Integration requirements
- connect training and attendance to team and player context
- keep source-of-truth boundaries clear

### Permission requirements
- coach can record session attendance in assigned team scope
- guardian sees consented child attendance
- player sees own records only

### Testing requirements
- route renders for training and attendance views
- permission-gated attendance display works
- attendance is linkable to a specific session context

### Acceptance criteria
- session planning and attendance remain connected and attributed
- no attendance record becomes an official assessment

### Restrictions
- no duplicate player storage
- no activation of unrelated modules

### Final reporting requirements
Report dependency mapping, repository changes, and validation coverage.

---

## Prompt 3 — Phase 3: Development Competency Framework

### Objective
Implement the player development competency framework and assessment support model.

### Existing architecture context
- This must remain consistent with the current repository pattern and role-aware UI.

### Files to inspect
- [src/data/types.ts](src/data/types.ts)
- [src/data/repository.ts](src/data/repository.ts)
- [src/config/roles.ts](src/config/roles.ts)
- [src/features/players](src/features/players)

### Business requirements
- define technical, tactical, physical, psychological, and social competencies
- keep progress measured longitudinally across time
- ensure every rating is evidence-driven

### Implementation requirements
- add competency model and repository selectors
- support historical snapshots and evidence references

### Integration requirements
- connect competencies to player goals, plans, assessments, and observations

### Permission requirements
- coach and designated review roles can assess in scope
- player can view own competency progress
- guardian sees consented child development view

### Testing requirements
- competency list renders with correct labels
- progress over time remains consistent
- single-score rating does not dominate the full picture

### Acceptance criteria
- competency model supports longitudinal development tracking
- evidence requirements are preserved

### Restrictions
- no replacement of player profile or source-of-truth role
- no AI or analytics replacement for official assessment

### Final reporting requirements
Report framework design, evidence requirements, and quality checks.

---

## Prompt 4 — Phase 4: Coach Observation & Assessment Workflow

### Objective
Add coach observations and formal assessment workflow while a clear distinction remains between notes and official assessments.

### Existing architecture context
- Preserve the current player profile and team-design pattern.

### Files to inspect
- [src/features/players](src/features/players)
- [src/data/repository.ts](src/data/repository.ts)
- [src/config/modules.ts](src/config/modules.ts)
- [src/config/roles.ts](src/config/roles.ts)

### Business requirements
- coach can log observations and recommendations
- assessment lifecycle includes evidence, review, and verification
- observations remain distinct from official assessment records

### Implementation requirements
- add observation and assessment repository support
- keep UI distinction explicit for informal vs formal records

### Integration requirements
- connect to training and match context
- link to competency and player journey

### Permission requirements
- coach writes assigned-player observations and assessments
- verification authority must be higher trust than general note-taking

### Testing requirements
- observation renders under proper scope
- formal assessment has verification state
- observation does not become automatic verification

### Acceptance criteria
- informal observation stays separate from formal assessment
- evidence and reviewer are preserved in audit metadata

### Restrictions
- no hidden permission bypass
- no duplicate official record creation

### Final reporting requirements
Provide a status summary of assessment lifecycle, evidence traceability, and permission gating.

---

## Prompt 5 — Phase 5: Player Goals & Development Plans

### Objective
Add goals and structured development plans while keeping player ownership and evidence-driven progress at the center.

### Existing architecture context
- Follow the repository and component patterns used by the existing player profile and overview screens.

### Files to inspect
- [src/data/repository.ts](src/data/repository.ts)
- [src/features/players](src/features/players)
- [src/routes/players.$playerId.tsx](src/routes/players.$playerId.tsx)
- [src/config/modules.ts](src/config/modules.ts)

### Business requirements
- players create personal goals
- coaches support and track plan progress
- goals must be connected to competencies and evidence

### Implementation requirements
- add goal and plan data contracts
- keep revision and progress tracking versioned
- preserve full historical plan context

### Integration requirements
- tie goals and plans back to assessment and journey data

### Permission requirements
- player owns personal goals
- coach may support in team scope
- guardian sees consented child plan only

### Testing requirements
- goal and plan creation flows work under role scope
- progress and revision represent real state changes

### Acceptance criteria
- the player sees a coherent development plan and goal list
- no duplicate record creation occurs across modules

### Restrictions
- no direct mock bypass in route or UI logic
- no plan version overwrite without a preserved history

### Final reporting requirements
Report the plan and goal lifecycle, repository contracts, and access boundaries.

---

## Prompt 6 — Phase 6: Match Performance Integration

### Objective
Integrate official match performance into the player development workflow without creating duplicate match ownership.

### Existing architecture context
- Preserve the existing competition and match domain already implemented in [src/data/mock.ts](src/data/mock.ts) and the match routes.

### Files to inspect
- [src/data/mock.ts](src/data/mock.ts)
- [src/data/types.ts](src/data/types.ts)
- [src/data/repository.ts](src/data/repository.ts)
- [src/routes](src/routes)

### Business requirements
- match participation data is connected to player development evidence
- player summary uses match context but cannot rewrite official match records

### Implementation requirements
- create repository selectors for player match history and summaries
- ensure match data remains authoritative within its own domain

### Integration requirements
- connect match participation to player journey and portfolio

### Permission requirements
- player sees own match data
- coach/org admin see team match context
- scouts see only consented, narrow subset

### Testing requirements
- player match history renders correctly
- match context stays read-only from the player development side

### Acceptance criteria
- player development uses match evidence without duplicating source-of-truth data

### Restrictions
- no direct rewrite of match facts through UI actions

### Final reporting requirements
Summary must include match data source ownership, evidence flow, and permission restrictions.

---

## Prompt 7 — Phase 7: Player Portfolio & Achievements

### Objective
Implement a trusted player portfolio and achievement layer using source-backed evidence.

### Existing architecture context
- Follow the current player profile structure and repository access patterns.

### Files to inspect
- [src/data/repository.ts](src/data/repository.ts)
- [src/data/mock.ts](src/data/mock.ts)
- [src/features/players](src/features/players)
- [src/routes/players.$playerId.tsx](src/routes/players.$playerId.tsx)

### Business requirements
- show verified and unverified achievements
- preserve milestones and competition history
- keep portfolio as a curated trust layer rather than an independent source

### Implementation requirements
- add achievement and portfolio repository selectors
- ensure verification states are visible

### Integration requirements
- link achievement records to journey, matches, and assessments

### Permission requirements
- player manages own portfolio visibility
- guardian sees consented child portfolio
- scout sees only authorized subset

### Testing requirements
- verified and unverified items render differently
- route-level access remains correct

### Acceptance criteria
- portfolio remains sourced and explainable
- achievement verification is explicit

### Restrictions
- no fake “official” badges without clear source ownership

### Final reporting requirements
Report achievement verification flow and portfolio visibility rules.

---

## Prompt 8 — Phase 8: Scouting & Opportunities

### Objective
Build scouting and opportunities as consumer-only flows using authorized player data and explicit consent rules.

### Existing architecture context
- Respect the current coming-soon module gating and role model.

### Files to inspect
- [src/config/modules.ts](src/config/modules.ts)
- [src/config/roles.ts](src/config/roles.ts)
- [src/data/repository.ts](src/data/repository.ts)
- [src/lib](src/lib)

### Business requirements
- scouts can discover consented players and opportunities
- opportunities are linked to authorized player summaries only
- no membership or development record is rewritten by scouting

### Implementation requirements
- create a consumer-facing scouting module with scoped access
- maintain read-only behavior except for opportunity workflow actions

### Integration requirements
- use player identity, portfolio, and achievement data only

### Permission requirements
- scout requires consent and scope
- no access without role + consent + permission boundaries

### Testing requirements
- scouting list shows only eligible players
- opportunity actions respect role and consent

### Acceptance criteria
- scouting is a consumer, not source domain
- player data integrity is preserved

### Restrictions
- no replacement of the player identity record
- no duplicate or hidden profile stores

### Final reporting requirements
Provide the permission matrix, data access model, and consumer-only architecture summary.

---

## Prompt 9 — Phase 9: Analytics & AI Development Intelligence

### Objective
Build analytics and AI recommendation features as downstream intelligence layers using approved, authorized source data.

### Existing architecture context
- Follow the current role-aware repo + route + UI pattern and preserve the current shell.

### Files to inspect
- [src/data/repository.ts](src/data/repository.ts)
- [src/config/modules.ts](src/config/modules.ts)
- [src/config/roles.ts](src/config/roles.ts)
- [src/routes](src/routes)

### Business requirements
- derive player and team trends from trusted source data
- provide explainable recommendations that do not overwrite official records
- clearly label derived insights as non-authoritative

### Implementation requirements
- create derived analytics summaries and recommendation surfaces
- keep output labels explicit and explainable

### Integration requirements
- connect analytics and AI to development, training, attendance, and assessment data

### Permission requirements
- role and consent constraints must be preserved
- AI cannot bypass access controls

### Testing requirements
- analytics output is traceable to source data
- AI recommendations require permitted context
- UI clearly distinguishes recommendation from official record

### Acceptance criteria
- analytics and AI remain downstream of source domains
- no official assessment or player profile is rewritten by intelligence layer

### Restrictions
- no source-domain creation or duplicated ownership
- no hidden access to non-approved data

### Final reporting requirements
Report the derived-data model, explainability design, and evidence traceability.

---

## Cross-phase Prompt — Implementation Sequence Validation

### Objective
Verify that the implementation sequence preserves architecture and domain ownership.

### Existing architecture context
- Use the current repository boundary and shell architecture as the contract.

### Files to inspect
- [architecture.md](architecture.md)
- [src/data/repository.ts](src/data/repository.ts)
- [src/config/modules.ts](src/config/modules.ts)
- [src/config/roles.ts](src/config/roles.ts)
- [src/router.tsx](src/router.tsx)

### Business requirements
- confirm all phases are implemented in dependency order
- maintain player-centric long-term continuity
- keep source-of-truth ownership explicit

### Implementation requirements
- check each feature against its domain owner
- verify each screen and API route matches the permission model
- verify no module bypasses repository pattern

### Testing requirements
- run the relevant test and build checks after each phase
- validate no production source modifications beyond the approved documentation or future-coded feature scope

### Acceptance criteria
- implementation order is stable and justified by source-of-truth and dependency logic
- no product duplication or architecture drift occurs

### Restrictions
- do not activate future modules before their domain and permission models are complete

### Final reporting requirements
Provide an architecture compliance summary and a dependency validity check.
