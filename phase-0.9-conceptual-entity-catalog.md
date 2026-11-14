# Phase 0.9 — Conceptual Entity Catalog

**Status:** Provider-neutral discussion artifact. It is not a schema, physical model, API contract, implementation plan, or authorization grant. Categories and lifecycles below are conceptual; where ownership, relationship, or transition rules are unsettled, they are marked `UNRESOLVED`.

## Status vocabulary

- **Established:** a domain meaning or invariant already supported by an approved decision; this does not establish a physical representation.
- **Candidate:** a useful conceptual boundary that still needs validation.
- **Pending Decision:** a material behavior, authority, ownership, or relationship remains unresolved.
- **Deferred:** intentionally outside initial development/testing or a later approved scope.

Classification names are provisional references to [phase-0-data-classification.md](phase-0-data-classification.md), not legal determinations. For real-child information, use synthetic fixtures only during initial development/testing under DECISION-002.

## 1. Account

- **Category:** Domain concept; candidate entity.
- **Purpose:** Represent a platform principal for authenticated use, distinct from a login credential, Person, or Player.
- **Identity:** Conceptual account principal; no identifier or cardinality design is selected.
- **Ownership:** Account/Identity domain is a candidate authority; credential lifecycle belongs to whichever provider is later selected. Provider selection is `PENDING`.
- **Relationships:** Candidate association to one or more provider login identities and, when established, a Person. Account–Person cardinality is unresolved.
- **Lifecycle:** Creation, linking, recovery, suspension, closure, and duplicate handling are design questions, not approved transitions.
- **Data sensitivity:** Person-private; authentication/session-related information is a proposed sensitivity descriptor, provisional and pending P-17, not an approved classification class.
- **Authorization boundary:** A verified provider subject can establish authenticated control only. It does not establish a Person, Player, role, guardian authority, or resource permission.
- **Decision dependency:** P-01–P-05, P-11, D-33.
- **Status:** Pending Decision.

## 2. Person

- **Category:** Domain concept; candidate identity entity.
- **Purpose:** Represent a human who may participate in multiple football and non-football roles.
- **Identity:** Human identity resolution is conceptually distinct from login and Player identity.
- **Ownership:** Person Identity is the proposed source domain; verification and resolution authority remain to be decided.
- **Relationships:** May have roles, Account associations, Player identity, organization memberships, and guardian relationships. Cardinalities are not inferred.
- **Lifecycle:** Claim/creation, verification, correction, duplicate review, merge, split, and closure require approved rules; no final state machine is selected.
- **Data sensitivity:** Person-private; identity evidence may be guardian/legal-sensitive.
- **Authorization boundary:** A role label or claimed identity does not authenticate or authorize an actor. Corrections must retain historical references and a review trail.
- **Decision dependency:** P-05, P-06, P-11, D-33, P-18.
- **Status:** Pending Decision.

## 3. Player

- **Category:** Domain concept; candidate identity entity.
- **Purpose:** Represent a person's football identity when a player profile is explicitly established under an approved policy.
- **Identity:** Player identity is not interchangeable with Person, Account, organization membership, team roster, or National Football ID.
- **Ownership:** Player Identity is the conceptual source of truth for player identity under DECISION-001; organization ownership is excluded.
- **Relationships:** Candidate relationship to Person; stable National Football ID; dated affiliations; registration and match-participation references; journey projections.
- **Lifecycle:** Creation, verification, correction, duplicate resolution, merge, split, and historical-reference handling remain unresolved.
- **Data sensitivity:** Person-private or child-sensitive according to subject and fields.
- **Authorization boundary:** Player identity is not proof of login or authority. Organization affiliation does not grant full-history access.
- **Decision dependency:** DECISION-001, P-05, P-11, D-24, D-33, P-17, P-18.
- **Status:** Pending Decision.

## 4. National Football ID

