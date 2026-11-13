# Player Development Source of Truth

## Purpose

This document defines the authoritative ownership of player development data and clarifies which information is derived, which is operational, and which is only advisory.

## Core rule

Every important business concept must have one primary source of truth.

No domain should independently “own” the same concept unless it is explicitly designated as a derived or consumer layer.

## Source-of-truth matrix

| Business concept | Primary source | Secondary / derived sources | Notes |
| --- | --- | --- | --- |
| Player identity | Player Identity & Profile | Player Journey | Player identity stays stable across clubs and teams |
| Football ID | Player Identity & Profile | Journey / profile views | Must remain the persistent identity record |
| Guardian relationship | Player Identity & Profile | Guardian access views | Guardian is an authorization relation, not an identity source |
| Team and academy affiliation | Affiliation relationship, stewarded by the relevant Organization / Team domain | Player Journey | Dated affiliation facts are preserved; primary organization is only a player-selected display context and grants no access (ADR-10) |
| Competition records | Competition domain | Player Journey | Competition remains authoritative for fixtures and standings |
| Match facts | Match & Performance Integration | Journey and portfolio | Match results and stats are authoritative only in match context |
| Training session facts | Training domain | Attendance and journey | Training data is operational, not a player development score |
| Attendance records | Attendance domain | Journey summary and player view | Attendance is evidence, not a final development judgment |
| Development competencies | Development & Assessment | Coach feedback and player goals | Formal assessment is authoritative within competency evaluation |
| Coach observations | Coach Observation & Feedback | Development assessment | Observations may inform assessments but do not replace them |
| Player goals | Player Goals & Development Plans | Development summary | Goals are an operational planning layer |
| Verified achievements | Player Portfolio & Achievements | Match and competition history | Verified achievements are a curated, trusted subset |
| Insights / recommendations | Analytics / AI | Source domains | These are derived and must not overwrite official records |
| Membership status | Membership domain | Digital KTA and public verification | KTA is a representation, not an alternative source |

## Ownership boundaries

### Player owns
- their identity
- their development timeline context
- their goals and personal development narrative
- their access preferences and, when legally able, consent decisions

### Organization owns
- operational participation records inside its own context
- team and training session management
- coach assignment and internal operational reporting

### Coach owns
- training delivery
- observation content
- performance input and development guidance
- formal assessment evidence

### Guardian owns
- their verified relationship claim and their own consent grant decisions where legally authorized
- access only to child records covered by a valid, scoped grant

### Analytics / AI owns
- interpretation, trend summaries, and recommended next steps

### Public verification owns
- only the approved, low-risk status information necessary for trust and verification

## Data stewardship vs data ownership

| Concept | Responsibility |
| --- | --- |
| Ownership | which domain is authoritative |
| Stewardship | which actor maintains and updates the record |
| Authorship | who created the record or observation |
| Verification | who approved or validated it |
| Access | who may read or act on it |

Example:

- The Player Identity domain owns the player record.
- The club may steward the player’s team data as an operational context.
- A coach may author an observation.
- A head coach or designated reviewer may verify a development assessment.
- The player may have access to their own record, while a guardian may have limited consented access.

## Assessment authority and revisions

The Development & Assessment domain owns assessment records. The assessor authors and submits a version; an organization-designated reviewer who is not the author verifies it. Disputes and corrections append review/revision history rather than overwriting verified facts. The player journey references assessment versions; it does not own or edit them. See ADR-09.

## Guardian relationship and consent

A guardian relationship is not an access grant. Each verified guardian-player relationship has its own purpose-, category-, action-, and time-scoped consent grant. Sensitive/confidential records are excluded by default. Revocation blocks future access but does not erase source records or retract information already exported. See ADR-11.

## Cross-organization continuity

The player retains access to eligible personal history, while source domains and originating organizations retain record provenance and stewardship. A new affiliation does not grant historical access. Sharing with another organization requires an explicit scoped grant; a portable export is a provenance-bearing copy, never a new authoritative record. See ADR-12.

## Derived data rules

Derived data must be labeled as such and must not be used as a hidden source of truth.

Examples:

- analytics trend summaries
- AI recommendations
- progress indicators generated from multiple records
- condensed player journey summaries

These should be treated as:

- read-only perspectives
- supporting outputs
- non-authoritative summaries

## Conflict handling

The architecture avoids duplicate ownership by requiring one of these patterns:

- source record is authoritative and downstream data references it
- the domain creates a trusted derived view with clear provenance
- a consumer may read the record, but may not modify it silently

## Recommended rules for future modules

1. When a new module appears, determine its source-of-truth owner before implementation.
2. If it only consumes data, the module remains a consumer layer.
3. If it generates official player state, it must be attached to an authoritative domain.
4. If the module needs new data, it should be modeled as part of an existing owner domain first.
5. If multiple organizations generate overlapping player records, they must reference the same player identity and not create parallel player profiles.

## Final principle

The player development system should behave like a connected ecosystem where data is shared by reference and validated by provenance, not copied into many disconnected silos.
