# Player Development Architecture Decisions

## Existing decisions retained

ADR-01 through ADR-08 remain accepted as written: player-centric ownership, source-of-truth separation, connected Training/Attendance/Development, consumer-only intelligence, KTA as a representation layer, the repository boundary, contextual permissions, and preservation of the existing architecture. The decisions below resolve the previously open questions without changing those decisions.

## ADR-09: Assessment authorship, verification, dispute, and correction

Status: Accepted for product and implementation planning; backend enforcement is not implemented.

### Context
The current app has no assessment domain or assessment API. Existing architecture distinguishes coach observations from formal assessments and requires evidence and verification, but it does not identify who may verify or how records are corrected.

### Problem
If the author can silently verify or overwrite an assessment, the record has weak provenance and cannot be trusted after staff or organization changes.

### Options considered
- Allow every coach to create, verify, and edit assessments.
- Give the association exclusive verification authority.
- Let each organization designate scoped reviewers, separate from the author, with versioned review and dispute workflows.

### Recommended decision
- A coach or other explicitly authorized assessor may create an assessment for a player within an active assigned scope.
- The author may save a draft and submit it. Submission freezes that version for review; the author cannot verify their own submission.
- Each organization may designate one or more authorized reviewers for its own assessment records. A reviewer must have an active reviewer assignment for that organization and must not be the assessment author. Association verification is not implied; it requires a separate governance mandate.
- A player, or an authorized guardian for a minor, may dispute a submitted or verified assessment by recording the affected assessment version and a reason. A dispute triggers review; it does not delete or automatically invalidate the source record. The current verified version remains marked disputed until the authorized reviewer resolves the case.
- Corrections create a new revision with reason, author, timestamp, and reviewer decision. Verified revisions are immutable. The new revision may supersede the prior one, but the prior version and its verification/dispute history remain auditable and available to authorized readers.
- If a coach leaves an organization, their authorship and source records remain. Their active write/reviewer access ends with their assignment. A currently designated reviewer in that organization can complete a pending review; otherwise the assessment remains pending until an authorized reviewer is appointed. Departure does not transfer authorship.

### Consequences
Business: review authority is accountable and independent; disputes provide a correction path without erasing history.
Technical: assessment records require immutable revisions, explicit author/reviewer identities, organization scope, state transitions, and audit metadata. These are future assessment-domain requirements, not Phase 1 work.
Security: reviewer scope and current assignment must be checked at the service/API boundary. UI role switching is not authorization.
Data ownership: Development & Assessment owns assessment facts; the player owns their longitudinal journey, which references assessment versions.

### Rejected alternatives
- Self-verification: conflicts authorship with independent review.
- Association-only verification: no approved mandate or current association workflow supports this universal scope.
- In-place edits or deletion: destroys provenance and historical trust.
- Automatic transfer of former coach permissions: violates least privilege.

### Implementation implications
Define assessment state and revision contracts only in the later assessment phase. Phase 1 may specify player identity/journey references but must not implement assessment workflows.

## ADR-10: Global identity, affiliations, and primary organization context

Status: Accepted.

### Context
The current prototype `Player` has optional singular `orgId` and `teamId` fields; memberships and journey fixtures already contain historical affiliations. The product requires continuity through multiple organizations and simultaneous affiliations.

### Problem
Treating a current organization field as identity ownership makes transfers destructive and cannot represent concurrent team contexts.

### Options considered
- Keep one organization as the owner of the player record.
- Permit multiple affiliations but select a permanent organization owner.
- Keep one global player identity and represent each organization/team relationship as a dated, independently stateful affiliation; expose a selected primary context only for navigation and summaries.

### Recommended decision
- Football ID and the global player identity are independent of every organization.
- Organization and team participation are represented by dated affiliation records. A player may have multiple active organization or team affiliations when valid; each team affiliation references its organization.
- “Primary organization context” is a player-selected presentation/context preference among their active organization affiliations, not ownership, authority, or a permission grant. The player may leave it unset. An authorized guardian may manage this preference for a minor only within the child’s account context; an organization cannot set itself primary. A selected primary team must be an active team affiliation within the selected primary organization.
- If the selected affiliation ends, the primary context becomes unset; another active affiliation is not silently promoted. The player or authorized guardian must select a replacement.
- Transfers create/close affiliation records with effective dates and preserve prior affiliations and journey references. Ending one affiliation does not end another simultaneous affiliation.
- The source organization remains steward of its operational affiliation facts; the Player Identity domain owns the global identity. Historical records are never erased by changing the primary context.

### Consequences
Business: “primary” describes the player’s current preferred lens, while global identity and concurrent affiliations remain clear.
Technical: future model should use affiliation identifiers and effective dates; legacy `Player.orgId`/`teamId` may be compatibility projections during migration, not authoritative identity fields.
Security: affiliation membership provides scope context but does not independently grant access to all player data.
Data ownership: identity belongs to Player Identity; organization/team relationships belong to the relevant affiliation/organization source domain; Journey references them.

### Rejected alternatives
- Organization-owned player identity: breaks portability and continuity.
- Automatic promotion of another organization: creates an unreviewed user-context change.
- Organization-controlled primary selection: lets an organization define the player’s preferred identity context.

### Implementation implications
Phase 1 must expose affiliation history and selected context through repository contracts, while preserving compatibility with existing profile and team views. It must not build transfer workflow or organization administration.

## ADR-11: Guardian relationship and scoped consent

Status: Accepted for product and implementation planning; legal policy and backend enforcement remain prerequisites for production.