- **Category:** Conceptual identifier/value, not an authentication entity.
- **Purpose:** Provide a stable ecosystem reference for one Player identity.
- **Identity:** Player-owned, organization-independent, stable across transfers and affiliations, and never reassigned to another player.
- **Ownership:** Belongs to Player Identity under DECISION-001; no organization owns or controls reassignment.
- **Relationships:** References the Player identity only; it is not a password, login credential, access token, or proof of authorization.
- **Lifecycle:** Issuance authority, collision, duplicate merge, correction, compromise response, lookup projection, and exceptional retirement remain unresolved; no format or algorithm is selected.
- **Data sensitivity:** Identifier whose disclosure and lookup projection require policy; opaque format is a design constraint, not a final format.
- **Authorization boundary:** Possession or knowledge of the ID grants no access. Public or private lookup behavior is not decided.
- **Decision dependency:** DECISION-001, D-24, D-33, P-17, P-19.
- **Status:** Established invariant; lifecycle and format Pending Decision.

## 5. Organization

- **Category:** Domain concept; candidate entity.
- **Purpose:** Represent a football organization or governance body in its operational or delegated context.
- **Identity:** Organization identity is distinct from a person, team, membership, or player identity.
- **Ownership:** Organization & Governance is a candidate source domain. Verification, type system, and hierarchy are unresolved.
- **Relationships:** May operate teams, have members, steward its own records, or participate in governance relationships. Inheritance and cardinality are not assumed.
- **Lifecycle:** Verification, activation, suspension, closure, and governance association need policy.
- **Data sensitivity:** Public, organization-private, or safeguarding-sensitive depending on record and projection.
- **Authorization boundary:** Membership and ownership are scoped. Organization Owner is not Platform Admin and gains no automatic player-wide or cross-organization access.
- **Decision dependency:** P-06, P-07, D-25, D-31.
- **Status:** Candidate; Pending Decision.

## 6. Organization Membership

- **Category:** Relationship; candidate domain record.
- **Purpose:** Describe a Person's scoped participation or staff/governance role in an Organization.
- **Identity:** Relationship between Person and Organization; its representation and cardinality are undecided.
- **Ownership:** Organization & Governance is a candidate steward; verification and grant authority are unresolved.
- **Relationships:** May relate to scoped assignments for a Team, Event, Competition, Association, or Federation; does not equal Player affiliation.
- **Lifecycle:** Invitation/claim, verification, activation, role change, suspension, revocation, and end are questions for P-06/P-07/D-26.
- **Data sensitivity:** Organization-private; authority and verification evidence may be guardian/legal-sensitive or security-sensitive.
- **Authorization boundary:** Active, exact-scope assignment may be an input to future policy; membership alone grants neither player consent nor historical access.
- **Decision dependency:** P-06, P-07, D-26, D-31, P-17.
- **Status:** Pending Decision.

## 7. Team

- **Category:** Domain concept; candidate operational entity.
- **Purpose:** Represent a squad or team context in which players and staff may participate.
- **Identity:** Distinct from Organization, Season, roster membership, and Player identity.
- **Ownership:** Team/Organization operational stewardship is a candidate; governance and lifecycle rules need confirmation.
- **Relationships:** May be operated in an Organization context and associated with players, staff, competitions, and Season context. No physical relationships are fixed.
- **Lifecycle:** Formation, category changes, season rollover, suspension, closure, and ownership changes are unresolved.
- **Data sensitivity:** Organization-private; rosters and schedules may be child-sensitive.
- **Authorization boundary:** Current exact-scope staff assignment may inform access; team membership does not establish eligibility or match participation.
- **Decision dependency:** P-06, P-07, P-08, P-09, D-27, D-35, D-36.
- **Status:** Candidate; Pending Decision.

## 8. Player Affiliation

