# Phase 0.10B — OR-03 National Football ID Governance Baseline

- **Status:** `OWNER APPROVED — CONCEPTUAL BASELINE`
- **Approval:** OR-03 Documentation Consolidation Review accepted by owner; all seven decisions accepted with no additional notes.
- **Date:** 2026-11-14
- **Phase/workshop:** Phase 0.10B, OR-03 — National Football ID Governance.
- **Scope:** Conceptual NFI governance only. This is not a schema, technical identifier specification, workflow implementation, or production authorization.

## 1. Purpose and relationship to prior work

This baseline records the seven owner-approved OR-03 decisions for National Football ID (NFI). Phase 0.9 remains the provider-neutral conceptual foundation. It distinguishes Account, Person, Player, and NFI; treats relationships and lifecycle behavior as unresolved where appropriate; and does not authorize a physical model.

OR-01 and OR-02 remain separate owner-review topics. OR-01 covers Account–Person cardinality and linking. OR-02 covers Person–Player creation and identity resolution. Their existing review recommendations remain `NOT REVIEWED` in the repository; this baseline does not convert them into owner decisions. NFI issuance requires a confirmed Person–Player relationship but does not decide the general relationship cardinality or Player creation policy.

The related [OR-03 Documentation Consolidation Review](phase-0.10b-or-03-documentation-consolidation-review.md) records the D-24/D-33 reconciliation assessment. Both registered decisions remain `PENDING` in the unchanged Phase 0.9 register.

## 2. Governing identifier principles

- NFI belongs to an individual Player and is independent of organization ownership.
- NFI remains stable across SSB, club, academy, school, organization, team, competition, tournament, affiliation, and transfer changes.
- NFI is distinct from an Account ID and any internal Player ID. No identifier format, algorithm, or implementation is selected here.
- NFI is an identifier only. It is not a password, credential, authentication secret, access token, or proof of authorization.
- NFI is opaque and must not encode date of birth, sex, location, organization, or category.
- Opaque does not mean secret. Lookup and disclosure require explicit purpose, role, access controls, minimization, and audit; knowledge of NFI grants no profile or history access.
- NFI is unique and permanent for its Player identity, is never reassigned to another Player, and is not changed for ordinary name, affiliation, or attribute changes.
- An organization membership does not confer ownership of Player identity, NFI issuance authority, or unrestricted access to the Player's information.

