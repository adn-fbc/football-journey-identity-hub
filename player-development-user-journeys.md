# Player Development User Journeys

## 1. Player journey: from registration to lifelong development

### Phase 1 — Registration and football identity
1. Player creates profile or is registered by guardian.
2. System creates Football ID and initial identity record.
3. Player is assigned to an organization and initial team context.
4. Verification and consent state is established.
5. System responds with a complete but permission-limited profile view.

Required permissions:
- player can view own profile
- guardian can create and approve consented registration
- org admin can assign player to team scope

### Phase 2 — Team and training participation
1. Player views team assignment and training calendar.
2. Player sees upcoming sessions and attendance expectations.
3. Coach records training session and player attendance.
4. Player sees attendance and session details.
5. System links training data to current development goals.

Required permissions:
- coach writes attendance in team scope
- player reads own attendance and upcoming sessions
- guardian reads consented child schedule

### Phase 3 — Match and performance evidence
1. Player checks upcoming and completed matches.
2. System presents match participation, stats, and role summary.
3. Player can review goals, assists, minutes played, and key events.
4. Match facts are linked into the journey timeline.

Required permissions:
- player sees own match record
- coach and org admin see relevant team participation
- scout sees only consented, limited summary data

### Phase 4 — Development assessment
1. Coach runs assessment cycle for assigned players.
2. Player sees competency scores and evidence summaries.
3. Player reviews strengths, recommendations, and growth areas.
4. Formal assessment is verified before being marked as official.
5. System keeps historical snapshots for comparison.

Required permissions:
- coach can create and submit assessments in team scope
- player can view own assessment history
- verification requires designated authority or trusted reviewer

### Phase 5 — Goals and plans
1. Player creates personal development goals.
2. Coach reviews and supports the goals.
3. System associates each goal with related competencies and evidence.
4. Player updates progress throughout the season.
5. Plan revisions are preserved as versioned history.

Required permissions:
- player owns personal goals
- coach can support and revise in team scope
- guardian sees consented child plan when allowed

### Phase 6 — Achievements and portfolio
1. Player sees overall history and verified achievements.
2. Achievements are linked to competition, match, and milestone events.
3. Player can curate portfolio visibility and artifact sharing.
4. Verified records appear as official and trusted badges.

Required permissions:
- player manages own portfolio
- org admin and scout see only consented subsets

### Phase 7 — Long-term continuity
1. Player changes clubs or academies.
2. Existing identity and journey remain intact.
3. New organization context is appended without duplicating the player record.
4. Historical achievements and development progress remain accessible.

Required permissions:
- player retains full identity ownership
- organization scope is contextual only

---

## 2. Guardian journey: monitoring and consented support

### Phase 1 — Relationship linking
1. Guardian links to child account.
2. System validates child relationship and consent state.
3. Guardian sees linked child dashboard and child profile summary.

Required permissions:
- guardian sees only their own child records
- consent must be valid

### Phase 2 — Monitoring development progress
1. Guardian reviews child attendance, goals, and updates.
2. Guardian sees season-level performance notes and development status.
3. Guardian receives notifications for new observations or approval requests.

Required permissions:
- guardian access is consent-limited
- guardian cannot access unrelated players

### Phase 3 — Problem detection and support
1. Guardian can identify recurring attendance gaps or delayed progress.
2. Coach may share recommendations through a consented channel.
3. Guardian can use the dashboard to support response planning.

Required permissions:
- child specific access only
- no unrestricted org or association access

### Phase 4 — Consent and privacy management
1. Guardian reviews who can see the child’s data.
2. Guardian updates shared visibility preferences.
3. System keeps consent record and audit trail.

Required permissions:
- guardian manages own child’s consent settings
- org and coach roles respect those settings

---

## 3. Coach journey: sessions, evaluation, and player support

### Phase 1 — Team context and player list
1. Coach selects active team and season context.
2. System shows players assigned to the coach’s team scope.
3. Coach reviews attendance, performance, and development context.

Required permissions:
- coach role in assigned team scope
- org admin may assign team scope

### Phase 2 — Training delivery
1. Coach creates or edits training sessions.
2. System publishes objectives and attendance expectations.
3. Coach records player participation and notes.

Required permissions:
- coach writes team sessions and attendance
- player and guardian view only approved schedule context

### Phase 3 — Observation and recommendation
1. Coach logs observation notes and matches them to a session or match context.
2. Coach recommends next developmental steps.
3. System attaches observation to the player development timeline.

Required permissions:
- coach writes observation in assigned scope
- player can view own observation stream

### Phase 4 — Assessment workflow
1. Coach creates assessment cycle.
2. Coach scores competencies using defined rubric.
3. Evidence is attached.
4. Review and verification are triggered.

Required permissions:
- coach submits assessments in assigned scope
- verification requires formal authority or designated reviewer

### Phase 5 — Development planning
1. Coach and player create plan with target milestones.
2. Plan is linked to goals and competency focus.
3. Success is monitored across weeks and months.

Required permissions:
- coach/relevant team role can edit plans in relevant scope
- player sees own plan and progress

---

## 4. Academy / Organization journey: development oversight and reporting

### Phase 1 — Organization setup and roster visibility
1. Org admin reviews organization teams and players.
2. System displays roster, active memberships, and verified identities.
3. Org admin identifies player groups by age category, competition, and team.

Required permissions:
- org admin has organization-scoped access
- no cross-organization visibility without explicit authority

### Phase 2 — Development monitoring
1. Org admin views player development dashboard across the organization.
2. System highlights at-risk attendance, goal progress, and competency patterns.
3. Org admin identifies players requiring additional coaching support.

Required permissions:
- org admin sees organization-level trends
- player and guardian data remain protected by consent rules

### Phase 3 — Training and competition coordination
1. Org admin reviews training plans, attendance, and upcoming fixtures.
2. System surfaces key schedule conflicts and development priorities.
3. Org admin can coordinate coaching and competition readiness.

Required permissions:
- org admin has broad operational scope within their organization
- external interference is blocked by event and role rules

### Phase 4 — Reporting and governance
1. Org admin exports permitted reports or summaries.
2. System preserves audit trails for approvals and changes.
3. Only verified source records are used in official reporting.

Required permissions:
- org admin can export within approved scope
- association or governance role handles formal verification

---

## 5. Scout journey: consented discovery and opportunity review

### Phase 1 — Search and shortlist
1. Scout searches players using authorized criteria.
2. System returns consented and valid player summary.
3. Scout reviews skill, position, achievements, and consent status.

Required permissions:
- scout only sees approved and consented profile subset
- no personal or legal data without explicit permission

### Phase 2 — Opportunity qualification
1. Scout identifies candidate fit for program, camp, or trial.
2. System links candidate to key achievements and competency summary.
3. Scout records tracked interest or opportunity.

Required permissions:
- scout can only operate on consented records
- no direct editing of source records

### Phase 3 — Follow-up and response
1. Player or guardian receives opportunity interest notice.
2. System records interest outcome and follow-up action.
3. Scout can maintain opportunity workflow without owning player records.

Required permissions:
- authorized opportunity flow only
- no overriding official assessments or profile ownership

## Summary

These journeys establish the player as the central subject of the system, while guardian, coach, organization, and scout roles act as authorized perspectives and contributors. The architecture remains aligned with the project requirement: the player owns the journey, and the platform is built to support that longitudinal experience rather than to duplicate or fragment it.