- **Category:** Relationship; established domain meaning with pending representation.
- **Purpose:** Record dated participation between a Player and an Organization, with source stewardship and history.
- **Identity:** Relationship is not the Player identity and may coexist with other valid affiliations.
- **Ownership:** Relevant organization stewards its operational facts; Player Identity remains authoritative for the global player identity (ADR-10).
- **Relationships:** May relate conceptually to Team roster placement. Whether team placement is a team-kind affiliation or a separate concept is unresolved.
- **Lifecycle:** Start, status change, end, correction, and concurrent periods must preserve history; exact transitions/date rules are pending.
- **Data sensitivity:** Organization-private and potentially child-sensitive.
- **Authorization boundary:** Affiliation provides context only; it does not grant access to prior organizations' records or the whole Player Journey.
- **Decision dependency:** ADR-10, P-08, P-09, P-10, P-18.
- **Status:** Established semantic invariant; Pending Decision on model and temporal rules.

## 9. Season

- **Category:** Domain concept; candidate validity/scheduling context.
- **Purpose:** Provide a possible temporal context for team operations, competition participation, rosters, and schedules.
- **Identity:** No separate identity, owner, or cardinality is selected.
- **Ownership:** `UNRESOLVED`. Team and Competition may be related contexts; neither they nor an Organization is designated final owner.
- **Relationships:** Relationships to Team, Event, Competition, Registration, and Roster remain candidates.
- **Lifecycle:** Definition, opening, rollover, closing, and archive semantics remain undecided.
- **Data sensitivity:** Usually contextual metadata; associated rosters/schedules may be organization-private or child-sensitive.
- **Authorization boundary:** A Season context confers no membership, eligibility, or access by itself.
- **Decision dependency:** D-27, D-35, D-36.
- **Status:** Pending Decision.

## 10. Event

- **Category:** Domain concept; candidate occurrence.
- **Purpose:** Describe a scheduleable football occurrence or activity without presuming that it is a Competition or Tournament.
- **Identity:** No physical identity or event taxonomy is selected.
- **Ownership:** `UNRESOLVED`; organizer context is possible but not a final ownership rule.
- **Relationships:** May be associated with organizations, teams, seasons, competitions, registrations, and matches; exact boundaries remain open.
- **Lifecycle:** Publication, schedule, opening, completion, cancellation, correction, and archive are illustrative questions only.
- **Data sensitivity:** Public projection only if approved; operational details and participant information may be organization-private or child-sensitive.
- **Authorization boundary:** Organizer assignment may be relevant to an approved scope; Event participation does not grant general player-history access.
- **Decision dependency:** D-28, D-29, D-34, D-35.
- **Status:** Pending Decision.

## 11. Competition

- **Category:** Domain concept; candidate contest framework.
- **Purpose:** Describe organized rules, categories, schedules, standings, or participation context if the product adopts that scope.
- **Identity:** Separate conceptual meaning from an Event and a Tournament; no separate physical representation is required here.
- **Ownership:** `UNRESOLVED`; organizer, event, and competition responsibilities require D-34/D-28 decisions.
- **Relationships:** May contextualize Season, Team, Registration, Eligibility, Match, and participation; direction/cardinality remain open.
- **Lifecycle:** Draft/open/active/completed/cancelled labels are illustrative, not approved transitions.
- **Data sensitivity:** Public summaries require publication policy; participant and operational data may be child-sensitive or organization-private.
- **Authorization boundary:** Organizer scope is not a general player directory or historical-access grant.
- **Decision dependency:** D-28, D-34, D-35, D-36, P-17, P-19.
- **Status:** Pending Decision.

## 12. Tournament

- **Category:** Domain concept; candidate competition/event form.
- **Purpose:** Describe a bracketed, phased, or championship structure if this distinction is useful to the domain.
- **Identity:** May be a conceptual form of Competition or a distinct Event relationship; no separation is imposed.
- **Ownership:** `UNRESOLVED`.
- **Relationships:** Possible relationship to Competition, Event, categories, teams, registrations, and matches is subject to D-34.
- **Lifecycle:** Bracket, rounds, schedule, completion, and correction rules are not selected.
- **Data sensitivity:** Participant rosters, schedules, and results may be child-sensitive; public summary requires an approved projection.
- **Authorization boundary:** Organizer assignment is limited to approved operations and cannot reveal unrelated profiles or history.
- **Decision dependency:** D-28, D-34, D-36, P-17, P-19.
- **Status:** Pending Decision.