### Context
The current prototype uses `Guardian.childIds`, `Player.guardianIds`, and a consent panel, but does not define independently verifiable relationship status, granular grants, or adult transition behavior.

### Problem
A guardian relationship alone cannot safely grant unrestricted access to every record, especially sensitive development information or information authored by an organization.

### Options considered
- Relationship implies full child-record access.
- One global consent toggle controls all data.
- Verify relationships separately from consent and issue per-guardian, per-player, purpose/scope/time-bounded grants.

### Recommended decision
- Guardian relationship and access consent are distinct records. A relationship must be verified by an approved process before it can support access; relationship verification alone grants no read permission.
- Each guardian has an independent grant for a specific player. Grants specify allowed data categories and actions, purpose, effective period, granting authority, and status. Multiple guardians do not inherit each other’s grants.
- Consent categories must distinguish identity/profile, schedule and participation, development assessments, coach observations, portfolio sharing, and export. Sensitive/confidential organization or safeguarding records are excluded by default and require an explicit policy and separate authorization; a guardian grant alone cannot expose them.
- For a minor, a verified legal guardian may authorize the permitted child-data scope subject to applicable law and organizational policy. Player assent should be supported when age/developmentally appropriate; exact age thresholds and legal requirements are a deployment policy decision, not inferred here.
- Consent lifecycle: requested → active → revoked / expired / suspended. Changes are versioned and auditable. Revocation blocks future access promptly at the authorization boundary; it cannot retract information already lawfully viewed or exported.
- At the applicable age-of-majority transition, guardian grants are suspended by default pending the player’s explicit renewal of access. The exact transition rule must be configured to applicable jurisdiction and verified identity data.
- The player’s own access and privacy choices remain distinct from guardian access. Guardian access never becomes unrestricted access to all player records.

### Consequences
Business: family monitoring is supported without treating a family link as blanket authority.
Technical: access checks require relationship verification, grant scope, status, time bounds, target record classification, and audit trail. Current UI checks are only prototype restrictions.
Security: enforce deny-by-default for missing/expired/revoked grants; do not rely on role switching or client-side state.
Data ownership: Player Identity owns relationship identity references; the consent/access domain owns grants; source domains retain ownership of their records.

### Rejected alternatives
- Inherited access across guardians: one guardian cannot grant on behalf of another.
- One global consent flag: insufficiently precise for sensitive categories and export.
- Permanent guardian access after adulthood: contradicts player privacy and autonomy.

### Implementation implications
Phase 1 reuses current guardian-linked child selection only as a mock-backed access path and documents its limitation. Full consent lifecycle, age transition, and sensitive-record policy are excluded from Phase 1 and require a separately approved policy/backend boundary.

## ADR-12: Cross-organization continuity and controlled sharing

Status: Accepted for product and implementation planning; retention periods remain subject to jurisdictional policy.

### Context
The player must retain a continuous history when moving organizations, while source records may include private, confidential, or organization-scoped information.

### Problem
Automatic transfer of all historical records either exposes private material to a new organization or fragments the player’s history.

### Options considered
- Automatically share all records with every new organization.
- Keep all history locked to the originating organization.
- Preserve source records at their owning domains, let the player retain access to their own portable history, and grant a new organization time- and category-scoped read access only with valid authorization.

### Recommended decision
- A transfer never creates a new player identity and never automatically shares the player’s complete history.
- Source domains and originating organizations retain stewardship and provenance of their records; the player retains access to their personal journey and eligible personal data, subject to lawful retention and confidentiality rules.
- A player (or authorized guardian while appropriate) initiates sharing with a receiving organization by selecting record categories, purpose, and duration. The receiving organization receives authorized read access by reference where available; an export is a provenance-preserving copy, not a new authoritative record.
- A new active affiliation grants only the operational access required for that affiliation. It does not grant historical access by default.
- Official verified assessments remain attributed to their original author, organization, reviewer, and version. Historical observations remain attributed to their author and source organization. Access to an observation depends on its classification and an explicit share grant; confidential records remain excluded unless policy permits and specific authorization exists.
- Verification status is preserved across transfer, but the receiving organization cannot rewrite or re-verify the source record. It may add its own assessment or observation as a new record in its own domain.
- When a player leaves an organization, the organization and its assigned staff lose prospective operational access according to the end of affiliation and current policy; the player retains their permitted personal history. Coaches lose access when their assignment ends. Audit and legally required records follow retention policy.
- Revocation ends future sharing access; it does not erase source records or retroactively retract already exported copies. Export packages must identify source, version, verification state, and export time.

### Consequences
Business: continuity and privacy coexist; transfers are explicit rather than implied.
Technical: cross-organization reads need player/guardian grants, source references, record classification, access expiry, and auditable export metadata.
Security: enforce organization and record-level authorization at the API boundary; do not infer historical access from a new affiliation.
Data ownership: each source domain remains authoritative; Player Journey aggregates references; portable exports are non-authoritative copies.

### Rejected alternatives
- Automatic full-history sharing: violates data minimization.
- Organization-only ownership with no player access: breaks the player-owned journey principle.
- Copying historical records into the receiving organization as authoritative: creates duplicate sources of truth.

### Implementation implications
Phase 1 supports identity and affiliation continuity and repository-level journey reads. Cross-organization consent, export, record classification, and transfer operations are explicitly outside Phase 1.

## Resolved questions and deferred policy

The four architecture questions are resolved by ADR-09 through ADR-12. Remaining deployment-specific policy work is limited to applicable age/assent thresholds, identity/guardian verification procedures, retention periods, and record-classification rules for confidential or safeguarding material. These do not change the decisions above, but must be approved before production authorization is enabled.
