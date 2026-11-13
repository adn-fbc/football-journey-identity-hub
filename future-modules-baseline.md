# Future Modules Baseline

> Project baseline for every "Coming soon" module of the Youth Football Ecosystem Platform.
> Generated from `src/config/module-blueprints.ts` — edit that file, then run `bun scripts/generate-module-baseline.ts`.
> The same content is shown in the app at `/modules` and `/modules/<id>`.

## Guiding principles

1. **The player owns the journey.** Every module attaches records to a Football ID; organizations only hold relationships.
2. **One person, one account, many roles.** Modules declare which roles can use them in `src/config/modules.ts`.
3. **Single source of truth per record.** Each module owns the entities listed below and only *reads* the data it consumes.
4. **Journey events, not copies.** Modules publish events to the Football Journey timeline instead of duplicating history.
5. **Consent first for minors.** Guardians control visibility; nothing about a child is exposed beyond existing permissions.

## Rollout overview

| Wave | Theme | Goal | Modules |
| --- | --- | --- | --- |
| Wave 1 | Club operations | Give SSBs and academies the weekly tools they run on, producing trusted activity data for every Football ID. | [Attendance](#attendance), [Training](#training), [Player Development](#player-development), [Finance & Payments](#finance-payments) |
| Wave 2 | Professional networks | Bring coaches, referees and scouts onto the same identity layer and open consent-based pathways for players. | [Coach Platform](#coach-platform), [Referee Platform](#referee-platform), [Opportunities](#opportunities), [Scouting](#scouting) |
| Wave 3 | Governance & intelligence | Turn verified ecosystem data into regional and national infrastructure, reporting and assistance. | [Analytics](#analytics), [Association](#association), [Federation](#federation), [AI Assistant](#ai-assistant) |

## Dependency map

| Module | Wave | Depends on | Primary roles |
| --- | --- | --- | --- |
| Attendance | 1 | — | Coach, Organization Admin, Parent / Guardian |
| Training | 1 | Attendance | Coach, Organization Admin |
| Player Development | 1 | Attendance | Coach, Player, Parent / Guardian, Organization Admin |
| Finance & Payments | 1 | — | Organization Admin, Parent / Guardian |
| Coach Platform | 2 | Training | Coach |
| Referee Platform | 2 | — | Referee, Competition Organizer |
| Opportunities | 2 | — | Player, Parent / Guardian |
| Scouting | 2 | Player Development, Opportunities | Scout, Parent / Guardian, Organization Admin |
| Analytics | 3 | Attendance, Player Development | Organization Admin, Competition Organizer |
| Association | 3 | Analytics | Organization Admin, Competition Organizer |
| Federation | 3 | Association | Competition Organizer |
| AI Assistant | 3 | Analytics | Coach, Parent / Guardian, Organization Admin |

## Using this document in VS Code

- Each module below ends with **Acceptance criteria** (Given / When / Then) and an **Implementation checklist**.
- Work one module at a time in wave order, and only after its dependencies are live.
- Tick checklist items in your own copy or turn them into GitHub issues; the source list lives in the blueprint config.
- Paste a module's acceptance criteria into GitHub Copilot Chat as the requirement, and ask for tests first.
- A module is done when every acceptance criterion has a passing test and every checklist item is ticked.

## How to ship a module

1. Build the route(s) under `src/routes/` and the feature UI under `src/features/<module>/`, reusing `src/components/ds`.
2. In `src/config/modules.ts` set `status: "live"` and point `path` at the new route — sidebar, mobile bar and search update automatically.
3. Publish the module's journey events to the Football Journey timeline.
4. Keep the blueprint in sync (or remove it once the module is live) and re-generate this document.

---

# Wave 1 — Club operations

Give SSBs and academies the weekly tools they run on, producing trusted activity data for every Football ID.

## Attendance

**Check-ins & attendance rates** · Route: `/modules/attendance` · Wave 1

Fast check-in for training sessions and matches, with attendance history for players, guardians and coaches.

**Problem.** Most SSBs track attendance on paper or in chat groups, so coaches cannot see trends and guardians are not told when a child misses training.

### Who it serves
- **Coach** — Take attendance at the pitch in under a minute and see who is falling behind.
- **Organization Admin** — Monitor attendance rates per team and follow up on long absences.
- **Parent / Guardian** — Check a child in, report an absence in advance and see attendance history.

### Scope
**MVP**
- Coach roster check-in per session (present, late, excused, absent)
- Guardian and player self check-in within an authorized activity window
- Advance absence reporting with a reason
- Attendance rate per player and per team (last 30 days, season)

**Next**
- QR check-in at the venue
- Automatic guardian notification on unexcused absence
- Low-attendance alerts for coaches and admins

**Later**
- Offline check-in with sync
- Attendance export for association reporting

### Data it owns
| Entity | Description |
| --- | --- |
| AttendanceRecord | One person, one activity, one status, with who recorded it and when. |
| AbsenceNotice | An advance absence reported by a guardian or adult player. |
| AttendanceSummary | Derived rates per player and team; never edited by hand. |

### Data it reads (never owns)
- Schedule items (training and matches)
- Team rosters and active affiliations
- Guardian relationships and consent

### Football Journey events
- Attendance milestones (e.g. 50 sessions attended) as attendance_record events

### Privacy & consent
- Guardians see only their own linked children's records.
- Coaches see records only for teams they are assigned to.
- Attendance is evidence of participation, never a development score.

### Dependencies
_None — can start independently._

### Builds on (already in the app)
- Check-in page for players and guardians
- Attendance column in the organization workspace
- Schedule module

### Success metrics
- Share of sessions with attendance recorded
- Median time to complete a roster check-in
- Guardian absence notices submitted before the session

### Out of scope
- GPS or location tracking of minors
- Paying or penalizing based on attendance

### Acceptance criteria (first release)
1. **Given** a coach assigned to Garuda U10 opens today's training session, **when** they mark each rostered player present, late, excused or absent and save, **then** one AttendanceRecord per player is stored with the coach as recorder and a timestamp.
2. **Given** a guardian with a linked child and an open check-in window, **when** they check the child in, **then** the child's record shows present, recorded by the guardian, and a check-in outside the window is rejected with a clear message.
3. **Given** a guardian reports an absence with a reason before the session starts, **when** the coach opens the roster, **then** the child is pre-marked excused and the reason is visible to the coach only.
4. **Given** a player with 20 recorded sessions this season, **when** an admin opens the team attendance view, **then** the 30-day and season rates match the records, and excused sessions are not counted as absences.
5. **Given** a coach who is not assigned to a team, **when** they try to open that team's attendance, **then** access is denied and no records are shown.

### Implementation checklist
**Module-specific**
- [ ] Extend the existing check-in model (src/features/check-in) instead of creating a second check-in flow
- [ ] Derive AttendanceSummary from records in a pure function with unit tests; never store hand-edited rates
- [ ] Add an attendance tab to the team page and a summary to the guardian child card
- [ ] Add access rules (coach: assigned teams; guardian: linked children) with tests
- [ ] Publish milestone journey events (e.g. 50 sessions) from the summary, not on every check-in

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (none for this module)
- [ ] Add types for `AttendanceRecord`, `AbsenceNotice`, `AttendanceSummary` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/attendance-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/attendance/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/attendance` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `attendance` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## Training

**Session plans & drills** · Route: `/modules/training` · Wave 1

Session planning, a shared drill library and team training calendars for coaches.

**Problem.** Coaches plan sessions in notebooks, so assistants, admins and guardians cannot see what is trained and nothing carries over between seasons.

### Who it serves
- **Coach** — Plan a session from drills, assign it to a team and reuse it next week.
- **Organization Admin** — Keep a consistent club curriculum across age categories.

### Scope
**MVP**
- Training session planner (objective, duration, drills, equipment)
- Club drill library with age category and focus tags
- Assign sessions to team schedules
- Share plans with assistant coaches

**Next**
- Season and term curriculum templates
- Post-session coach notes
- Session load overview per team

**Later**
- Video and diagram attachments
- Shared drill library across organizations

### Data it owns
| Entity | Description |
| --- | --- |
| TrainingSession | A scheduled session for a team, linked to a schedule item. |
| SessionPlan | The reusable plan: objectives, blocks and drills. |
| Drill | A library item with focus area, age range and instructions. |
| Curriculum | An ordered set of plans for an age category and term. |

### Data it reads (never owns)
- Teams and coach assignments
- Schedule items
- Organization structure

### Football Journey events
- Training session participation summaries as training_session events (via Attendance)

### Privacy & consent
- Session plans belong to the organization and are visible to its staff only.
- No player-level data is stored in plans.

### Dependencies
- [Attendance](#attendance)

### Builds on (already in the app)
- Training schedule view in the organization workspace
- Schedule rows and calendar

### Success metrics
- Sessions planned before they happen
- Plans reused at least once
- Active coaches planning weekly

### Out of scope
- Physical load monitoring with wearables
- Paid drill marketplace

### Acceptance criteria (first release)
1. **Given** a coach with access to the club drill library, **when** they create a session plan with an objective, duration and at least one drill, **then** the plan is saved and the total duration equals the sum of its blocks.
2. **Given** a saved session plan, **when** the coach assigns it to Garuda U10 on a date, **then** a training item appears in the team schedule and on guardians' schedules for that team.
3. **Given** a plan used last week, **when** the coach duplicates it for next week, **then** a new independent plan is created and editing it does not change the original.
4. **Given** an assistant coach of the same team, **when** they open a shared plan, **then** they can view it, and can edit only if the head coach granted edit rights.
5. **Given** a guardian or player, **when** they open a team's training session, **then** they see the time, place and objective but not internal coach notes.

### Implementation checklist
**Module-specific**
- [ ] Link TrainingSession to an existing schedule item instead of duplicating date and venue fields
- [ ] Build the drill library with filters for age category and focus tags
- [ ] Build the session planner with drag-to-reorder blocks and a running duration total
- [ ] Add plan sharing rights (view or edit) for assistant coaches
- [ ] Make sure no player-level data is stored in plans or drills

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Attendance)
- [ ] Add types for `TrainingSession`, `SessionPlan`, `Drill`, `Curriculum` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/training-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/training/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/training` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `training` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## Player Development

**Skills, goals & progress** · Route: `/modules/development` · Wave 1

Competency-based development tracking: coach observations, periodic assessments, player goals and season reviews.

**Problem.** Feedback to young players is informal and lost when they change club; families never see structured progress.

### Who it serves
- **Coach** — Record quick observations and complete a periodic assessment against the competency framework.
- **Player** — Set personal goals and see feedback in plain language.
- **Parent / Guardian** — Read season reviews and support goals at home.
- **Organization Admin** — Ensure every player receives a review each term.

### Scope
**MVP**
- Coach observations linked to a session or match
- Assessment against the platform competency framework
- Player goals with progress status
- Season review shared with the player and guardians

**Next**
- Development plan per player
- Self-assessment for older players
- Review reminders for coaches

**Later**
- Portable development history across organizations with consent
- Comparison to age-category benchmarks

### Data it owns
| Entity | Description |
| --- | --- |
| CoachObservation | A short, dated note on a player linked to an activity. |
| DevelopmentAssessment | A formal rating against competencies for a period. |
| PlayerGoal | A goal owned by the player with status and target date. |
| SeasonReview | A published summary visible to the player and guardians. |

### Data it reads (never owns)
- Football ID and player profile
- Attendance and training records
- Match participation

### Football Journey events
- Published season reviews as development_assessment events
- Achieved goals as achievement events

### Privacy & consent
- Assessments are visible only to the player, linked guardians and the assessing organization.
- Observations inform assessments but are never published raw.
- Development data never becomes a public ranking.

### Dependencies
- [Attendance](#attendance)

### Builds on (already in the app)
- Player profile tabs
- Football Journey timeline (development_assessment and coach_observation sources)

### Success metrics
- Players with a review each term
- Guardians who open published reviews
- Goals with progress updates

### Out of scope
- Automated talent scores
- Sharing development data with scouts without consent

### Acceptance criteria (first release)
1. **Given** a coach assigned to a player's team, **when** they record an observation linked to a session or match, **then** the observation is saved against that activity and is not visible to the player or guardians.
2. **Given** an assessment period is open, **when** the coach rates a player against every competency in the framework and submits, **then** the assessment is stored as a draft until the coach publishes it.
3. **Given** a player who sets a goal with a target date, **when** the goal's status changes, **then** the change is shown on the player's profile and to linked guardians.
4. **Given** a coach publishes a season review, **when** a linked guardian opens the child's profile, **then** the review is readable in plain language and appears on the Football Journey timeline.
5. **Given** a user from another organization or a scout, **when** they open the player's development tab, **then** no assessments, observations or reviews are shown.

### Implementation checklist
**Module-specific**
- [ ] Follow the deeper player-development documents listed below; they are the source of truth for this module
- [ ] Load the competency framework from configuration, not hard-coded UI
- [ ] Build the observation quick-entry flow from the session and match pages
- [ ] Build the assessment form with draft and publish states
- [ ] Build goals and season review on the existing player profile tabs
- [ ] Add access rules for player, guardian, assessing organization and coach with tests

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Attendance)
- [ ] Add types for `CoachObservation`, `DevelopmentAssessment`, `PlayerGoal`, `SeasonReview` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/development-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/development/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/development` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `development` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

### Further documents
- [player-development-product-blueprint.md](./player-development-product-blueprint.md)
- [player-development-competency-framework.md](./player-development-competency-framework.md)
- [player-development-data-model.md](./player-development-data-model.md)
- [player-development-permission-model.md](./player-development-permission-model.md)
- [player-development-phase-1-specification.md](./player-development-phase-1-specification.md)

## Finance & Payments

**Fees, invoices & payouts** · Route: `/modules/finance` · Wave 1

Membership fees, invoices and payment status for organizations and guardians.

**Problem.** Fee collection is manual and tracked in spreadsheets; guardians lack clear invoices and admins cannot see who has paid.

### Who it serves
- **Organization Admin** — Set fee plans, issue invoices and see outstanding balances.
- **Parent / Guardian** — See what is owed for each child, pay and download receipts.

### Scope
**MVP**
- Fee plans per organization (monthly, term, registration)
- Invoices per player, payable by the linked guardian
- Manual payment recording with proof upload
- Outstanding balance overview

**Next**
- Digital payment (QRIS and virtual account) through a licensed provider
- Automatic reminders
- Receipts as PDF

**Later**
- Competition entry fees
- Financial reports for associations

### Data it owns
| Entity | Description |
| --- | --- |
| FeePlan | Price, period and the teams or categories it applies to. |
| Invoice | Amount owed for a player and period, with due date and status. |
| Payment | A recorded payment against one or more invoices. |

### Data it reads (never owns)
- Organization and team membership
- Guardian relationships
- Competition registrations

### Football Journey events
_Publishes no journey events._

### Privacy & consent
- Payment status never appears on a player's Football ID or public profile.
- Coaches do not see payment data.
- Unpaid fees never block a child's identity or journey record.

### Dependencies
_None — can start independently._

### Builds on (already in the app)
- Child payments shown in the guardian view (mock)

### Success metrics
- Invoices paid by the due date
- Time admins spend on fee follow-up
- Guardians paying digitally

### Out of scope
- Holding funds on the platform
- Loans or credit

### Acceptance criteria (first release)
1. **Given** an admin creates a monthly fee plan for Garuda U10, **when** invoices are generated for the month, **then** each active member of the team gets exactly one invoice with the plan's amount and due date.
2. **Given** a guardian with two linked children, **when** they open payments, **then** they see each child's invoices separately with the amount in Rupiah and the status.
3. **Given** an admin records a manual payment with proof, **when** the payment covers the invoice amount, **then** the invoice becomes paid and the outstanding balance drops by that amount.
4. **Given** a child with an overdue invoice, **when** anyone views the child's Football ID, journey or match pages, **then** no payment status is shown and the child can still be checked in and selected.
5. **Given** a coach, **when** they open the team or a player, **then** no fee or payment data is visible.

### Implementation checklist
**Module-specific**
- [ ] Store amounts as integer Rupiah; format with the existing format helpers
- [ ] Build fee plan setup, invoice list and outstanding balance overview for admins
- [ ] Build the guardian payments view per child with receipt download
- [ ] Add manual payment recording with proof upload
- [ ] Keep payment data out of every player, team and journey view (add a test that guards this)
- [ ] Do not start digital payments until a licensed provider is chosen

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (none for this module)
- [ ] Add types for `FeePlan`, `Invoice`, `Payment` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/finance-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/finance/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/finance` blueprint page, each with its own `head()`
- [ ] Confirm the module writes nothing to the Football Journey timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `finance` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

---

# Wave 2 — Professional networks

Bring coaches, referees and scouts onto the same identity layer and open consent-based pathways for players.

## Coach Platform

**Licences & coaching career** · Route: `/modules/coach` · Wave 2

A coaching career on the coach's own Football ID: licences, courses and coaching history across organizations.

**Problem.** Coaching qualifications and experience are scattered across paper certificates and cannot be verified by clubs.

### Who it serves
- **Coach** — Show verified licences and coaching history when joining a new club.

### Scope
**MVP**
- Licence records (e.g. PSSI/AFC levels) with expiry
- Coaching history from team assignments
- Verification by the issuing body

**Next**
- Course catalogue and enrolment
- Licence expiry reminders

**Later**
- Coach development credits (CPD)
- Coach availability for opportunities

### Data it owns
| Entity | Description |
| --- | --- |
| CoachLicence | Level, issuer, issue and expiry date, verification status. |
| CoachingAssignment | A dated assignment to a team, derived from Teams. |
| CourseEnrolment | A course the coach is taking or has completed. |

### Data it reads (never owns)
- Coach Football ID
- Team coach assignments
- Organization records

### Football Journey events
- Coach licence verified (on the coach's own journey)

### Privacy & consent
- The coach controls which licences and history are public.
- Safeguarding checks are visible only to authorized administrators.

### Dependencies
- [Training](#training)

### Builds on (already in the app)
- Coach role and assigned-team access rules
- Coach overview

### Success metrics
- Coaches with at least one verified licence
- Clubs viewing coach history when hiring

### Out of scope
- Coach employment contracts
- Salary handling

### Acceptance criteria (first release)
1. **Given** a coach adds a licence with level, issuer and expiry, **when** the issuing body verifies it, **then** the licence shows as verified on the coach's own Football ID.
2. **Given** a coach assigned to teams over several seasons, **when** they open their coaching history, **then** every assignment is listed with organization, team and dates, derived from Teams.
3. **Given** a licence that expired, **when** a club views the coach's profile, **then** the licence is marked expired and is no longer counted as valid.
4. **Given** a coach hides a licence from the public profile, **when** another organization views the profile, **then** that licence is not shown.

### Implementation checklist
**Module-specific**
- [ ] Add coach licences and history to the coach's existing Football ID page
- [ ] Derive CoachingAssignment from team coach assignments; never let users edit it directly
- [ ] Add licence verification states (pending, verified, expired, rejected) using the status system
- [ ] Add per-item public or private visibility controls for the coach
- [ ] Keep safeguarding checks visible only to authorized administrators

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Training)
- [ ] Add types for `CoachLicence`, `CoachingAssignment`, `CourseEnrolment` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/coach-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/coach/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/coach` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `coach` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## Referee Platform

**Assignments & match reports** · Route: `/modules/referee` · Wave 2

Match assignments, digital match reports and referee development for referees and organizers.

**Problem.** Referee appointments are arranged by phone and match reports are on paper, which delays results and disciplinary decisions.

### Who it serves
- **Referee** — Accept assignments and submit the official match report from the pitch.
- **Competition Organizer** — Appoint referees to fixtures and confirm results from reports.

### Scope
**MVP**
- Referee pool per competition
- Assign and accept match appointments
- Digital match report (score, cards, incidents)

**Next**
- Availability calendar
- Organizer confirmation of reports into results

**Later**
- Referee assessments
- Licence and fitness test records

### Data it owns
| Entity | Description |
| --- | --- |
| RefereeAppointment | A referee assigned to a match in a role (main, assistant). |
| MatchReport | The official record of a match submitted by the referee. |
| RefereeAssessment | A performance review by an assessor. |

### Data it reads (never owns)
- Matches and competitions
- Team sheets
- Referee Football ID

### Football Journey events
- Confirmed match reports feed match events on players' journeys

### Privacy & consent
- Disciplinary details are visible to organizers and the teams involved only.
- Assessments are private to the referee and assessors.

### Dependencies
_None — can start independently._

### Builds on (already in the app)
- Referee role
- Match detail with event timeline

### Success metrics
- Matches with a digital report
- Time from final whistle to confirmed result

### Out of scope
- Referee payments
- Live video review

### Acceptance criteria (first release)
1. **Given** an organizer with a referee pool for a competition, **when** they appoint a main referee and two assistants to a match, **then** each referee receives an appointment they can accept or decline.
2. **Given** a referee declines an appointment, **when** the organizer opens the fixture, **then** the slot shows as open again.
3. **Given** the appointed main referee after the final whistle, **when** they submit the match report with score, cards and incidents, **then** the report is stored as submitted and the match shows 'result pending confirmation'.
4. **Given** a submitted report, **when** the organizer confirms it, **then** the match result and events update, and standings recalculate.
5. **Given** a parent or a team not involved in the match, **when** they open the match, **then** disciplinary details from the report are not shown.

### Implementation checklist
**Module-specific**
- [ ] Add referee pool management to competition pages for organizers
- [ ] Build appointment accept and decline for the referee role
- [ ] Build the mobile-first match report form, starting from the existing match event timeline
- [ ] Route confirmed reports into results and the existing standings calculation
- [ ] Add access rules for disciplinary details with tests

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (none for this module)
- [ ] Add types for `RefereeAppointment`, `MatchReport`, `RefereeAssessment` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/referee-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/referee/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/referee` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `referee` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## Opportunities

**Trials, camps & scholarships** · Route: `/modules/opportunities` · Wave 2

Trials, selection camps and scholarships that players can apply to with their Football ID.

**Problem.** Opportunities are shared in chat groups and reach only well-connected families; applications are repeated paperwork.

### Who it serves
- **Player** — Find opportunities for my age and position and apply with my Football ID.
- **Parent / Guardian** — Approve a child's application and see its status.

### Scope
**MVP**
- Opportunity listings by organizations
- Eligibility by age category, gender and region
- Apply with Football ID; guardian approval for minors

**Next**
- Application status tracking
- Shortlist and invitations

**Later**
- Scholarship programs with sponsors
- Recommendations based on the journey

### Data it owns
| Entity | Description |
| --- | --- |
| Opportunity | A trial, camp or scholarship with dates, eligibility and capacity. |
| Application | A player's application, with guardian approval and status. |

### Data it reads (never owns)
- Football ID and journey
- Guardian consent
- Organization records

### Football Journey events
- Selection for a camp or academy as an achievement event

### Privacy & consent
- Applicants share only the profile sections they choose.
- Minors cannot apply without guardian approval.
- Rejected applications are never visible to other organizations.

### Dependencies
_None — can start independently._

### Builds on (already in the app)
- Guardian consent grants
- Football ID passport

### Success metrics
- Applications per opportunity
- Applicants from outside the host organization
- Guardian approval time

### Out of scope
- Paid placement fees
- Agent representation

### Acceptance criteria (first release)
1. **Given** an organization publishes a U12 trial for players born 2014-2015 in South Sulawesi, **when** a player outside that range browses, **then** the trial is shown as not eligible with the reason.
2. **Given** an eligible minor applies with their Football ID, **when** the application is submitted, **then** it stays 'awaiting guardian approval' and the host organization cannot see it yet.
3. **Given** a guardian approves the application, **when** the host organization opens applicants, **then** they see only the profile sections the family chose to share.
4. **Given** an application is rejected, **when** another organization views the player, **then** the rejection is not visible anywhere.
5. **Given** an opportunity reaches its capacity, **when** another player tries to apply, **then** applying is closed and the listing shows it is full.

### Implementation checklist
**Module-specific**
- [ ] Build opportunity listing and detail pages with eligibility checks as a tested pure function
- [ ] Build the apply flow with share-section selection
- [ ] Add guardian approval through the existing consent and notification patterns
- [ ] Build application status tracking for families and an applicant list for the host
- [ ] Publish a selection as an achievement journey event

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (none for this module)
- [ ] Add types for `Opportunity`, `Application` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/opportunities-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/opportunities/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/opportunities` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `opportunities` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## Scouting

**Consent-based talent discovery** · Route: `/modules/scouting` · Wave 2

Consent-based talent discovery for verified scouts, with guardian-approved contact.

**Problem.** Scouting of minors happens informally with no consent, verification or protection for families.

### Who it serves
- **Scout** — Discover players who opted in and request contact through the platform.
- **Parent / Guardian** — Decide whether a child is discoverable and approve each contact request.
- **Organization Admin** — See and approve scout interest in the club's players.

### Scope
**MVP**
- Verified scout accounts
- Player discoverability opt-in (guardian consent for minors)
- Contact requests routed through guardian and club

**Next**
- Scout watchlists
- Match attendance requests

**Later**
- Scouting reports shared with consent
- Cross-region discovery

### Data it owns
| Entity | Description |
| --- | --- |
| ScoutVerification | Verified identity and affiliation of a scout. |
| DiscoverabilitySetting | What a player exposes to scouts, set by player or guardian. |
| ContactRequest | A scout's request to contact a player, with approvals. |

### Data it reads (never owns)
- Football ID
- Verified achievements and match history
- Guardian consent grants

### Football Journey events
_Publishes no journey events._

### Privacy & consent
- Players under 18 are hidden from scouts by default.
- Scouts never see contact details; all contact goes through the platform.
- Every scout view of a profile is logged and visible to the guardian.

### Dependencies
- [Player Development](#player-development)
- [Opportunities](#opportunities)

### Builds on (already in the app)
- Scout role
- Privacy & Consent controls in My Children

### Success metrics
- Contact requests approved
- Guardian complaints (target zero)

### Out of scope
- Transfer negotiation
- Public talent rankings

### Acceptance criteria (first release)
1. **Given** a player under 18 with no guardian opt-in, **when** a verified scout searches, **then** the player never appears in results.
2. **Given** an unverified scout account, **when** it tries to search or view profiles, **then** access is denied until verification is complete.
3. **Given** a guardian turns on discoverability for selected profile sections, **when** a verified scout views the child, **then** only those sections are shown and no contact details are visible.
4. **Given** a scout sends a contact request, **when** the guardian and club review it, **then** contact is only opened after both approve, and either can decline.
5. **Given** a scout views a child's profile, **when** the guardian opens consent settings, **then** the view is listed with the scout's name, affiliation and date.

### Implementation checklist
**Module-specific**
- [ ] Build scout verification before any discovery feature
- [ ] Connect discoverability to the existing Privacy & Consent controls in My Children (default off for minors)
- [ ] Build discovery search over opted-in players only, filtered on the server side
- [ ] Build the contact request flow with guardian and club approvals
- [ ] Add a profile view log visible to guardians
- [ ] Add access tests that prove hidden players never leak into results

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Player Development, Opportunities)
- [ ] Add types for `ScoutVerification`, `DiscoverabilitySetting`, `ContactRequest` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/scouting-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/scouting/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/scouting` blueprint page, each with its own `head()`
- [ ] Confirm the module writes nothing to the Football Journey timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `scouting` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

---

# Wave 3 — Governance & intelligence

Turn verified ecosystem data into regional and national infrastructure, reporting and assistance.

## Analytics

**Insights across your data** · Route: `/modules/analytics` · Wave 3

Insights for organizations and organizers across attendance, development, competitions and membership.

**Problem.** Clubs and organizers have data in the platform but no way to answer simple questions about growth, retention and results.

### Who it serves
- **Organization Admin** — Track retention, attendance and development coverage across teams.
- **Competition Organizer** — See participation, results and fair-play trends across a competition.

### Scope
**MVP**
- Organization dashboard: members, retention, attendance
- Competition dashboard: participation and results

**Next**
- Player pathway analytics (category to category)
- Exportable reports (CSV, PDF)

**Later**
- Benchmarks across organizations (anonymized)
- Custom report builder

### Data it owns
| Entity | Description |
| --- | --- |
| MetricSnapshot | Pre-computed metrics per organization or competition and period. |
| ReportDefinition | A saved report with filters and columns. |

### Data it reads (never owns)
- All source domains (read-only)

### Football Journey events
_Publishes no journey events._

### Privacy & consent
- Analytics are derived and never overwrite official records.
- Cross-organization benchmarks use anonymized, aggregated data only.
- Small groups (fewer than 5 players) are not shown individually in aggregates.

### Dependencies
- [Attendance](#attendance)
- [Player Development](#player-development)

### Builds on (already in the app)
- Organization and competition dashboards with stat cards
- Standings calculation

### Success metrics
- Admins opening analytics monthly
- Reports exported

### Out of scope
- Selling data to third parties
- Individual player rankings

### Acceptance criteria (first release)
1. **Given** an organization admin, **when** they open analytics for the last season, **then** member count, retention and attendance rate match the source records.
2. **Given** a competition organizer, **when** they open competition analytics, **then** participation by category and results match the competition's matches.
3. **Given** a filter that leaves fewer than 5 players in a group, **when** the dashboard renders, **then** that group is hidden or merged and no individual values are shown.
4. **Given** an admin exports a report, **when** the export completes, **then** the file contains the same numbers as the screen and no player contact details.

### Implementation checklist
**Module-specific**
- [ ] Compute metrics in pure, tested functions from repository data; never write back to source records
- [ ] Build organization and competition dashboards with the existing stat card and data table components
- [ ] Apply the small-group (fewer than 5) rule in one shared helper with tests
- [ ] Add CSV export in the Next release
- [ ] Make sure each role only sees metrics for organizations or competitions it manages

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Attendance, Player Development)
- [ ] Add types for `MetricSnapshot`, `ReportDefinition` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/analytics-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/analytics/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/analytics` blueprint page, each with its own `head()`
- [ ] Confirm the module writes nothing to the Football Journey timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `analytics` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## Association

**Regional governance** · Route: `/modules/association` · Wave 3

Regional governance for city and provincial associations: club registry, sanctioning and licensing.

**Problem.** Associations keep club and competition records separately from clubs, so registration and sanctioning are slow and hard to verify.

### Who it serves
- **Organization Admin** — Register the organization with the association and keep its status valid.
- **Competition Organizer** — Request sanctioning for a competition and receive approval.

### Scope
**MVP**
- Organization registration and renewal with the association
- Competition sanctioning requests
- Status visible on organization and competition pages

**Next**
- Organization licensing criteria checklist
- Association announcements

**Later**
- Regional disciplinary records
- Association fee collection (via Finance)

### Data it owns
| Entity | Description |
| --- | --- |
| OrganizationRegistration | An organization's registration with an association, with validity. |
| SanctionRequest | A competition's request for official approval. |
| LicenceCriterion | A requirement an organization must meet. |

### Data it reads (never owns)
- Organizations and competitions
- Membership and Digital KTA
- Association workspace

### Football Journey events
- Participation in sanctioned competitions marked as verified on players' journeys

### Privacy & consent
- Associations see organization-level data; player data only as needed for registration.
- Every approval is recorded with who approved and when.

### Dependencies
- [Analytics](#analytics)

### Builds on (already in the app)
- Association role workspace
- Member directory, membership review and Digital KTA
- Competition oversight

### Success metrics
- Organizations registered
- Median time to sanction a competition

### Out of scope
- Replacing national federation systems
- Legal entity registration

### Acceptance criteria (first release)
1. **Given** an organization admin submits a registration with the provincial association, **when** the association approves it, **then** the organization page shows 'Registered' with the validity end date.
2. **Given** a registration whose validity has ended, **when** anyone views the organization, **then** the status shows as expired and the admin sees a renewal prompt.
3. **Given** an organizer requests sanctioning for Makassar Youth Cup 2027, **when** the association approves it, **then** the competition shows 'Sanctioned' and the approval records who approved and when.
4. **Given** an association official, **when** they review an organization, **then** they see organization-level data and only the player data needed for registration.

### Implementation checklist
**Module-specific**
- [ ] Build on the existing association workspace, member directory, membership review and Digital KTA
- [ ] Build organization registration and renewal with validity dates
- [ ] Build competition sanctioning requests and the approval queue
- [ ] Show registration and sanction status on organization and competition pages using the status system
- [ ] Record every approval with approver and timestamp (audit trail)

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Analytics)
- [ ] Add types for `OrganizationRegistration`, `SanctionRequest`, `LicenceCriterion` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/association-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/association/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/association` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `association` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## Federation

**National registry & licensing** · Route: `/modules/federation` · Wave 3

A national player registry with transfers, eligibility checks and federation-wide reporting.

**Problem.** Eligibility and transfers between clubs are checked manually, which allows age fraud and duplicate registrations.

### Who it serves
- **Competition Organizer** — Check player eligibility against the national registry before a match.

### Scope
**MVP**
- Registry sync of verified Football IDs
- Eligibility check (age category, registration, suspension)

**Next**
- Transfer requests between organizations
- Duplicate identity detection

**Later**
- Integration with national federation systems
- Federation-wide reporting

### Data it owns
| Entity | Description |
| --- | --- |
| RegistryEntry | A verified player's national registration record. |
| Transfer | A move between organizations with approvals and dates. |
| EligibilityCheck | A logged check of a player for a competition category. |

### Data it reads (never owns)
- Football ID verification
- Affiliations
- Association registrations

### Football Journey events
- Approved transfers as join and leave events
- Registry verification as a verification event

### Privacy & consent
- Identity documents are visible only to verifying officials.
- Transfers require the player's (or guardian's) confirmation.

### Dependencies
- [Association](#association)

### Builds on (already in the app)
- Football ID verification status
- Affiliation history on the journey

### Success metrics
- Eligibility disputes per competition
- Duplicate identities detected

### Out of scope
- Professional contract registration
- International transfers

### Acceptance criteria (first release)
1. **Given** a player with a verified Football ID, **when** the registry sync runs, **then** exactly one registry entry exists for that player.
2. **Given** an organizer checks a team sheet before a U10 match, **when** a player is too old, unregistered or suspended, **then** the player is flagged with the reason and the check is logged.
3. **Given** a transfer request between two organizations, **when** the player (or guardian) has not confirmed, **then** the transfer cannot be approved.
4. **Given** an approved transfer, **when** anyone views the player's journey, **then** it shows a leave event for the old organization and a join event for the new one with the same date.

### Implementation checklist
**Module-specific**
- [ ] Build the registry entry for verified Football IDs only
- [ ] Build the eligibility check as a tested pure function (age category, registration, suspension)
- [ ] Add eligibility flags to team sheets in competition pages
- [ ] Build the transfer flow with player or guardian confirmation and both organizations' approvals
- [ ] Keep identity documents visible only to verifying officials

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Association)
- [ ] Add types for `RegistryEntry`, `Transfer`, `EligibilityCheck` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/federation-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/federation/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/federation` blueprint page, each with its own `head()`
- [ ] Publish the Football Journey events listed above to the player timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `federation` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

## AI Assistant

**Ask anything about your football data** · Route: `/modules/ai` · Wave 3

An assistant that answers questions about your own football data and drafts summaries, within your permissions.

**Problem.** Useful information is spread across modules; busy coaches and guardians need quick answers and summaries.

### Who it serves
- **Coach** — Ask who missed training this month or draft session ideas.
- **Parent / Guardian** — Get a plain-language summary of a child's month.
- **Organization Admin** — Ask for quick operational summaries before meetings.

### Scope
**MVP**
- Questions answered from data the user can already see
- Summaries of a player's month for guardians
- Every answer shows its sources

**Next**
- Draft session plans from the drill library
- Lineup suggestions based on availability

**Later**
- Bahasa Indonesia voice input
- Proactive weekly digests

### Data it owns
| Entity | Description |
| --- | --- |
| AssistantConversation | A user's conversation, private to them. |
| AssistantAnswer | A response with the records it was based on. |

### Data it reads (never owns)
- Any domain, strictly through the user's existing permissions

### Football Journey events
_Publishes no journey events._

### Privacy & consent
- The assistant can only read what the signed-in user is allowed to see.
- Suggestions are advisory and never change official records.
- Children's data is never used to train external models.

### Dependencies
- [Analytics](#analytics)

### Builds on (already in the app)
- Role-based access rules for coaches, guardians and associations

### Success metrics
- Answers rated helpful
- Answers with correct sources

### Out of scope
- Automated selection or talent decisions
- Medical advice

### Acceptance criteria (first release)
1. **Given** a coach asks 'who missed training this month?', **when** the assistant answers, **then** the answer lists only players from teams the coach is assigned to and links to the source records.
2. **Given** a guardian asks for a summary of a child's month, **when** the assistant answers, **then** it covers only that guardian's linked children and is written in plain language.
3. **Given** a user asks about data they cannot see, **when** the assistant answers, **then** it says it cannot access that information and reveals nothing.
4. **Given** the assistant suggests a lineup or session, **when** the user does nothing, **then** no official record is changed.

### Implementation checklist
**Module-specific**
- [ ] Route every assistant data read through the same access rules the pages use
- [ ] Run model calls on the server only, through the Lovable AI gateway
- [ ] Show sources under every answer
- [ ] Store conversations privately per user
- [ ] Add tests that prove cross-role leaks are impossible before launch

**Standard steps**
- [ ] Confirm every module in "Depends on" is live (Analytics)
- [ ] Add types for `AssistantConversation`, `AssistantAnswer` to `src/data/types.ts`
- [ ] Add realistic fictional mock data to `src/data/mock.ts` and expose it only through `src/data/repository.ts`
- [ ] Write access rules in `src/lib/ai-access.ts` with tests, covering every Privacy & consent rule
- [ ] Build the UI in `src/features/ai/` from `src/components/ds` and the existing status system; mobile-first for players and guardians
- [ ] Create the route files that replace the `/modules/ai` blueprint page, each with its own `head()`
- [ ] Confirm the module writes nothing to the Football Journey timeline
- [ ] Add loading, empty and error states for every new screen
- [ ] Turn each acceptance criterion below into at least one test and make them pass (`bunx vitest run`)
- [ ] Set `status: "live"` and the new `path` for `ai` in `src/config/modules.ts`, remove its blueprint, and re-generate this document