## 13. Competition Registration

- **Category:** Candidate relationship/participation record; entity-vs-relationship form unresolved.
- **Purpose:** Express a request or recorded association of a Player or Team with a competition/category context.
- **Identity:** References existing Player/Team identity; it never creates or replaces National Football ID.
- **Ownership:** Competition/Event authority is `UNRESOLVED` pending D-28/D-34.
- **Relationships:** May refer to Eligibility assessment, Team roster, Season, and Match context; no one relation is presumed.
- **Lifecycle:** Request, review, accept/reject, withdraw, cancel, and appeal are illustrative pending rules.
- **Data sensitivity:** Child-sensitive where the participant is a child; payment/guardian attributes may have higher classifications.
- **Authorization boundary:** Registration is not eligibility, consent, roster membership, or evidence of actual Match participation.
- **Decision dependency:** D-28, D-34, D-36, P-14, P-17, P-19.
- **Status:** Pending Decision.

## 14. Eligibility

- **Category:** Policy/rule and possible evaluation concept.
- **Purpose:** Express conditions or an evaluation relevant to whether a Player or Team may participate in a competition context.
- **Identity:** Rule, evaluation, or decision form is unresolved; no final status vocabulary is selected.
- **Ownership:** `UNRESOLVED`; rule authorship, evaluation authority, and appeal responsibility require D-36.
- **Relationships:** Distinct from Team roster membership, Registration, and actual Match participation.
- **Lifecycle:** Rule definition, evaluation, review, appeal, and expiry are design questions, not final states.
- **Data sensitivity:** Child-sensitive when tied to an identifiable player; eligibility reasons may be more restrictive than a result flag.
- **Authorization boundary:** Eligibility does not itself register a player, place them on a roster, or prove they participated.
- **Decision dependency:** D-28, D-36, P-17.
- **Status:** Pending Decision.

## 15. Match

- **Category:** Domain concept; candidate source record.
- **Purpose:** Represent a scheduled or played football contest and its authoritative operational facts if this domain boundary is adopted.
- **Identity:** Separate from Competition, Event, Team, and a player's participation.
- **Ownership:** Match domain is the proposed source for official match state/results; authority to record, confirm, dispute, and correct remains open.
- **Relationships:** May relate to Teams, Competition/Event, officials, and Match Participation; these are conceptual only.
- **Lifecycle:** Scheduling, in-progress, submission, confirmation, dispute, correction, cancellation, and closure are illustrative open questions.
- **Data sensitivity:** Match reports, lineups, and child statistics may be child-sensitive; public output requires separate policy.
- **Authorization boundary:** Assigned officials/organizers may have narrowly defined duties; Match access does not imply full Player profile access.
- **Decision dependency:** D-29, D-34, D-36, P-17, P-18.
- **Status:** Candidate; Pending Decision.

## 16. Match Participation

- **Category:** Relationship/evidence concept; candidate domain record.
- **Purpose:** Describe an actual player's participation in a particular Match and team context if evidenced by an authorized source.
- **Identity:** Not equivalent to eligibility, roster membership, or competition Registration.
- **Ownership:** Match/Participation source is a candidate; verification and correction authority remain unresolved.
- **Relationships:** May relate Player, Match, Team, lineup, and evidence/provenance; no physical form is specified.
- **Lifecycle:** Proposed lineup, recorded participation, correction, dispute, or verification are questions, not agreed transitions.
- **Data sensitivity:** Child-sensitive and potentially performance-sensitive.
- **Authorization boundary:** Access requires the applicable match/participant policy; a registration reference is not proof of actual play.
- **Decision dependency:** D-29, D-36, P-17, P-18.
- **Status:** Pending Decision.

## 17. Guardian Relationship

