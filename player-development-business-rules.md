# Player Development Business Rules

## 1. Identity continuity

1. A player has exactly one core football identity record.
2. Team or organization changes do not create a new identity.
3. Historical journey entries remain attached to the same player identity.
4. Player identity remains stable even when a player changes club, academy, or season.

## 2. Organization affiliation changes

1. A player may move between organizations over time.
2. Historical affiliation records remain visible as historical context.
3. Current organization and team membership are maintained separately from historical data.
4. Organization change events must be recorded without overwriting prior identity or journey records.
5. Multiple active organization/team affiliations are allowed when valid; each has its own dates and status.
6. Primary organization is an optional player-selected context among active affiliations, not an ownership or authorization setting. An organization cannot designate itself primary.
7. Ending the selected primary affiliation clears the preference; the system does not silently promote another affiliation.

## 3. Training attendance

1. Attendance belongs to a specific training session or team event.
2. Attendance status can be present, absent, late, or excused.
3. Attendance is evidence, not a final development verdict.
4. Attendance records must preserve who recorded the state and when.
5. A player can have multiple attendance statuses across time and sessions.

## 4. Match participation

1. Match participation belongs to the match record and team context.
2. Match records are authoritative in the match domain.
3. Player performance summaries can be derived from match participation.
4. Player match data must not rewrite official match records.
5. Match participation can contribute to development evidence and achievement records.

## 5. Coach observation submission

1. Coach observations must be attached to a player, session, or match context.
2. Observation notes must identify the observer and time of submission.
3. Informal observation does not become a formal assessment automatically.
4. Observation records remain separate from approved competency assessments.

## 6. Formal assessment verification

1. Assessments must be evidence-based.
2. Each assessment is associated with a period and competency set.
3. A verified assessment must be linked to the reviewer and validation timestamp.
4. Historical assessments must remain preserved for comparison.
5. A single rating cannot override a historical development trajectory.
6. An authorized assessor may author and submit; only an independently designated, in-scope organization reviewer may verify. The author cannot verify their own assessment.
7. A player, or an authorized guardian for a minor, may dispute a submitted or verified assessment. Dispute starts review and does not erase or silently invalidate the record.
8. Corrections create a new revision with reason, author, reviewer, and timestamps. Verified versions are immutable and remain in history.
9. If an authoring coach leaves, authorship remains attributed to them; their access ends. Another active designated reviewer may complete a pending review.

## 7. Development goal creation

1. A player may create personal goals.
2. A coach may support or revise goals in the assigned team scope.
3. Goals must be linked to a relevant competency or development theme.
4. Goal state must preserve progress updates and revision history.
5. Goal completion can contribute to milestone tracking and portfolio visibility.

## 8. Development plan revision

1. Plans must have a clear active state and period.
2. Revision history is retained for accountability and review.
3. A new plan revision must not delete the previous version.
4. Plans remain separate from assessments and official records.

## 9. Achievement verification

1. Achievements must be traceable to at least one official or accepted source.
2. Verified achievements are explicitly marked and shown as trusted records.
3. Unverified items remain separate from official accomplishment history.
4. Achievements can contribute to portfolio highlights but must not override source records.

## 10. Guardian consent

1. Guardian access is child-specific and personal to the linked player.
2. Guardian access requires valid consent and relationship validation.
3. Guardian access must not exceed the approved child scope.
4. Consent status and access scope must be preserved and reviewable.
5. A verified guardian relationship alone does not grant record access; each guardian has independent, category- and action-scoped consent with a purpose and effective period.
6. Sensitive/confidential records are excluded by default. Applicable legal rules determine guardian authority and age/assent thresholds.
7. Guardian grants are suspended by default at the applicable age-of-majority transition pending explicit player authorization.
8. Revocation blocks future access but does not erase source records or retract information already viewed/exported.

## 11. Data sharing

1. Data sharing is based on identity, role, scope, context, and permission.
2. Consumer modules may view authorized subsets only.
3. Scouting and analytics cannot become source-of-truth owners.
4. Shared data must respect the current consent and privacy state.
5. A new organization affiliation does not automatically grant historical access.
6. Cross-organization sharing requires a player/authorized-guardian grant that specifies categories, purpose, and duration.
7. Shared records retain source, author, verifier, and version provenance; exports are non-authoritative copies.
8. Organization departure ends prospective access according to affiliation and policy; it does not delete the player's eligible history or source audit records.

## 12. Player data export

1. Players can export their own data under approved privacy and consent rules.
2. Organization or guardian exports must remain in scope and authorized.
3. Export data must preserve provenance and source references.
4. Export does not create a new source of truth.

## 13. Historical record preservation

1. Historical records are preserved even when a player leaves an organization.
2. Record alteration must never erase prior source facts.
3. Old versions of goals, plans, and assessments stay visible for continuity.
4. Player journey entries must be append-only or auditable by version.

## 14. Role boundaries

1. Coach access is limited to relevant team and assignment scope.
2. Guardian access is limited to linked child records.
3. Association access remains governance and review scoped.
4. Scout access is consent-limited and read-only to permitted information.
5. AI and analytics access is derived and never authoritative.

## 15. Data integrity

1. Data validation should occur at the repository or service boundary.
2. Invalid or incomplete values must be rejected or marked as draft.
3. Missing required evidence should block formal verification.
4. Source records should be versioned where data can change over time.

## 16. Final business rule

The platform must support the player’s development as a continuous, longitudinal story while preserving the authority and integrity of the source domains that produced the evidence.
