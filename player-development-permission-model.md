# Player Development Permission Model

## Purpose

This document defines the permission model for the Player Development Ecosystem using the existing architecture principle:

Identity + Role + Scope + Context + Permission

The goal is to create a shared contract for future module activation without replacing the current role-switching experience.

## Permission model

### 1. Identity
Identity is the person or legal entity whose data is being accessed.

Examples:

- Player
- Guardian
- Coach
- Organization admin
- Association reviewer
- Scout

### 2. Role
Role describes the user’s active workspace lens.

Examples:

- player
- parent
- coach
- org_admin
- competition_organizer
- association
- scout

This is already represented in [src/config/roles.ts](src/config/roles.ts) and [src/lib/role-context.tsx](src/lib/role-context.tsx).

### 3. Scope
Scope defines the operational or institutional boundary of the access.

Examples:

- team
- organization
- academy
- competition
- association
- region

### 4. Context
Context is the actual object being viewed or managed.

Examples:

- a player profile
- a training session
- a development assessment
- a match record
- a member record

### 5. Permission
Permission is the allowed action in that combined setting.

Examples:

- view_profile
- create_observation
- update_goal
- verify_assessment
- export_portfolio
- approve_membership

## Permission design principles

- Role alone is never enough to grant access.
- Scope and context must be evaluated together.
- Consumer modules can read authorized context but cannot create source records.
- Guardian access is consent-driven and limited to approved child records.
- Player access is central and should be user-initiated, not recreated via role switching.
- Formal assessment verification should require a higher trust level than casual notes.

## Role-based authorization matrix

| Role | Player profile access | Guardian access | Training access | Attendance access | Development assessment access | Goal management | Verified portfolio |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Player | Full own profile | N/A | Own training context | Own attendance | Own assessment view | Own goals | Own portfolio |
| Guardian | Child profile if consented | Child records | Child training context | Child attendance | Child development view if consented | Child goals if consented | Child portfolio if consented |
| Coach | Player context in assigned teams | No direct child access unless assigned | Team session access | Team participation | Assigned player assessments | Team player goals | Limited verified history |
| Org Admin | Organization players | Child consent context if relevant | Team and organization training | Organization attendance | Organization development admin view | Team planning | Verified portfolio access |
| Association | Member and governance frameworks | Not by default | Not unless scoped | Not unless scoped | Governance and verification view | Not unless scoped | Verified member record access |
| Scout | Consent-based player profile views | No guardian override | No operational training edit | No attendance edit | No assessment write | No goal write | Verified public record subset |
| AI | Authorized derived context only | No direct access outside consented context | No write access | No write access | No official assessment write | No official goal write | Derived summaries only |

## Owner-specific controls

### Player ownership
The player should retain ownership of their development identity and consent state.

### Guardian access
Guardian relationship verification and consent are separate. Each verified guardian has an independent, scoped, time-limited grant. Access is limited to the data categories and actions in that grant; sensitive/confidential records are excluded by default. Revocation blocks future access. At adulthood, grants are suspended pending the player's explicit authorization, with applicable legal thresholds determined by deployment policy.

### Organization access
Organizations may manage the operational side of player engagement within their domain, but must not erase the player’s broader journey or general football identity.

### Coach access
Coaches may view or create operational evidence such as observations and training notes, but not all official assessment records should be editable by any coach.

### Official verification
An organization may designate reviewers for its own assessments. A reviewer must be in active scope and cannot verify an assessment they authored. Association verification is not implied. Disputes and corrections preserve prior versions and audit history.

### Cross-organization access
A new organization affiliation grants only current operational scope, not access to historical records. The player or currently authorized guardian must grant record-category- and time-scoped sharing. Source records remain owned by their originating domains; exports preserve provenance and are not authoritative copies.

## Important limitation

This is not a complete RBAC backend. It is a compatibility contract for the current UI and future modules. The current app already uses role-aware workspace switching and access checks. The goal is to define a common permission vocabulary so new modules are designed consistently.

## Future contract template

Every newly activated module should define:

- identity contract
- role contract
- scope contract
- context contract
- permission matrix
- verification rules
- consent rules
- export rules

This keeps product behavior consistent with the architecture and prevents future modules from becoming source domains through silent permission creep.