- **Category:** Relationship; established separation from consent, verification process pending.
- **Purpose:** Record a claimed relationship between a Guardian/person and a Player for later verification and policy evaluation.
- **Identity:** Relationship does not merge identities or establish authority.
- **Ownership:** Identity relationship domain is a candidate steward; verifier and evidence governance are unresolved.
- **Relationships:** Links Person identities conceptually; may be considered by Guardian Authority and Consent policy.
- **Lifecycle:** Claim, review, verification/rejection, expiry, dispute, revocation, or correction need P-12/P-13 decisions.
- **Data sensitivity:** Guardian/legal-sensitive; evidence should be minimized and highly restricted.
- **Authorization boundary:** Verification alone grants no read, write, grant, or representation authority.
- **Decision dependency:** ADR-11, P-12, P-13, P-17, P-18.
- **Status:** Established separation invariant; Pending Decision on verification and lifecycle.

## 18. Guardian Authority

- **Category:** Policy/authorization concept.
- **Purpose:** Evaluate whether a person is authorized to act as a grantor for a particular player, action, purpose, and scope.
- **Identity:** Distinct from relationship verification, organizational role, and consent itself.
- **Ownership:** `UNRESOLVED`; legal, safeguarding, and product policy owners must define acceptable authority evidence and review responsibility.
- **Relationships:** May be an input to a Consent decision; not inferred solely from Guardian Relationship or Organization Membership.
- **Lifecycle:** Establishment, expiry, dispute, suspension, and revocation rules are pending.
- **Data sensitivity:** Guardian/legal-sensitive.
- **Authorization boundary:** Grantor authority must be evaluated for the specific subject, action, purpose, and policy; it is not global.
- **Decision dependency:** ADR-11, P-12, P-13, P-14, P-15.
- **Status:** Pending Decision.

## 19. Consent

- **Category:** Policy/authorization concept with candidate grant and event records.
- **Purpose:** Represent a scoped, time-bounded expression of permission where the grantor has valid authority; it is not authentication or a universal allow flag.
- **Identity:** Independent per guardian/player relationship under ADR-11; exact recipient, category, action, purpose, version, and expiry semantics remain open.
- **Ownership:** Consent/Access domain is a candidate authority; source domains retain the information they protect.
- **Relationships:** Depends on Guardian Authority, subject, protected data category, action, purpose, recipient, time, policy, and audit.
- **Lifecycle:** Request, grant, change, revoke, expiry, suspend, or resume are conceptual events; applicable law and status rules remain unresolved.
- **Data sensitivity:** Guardian/legal-sensitive; should not embed unnecessary identity evidence or child business data.
- **Authorization boundary:** Consent is one policy input and cannot substitute for authenticated actor, assignment, classification, or prohibitions.
- **Decision dependency:** ADR-11, P-12–P-15, P-17–P-20, D-32.
- **Status:** Established principle; Pending Decision on policy detail.

## 20. Development Observation

- **Category:** Candidate source record/domain concept.
- **Purpose:** Capture an attributable observation by an authorized coach/staff member, distinct from a formal assessment or match fact.
- **Identity:** Authorship, subject, source organization, context, and verification state require provenance; no implementation shape is selected.
- **Ownership:** Development/Observation domain is a candidate source; source organization and author stewardship are relevant under ADR-12.
- **Relationships:** May inform an Assessment or Published Feedback but does not become either automatically.
- **Lifecycle:** Draft, submitted, reviewed, corrected, shared, or closed states are unresolved; correction should not erase authorship/history.
- **Data sensitivity:** Child-sensitive and potentially confidential organization-sensitive.
- **Authorization boundary:** Staff assignment alone does not grant access to historical or unrelated observations. Guardian visibility is blocked pending P-16 and policy.
- **Decision dependency:** ADR-09, ADR-12, P-06, P-16–P-18, D-29/D-30 where relevant.
- **Status:** Pending Decision.

## 21. Development Feedback / Published Feedback