These principles preserve the approved identity invariant in DECISION-001. The Phase 0.9 catalog describes NFI as a conceptual identifier and leaves format and lifecycle questions unresolved ([NFI entry](phase-0.9-conceptual-entity-catalog.md)); the relationship matrix says that knowing the identifier proves no authentication or authorization ([Player–NFI relationship](phase-0.9-conceptual-relationship-matrix.md#L10-L10)).

## 3. Owner-approved OR-03 decisions

### OR-03.1 — A: Permanent Opaque Identifier

NFI is a unique, permanent, opaque identifier. It is never reused or reassigned. Ordinary name, affiliation, and attribute changes do not change NFI. The identifier must not encode DOB, sex, location, organization, or category. Permanence does not prohibit controlled retirement of an erroneous identifier under OR-03.4.

### OR-03.2 — A: Controlled Automated Issuance

Automated issuance is permitted only after all applicable prerequisites and required approvals have completed:

- The Person–Player relationship has been confirmed under an approved identity-resolution policy.
- The Player application has been approved.
- Required factual identity verification is complete.
- DOB consistency and relevant age checks for the stated purpose have passed; this does not establish competition eligibility.
- Duplicate checks are complete and identity conflicts are resolved or escalated.
- Uniqueness is guaranteed, including retries and concurrent issuance.
- The action has the required authorized approval. High-risk, inconsistent, or unresolved cases go to human review rather than automatic issuance.

Organization membership alone grants no issuance authority. NFI issuance does not create, imply, or decide competition eligibility. Because D-33, verification governance, and other prerequisites remain pending, this decision is a future conceptual rule, not permission to issue NFI now.

### OR-03.3 — C: Controlled Resolution with Independent Review

Corrections, conflicts, and duplicate NFI cases require controlled, auditable workflows. The workflow must distinguish:

- One person associated with multiple NFI values; and
- One NFI incorrectly associated with multiple people.

Preserve prior references, provenance, reasons, and review history. High-risk identity resolution requires an independent reviewer and approver. Organizations may report suspected issues but may not independently approve identity changes. Do not automatically transfer permissions, grants, or consent when resolving an identifier or identity conflict. A proposed correction does not itself establish that a merge or split is appropriate.

### OR-03.4 — C: Permanent NFI with Controlled Retirement

NFI cannot be deleted from history or reused. An erroneous identifier may be retired only through formal resolution with a recorded reason, supporting evidence references, authorization, and audit history. Inactivity, transfer, and name changes are not grounds for retirement. Suspicion or allegations call for suitable temporary restrictions and investigation, not automatic permanent retirement. Retirement does not automatically delete, merge, or close the Player identity.

Retirement is a conceptual governance outcome, not a final technical status enumeration. No status machine, identifier format, or database representation is selected.

### OR-03.5 — C: Purpose-Bound, Role-Based, and Consent-Aware Access

NFI is not publicly searchable by default. A Player or properly authorized guardian may access the relevant NFI subject to the applicable safeguards and policies. An organization may use a lookup only for a legitimate, active, purpose-bound operational need and the minimum necessary result. Cross-organization lookup must not expose arbitrary Player existence or details.

Public display should use an alternative public identifier or another explicitly valid basis. Lookup must have least-privilege scope, rate limits, anti-enumeration safeguards, reason codes, and audit. Platform Admin has no blanket access; exceptional operational access requires a separately approved, purpose-limited, recorded procedure. Consent-aware access does not make consent the only possible lawful basis. OR-09 must establish applicable authority and basis; guardian relationship, authority, consent, and assent are not interchangeable.

Lookup authorizes only the permitted lookup result. It does not authorize access to a Player profile, history, source records, or another organization's information.

### OR-03.6 — C: Risk-Based Multi-Source Verification

Identity verification, age verification, and competition eligibility are separate determinations. Potential evidence may include birth certificates, Family Cards (KK), NISN, and other appropriate official documents or sources. Do not require every document for every Player. Evidence requirements depend on the purpose, age category, applicable competition rules, and law.

Submission is not verification. Authenticity and consistency, especially DOB, must be checked using official sources only where legally available and authorized. NISN is supporting education data, not standalone proof of age. Inconsistent or unresolved evidence requires review. A mismatch alone is not an automatic finding of Age Fraud. Minimize documents collected and protect them with purpose-bound access and retention limits.

### OR-03.7 — C: Comprehensive Auditable Governance

Audit issuance, correction, conflict resolution, retirement, lookup, disclosure, verification, objections, and privileged access. Keep a conceptual append-only history: corrections are new linked records, not silent overwrites. High-risk actions require separation of applicant, reviewer, and approver where applicable. Provide an independent appeal or review path.

Keep the minimum audit information needed for accountability; do not copy all business or personal data into audit. Retention must be bounded by purpose and applicable law, with durations decided through the relevant governance process. Append-only does not mean indefinite retention. Audit records do not grant access and cannot bypass source authorization.

## 4. Conceptual lifecycle and exception handling

The following describes governance concepts, not final states or a technical state machine:

1. **Pre-issuance:** establish the Person–Player relationship under an approved policy; approve the Player application; complete required identity/factual checks; resolve duplicates and conflicts; confirm any DOB/age checks required for the stated purpose; and ensure authorized approval and uniqueness under retries/concurrency.
2. **Issued identifier:** NFI refers to the established Player identity and remains stable through ordinary attribute and affiliation changes. References to it do not create authentication, authorization, or eligibility.
3. **Conflict investigation:** record the report and preserve evidence references. Determine whether the issue is multiple NFI values for one person, one value associated with multiple people, a mistaken association, or a potentially compromised/lost identifier. Restrict only what is justified by policy while reviewing; do not assume guilt or automatically retire.
4. **Correction, merge, or split:** decide the identity question through a controlled process, preserve old and new references and provenance, and obtain independent review for high-risk actions. A record correction is not permission to transfer another person's consent or access.
5. **Temporary restriction versus retirement:** temporary restriction may protect the system while an allegation or compromise is investigated. Permanent retirement is a separately authorized outcome with reason and audit; it is not triggered merely by inactivity, a transfer, or a changed name.
6. **Historical traceability:** a retired identifier remains represented in protected history as needed for provenance and audit, is not issued again, and does not automatically delete the Player.

Lost/compromised-ID response details, responsible authorities, and operational procedures remain open. No automatic suspension, reissue, or recovery mechanism is defined here.

## 5. Verification and age/eligibility safeguards

Keep these determinations distinct:

1. **Document submitted:** evidence has been received; no authenticity or identity conclusion follows.
2. **Document authenticity verified:** the source/document checks passed for the specific authorized purpose; this alone does not establish the person's identity or Player relationship.
3. **Identity established:** an authorized process has established the relevant Person–Player relationship and identity facts under the applicable policy.
4. **DOB/age verified for a stated purpose:** the available evidence supports a date/age conclusion for that purpose and applicable policy. It is not a universal or permanent competition ruling.
5. **Competition eligibility determined:** the applicable competition authority applies its own approved rules and process. NFI issuance or DOB verification does not decide eligibility.

Evidence must be risk-based and minimized. Official sources may be used only where legally available and authorized. NISN may support an assessment but is not standalone age proof. Discrepancies require review; mismatch alone is not a finding of Age Fraud.

## 6. Access and disclosure boundaries

- Deny public NFI search by default. Opacity reduces encoded-attribute disclosure but does not make the identifier a secret or prevent enumeration by itself.
- Limit lookup to an authenticated, appropriately scoped actor and a documented purpose; return only the minimum necessary result.
- A Player's self-access and guardian access depend on identity resolution and, for guardians, separately verified relationship, authority, current scoped consent where applicable, and policy. A relationship claim alone grants nothing.
- Organization access requires a legitimate current operational need and exact role/scope. Membership does not confer identity ownership, general directory access, or historical cross-organization access.
- Cross-organization lookup must not reveal arbitrary Player existence, profile, or history. Apply rate limits, anti-enumeration measures, reason codes, and audit.
- Public display requires an alternative public identifier or another explicitly valid basis; no public NFI directory is approved here.
- Platform Admin access is not blanket access. Any exceptional operational access must have a separately approved purpose, bounded scope, and recorded review.
- Consent-aware does not mean consent is the only lawful basis. OR-08/OR-09 and applicable policy must establish authority and basis; consent does not replace authentication or authorization.

## 7. Audit, review, and retention

The audit scope conceptually includes issuance, lookup, disclosure, verification decisions, corrections, conflict reports/resolution, retirement, objections/appeals, and privileged access. Record actor, purpose/reason, decision, time, and linked resource references only as necessary. Do not duplicate submitted documents or full business records in audit.

High-risk changes need independent review and approval where applicable. A person affected by a decision must have an independent review/appeal path. Corrections link to prior records and preserve provenance rather than silently replacing history. Access to audit is separately controlled and never grants access to the underlying Player record.

Retention periods, legal holds, deletion/anonymization, and jurisdictional requirements remain unresolved under P-17, P-18, and OR-11/OR-14. Append-only history is bounded by an approved retention policy and is not indefinite retention.

## 8. D-24 / D-33 Reconciliation Assessment

The existing register continues to mark D-24 and D-33 `PENDING`; this baseline does not update their wording or status. See the [registered D-24 entry](phase-0.9-open-decisions-and-dependencies.md#L48-L48) and [registered D-33 entry](phase-0.9-open-decisions-and-dependencies.md#L57-L57), with original carry-forward scopes in [Phase 0.7 D-24](phase-0.7-unresolved-decisions.md#L48-L48) and [Phase 0.7 D-33](phase-0.7-unresolved-decisions.md#L57-L57).

### D-24 — NFI identifier lifecycle

The registered scope includes issuance authority, collisions/duplicates, merge/split, lost or compromised ID response, lookup projection, and exceptional retirement/reissue policy. OR-03.1–OR-03.7 establish conceptual safeguards for permanence, issuance prerequisites, controlled resolution, retirement, lookup, verification, and audit. Important detail remains open: who holds issuance/approval authority; what operational response applies to lost or compromised NFI; how lookup fields and implementation controls are chosen; and how P-17/P-19, retention, and legal-basis policies are finalized. **Recommended disposition: partially addressed; preserve D-24 as `PENDING`.**

### D-33 — Person–Player relationship and identity resolution

The registered scope asks how a Person becomes a Player, Person–Player cardinality, identity-verification timing, and how merge/split/correction preserves history and audit. OR-03.2 requires a confirmed Person–Player relationship before NFI issuance; OR-03.3 and OR-03.6 add resolution and verification safeguards for NFI governance. They do not decide Player profile creation, Person–Player cardinality, general identity verification authority/timing, or all merge/split policy. OR-02 recommends explicit, auditable resolution without choosing cardinality, but remains `NOT REVIEWED` in the repository. P-05 and P-11 remain dependencies. **Recommended disposition: partially addressed; preserve D-33 as `PENDING`.**

The detailed rationale and protected-register explanation are in the [OR-03 Consolidation Review](phase-0.10b-or-03-documentation-consolidation-review.md#d-24--d-33-reconciliation-assessment). Owner approval of OR-03 is recorded here as conceptual governance; it is distinct from a formal D-24 or D-33 register status change.

## 9. Dependencies and unresolved matters

OR-03 depends on the established identity invariant DECISION-001 and remains related to D-24, P-17, and P-19. This baseline does not mark the following cross-OR matters complete:

- **OR-04–OR-07:** organization, affiliation, roster, season, event/competition, and eligibility rules.
- **OR-08–OR-09:** guardian verification/authority, consent, assent, applicable legal basis, and access transitions.
- **OR-10–OR-11:** observation/feedback visibility, classification, retention, minimization, and deletion.
- **OR-12:** scouting, discovery, sharing, export, and revocation.
- **OR-14:** audit coverage, system actors, integrity, retention, and accountability.
- **OR-01/OR-02:** account-person and Person-Player questions remain independently unresolved; OR-03 does not settle them.
- **OR-13:** provider/runtime selection and verification are separate; no provider is selected by this conceptual baseline.

These dependencies remain owner/domain work. No dependency is marked complete by this document.

## 10. Child-safety and implementation boundary

Until guardian verification, scoped consent, child-safety controls, and auditability are designed and tested:

- Use adult test accounts for authentication testing only.
- Use synthetic/dummy Player data only.
- Do not use real child personal data, documents, images, videos, or identifiable media.
- Do not conduct real-world child identity verification experiments.
- Do not enable real-child scouting, discovery/search, profile sharing, or distribution.

This baseline does not authorize database or logical/physical schema design, migrations, production NFI issuance, authentication or authorization implementation, RLS or production policy changes, backend services or APIs, real document verification, Supabase/provider/remote operations, or real child-data workflows. It is a conceptual governance baseline only; future implementation requires separate decisions, safeguards, approval, and verification.