- **Category:** Candidate derived/published domain object, distinct from raw Observation.
- **Purpose:** Provide reviewed feedback that an authorized source may intentionally share without exposing all internal observations.
- **Identity:** Must identify its source/version and publishing intent conceptually; no final revision model is selected here.
- **Ownership:** Development & Assessment is a candidate source; publishing authority and audience remain unresolved.
- **Relationships:** May derive from observations, assessments, goals, or evidence; it does not replace those sources.
- **Lifecycle:** Review, approval, publication, correction, withdrawal, and expiry need P-16 and product rules.
- **Data sensitivity:** Child-sensitive; classification may differ from raw observations but is not assumed to be public.
- **Authorization boundary:** A published projection is only visible to its intended authorized audience; publication does not grant access to underlying records.
- **Decision dependency:** ADR-09, P-14, P-16, P-17, P-18.
- **Status:** Candidate; Pending Decision.

## 22. Player Journey Projection

- **Category:** Derived projection/reference; not a source entity.
- **Purpose:** Present an authorized chronology or summary by referencing authoritative source information.
- **Identity:** Must retain source/version/provenance and distinguish unknown, pending, and verified status; no timeline contract is selected.
- **Ownership:** Source domains own facts; Journey is a consumer projection under ADR-12.
- **Relationships:** Reads references from identity, affiliation, competition, match, training, attendance, and development sources as authorized.
- **Lifecycle:** Build/update, source correction/unavailability, access revocation, projection refresh, and deletion/retention behavior remain open.
- **Data sensitivity:** Inherits the highest relevant classification of included information; audience-specific projections may differ.
- **Authorization boundary:** Projection never grants access to source records; re-evaluate access when read and do not infer missing provenance.
- **Decision dependency:** ADR-09, ADR-10, ADR-12, D-30, P-17–P-20, D-32.
- **Status:** Established consumer principle; projection contract Pending Decision.

## 23. Evidence / Provenance

- **Category:** Cross-cutting conceptual information; not necessarily an independent entity.
- **Purpose:** Explain where a fact came from, who authored/recorded/reviewed it, and what verification state is actually known.
- **Identity:** Source reference, actor/organization, time, and version are conceptual attributes only; no field list is mandated.
- **Ownership:** The source domain remains authoritative; provenance is maintained with or alongside that source under approved policy.
- **Relationships:** Supports identity corrections, affiliation history, match/assessment facts, Journey references, exports, and audit.
- **Lifecycle:** Created with source evidence; correction adds traceable history; unavailable or unknown provenance must remain explicitly unknown.
- **Data sensitivity:** Inherits the source classification; evidence documents may be guardian/legal-sensitive or safeguarding-sensitive.
- **Authorization boundary:** Provenance is not permission or verification by itself; evidence visibility is separately restricted.
- **Decision dependency:** ADR-09, ADR-12, P-12, P-16–P-18, D-30, D-32, D-33.
- **Status:** Established principle; representation Pending Decision.

## 24. Audit Event

- **Category:** Security/accountability concept; candidate restricted record.
- **Purpose:** Record the minimum security-relevant actor, action, decision, resource reference, and context necessary for accountability.
- **Identity:** Event scope and tamper/resolution semantics are not chosen; it must not duplicate entire business records.
- **Ownership:** Restricted audit/platform operations is a candidate steward; source domains remain authoritative for business facts.
- **Relationships:** May reference authorization decisions, identity/assignment changes, consent changes, sensitive access, correction, or export.
- **Lifecycle:** Recording, restricted review, retention, archive, deletion, or legal hold need policy; append-only is not indefinite retention.
- **Data sensitivity:** Audit/compliance, potentially sensitive because events may reveal access patterns or identity references.
- **Authorization boundary:** Audit access is separately restricted and audited; it never bypasses the policy that protected the underlying record.
- **Decision dependency:** ADR-09, ADR-11, ADR-12, P-17, P-18, D-32.
- **Status:** Candidate; Pending Decision.

## Explicitly outside this catalog
