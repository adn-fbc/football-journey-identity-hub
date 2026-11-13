# Player Development Implementation Prompts

## Purpose

This file provides implementation prompts for the next architecture and product planning phases. These prompts are intentionally scoped to architecture and module planning, not partial feature implementation.

## Prompt 1 — Player Identity & Journey Foundation

Create a blueprint for the Player Identity & Journey foundation using the existing role-aware app shell and repository boundary.

Requirements:

- preserve the current player profile and football identity flows
- define journey aggregation from source records
- keep player identity stable across affiliations
- document repo contracts for player lookup and journey aggregation
- keep the player as the central identity owner

## Prompt 2 — Training & Attendance Integration Blueprint

Define the module design for Training and Attendance integration without creating a separate player data store.

Requirements:

- clearly separate Training, Attendance, and development assessment ownership
- define data contracts for session planning and attendance recording
- define how attendance references training and match events
- document authorization rules by player, coach, and organization

## Prompt 3 — Development Competency Framework Blueprint

Design the formal competency framework for technical, tactical, physical, and psychological growth.

Requirements:

- create competency taxonomy
- define assessment rubric and evidence requirements
- define formal vs informal feedback difference
- define historical snapshot and review process
- keep analytics and AI downstream from this source domain

## Prompt 4 — Coach Observation & Assessment Workflow Blueprint

Design the coach workflow for notes, observations, and formal assessments.

Requirements:

- distinguish observation, feedback, and formal assessment
- define verification and approval flows
- define who may create, update, and verify records
- preserve the player’s ownership of their journey

## Prompt 5 — Player Goals & Development Plans Blueprint

Define the design for player goals and development planning.

Requirements:

- support player-driven and coach-supported goals
- connect goals to competencies and evidence
- define goal revision and checkpoint history
- integrate goals into the player journey without duplicating records

## Prompt 6 — Match Performance Integration Blueprint

Design the player development integration with match performance data.

Requirements:

- keep Match as the authoritative owner of match records
- define how performance data becomes evidence for development assessment
- preserve historical continuity across competitions and teams
- connect portfolio artifacts to verified match records

## Prompt 7 — Portfolio & Achievement Blueprint

Design how verified achievements and player portfolio artifacts are represented.

Requirements:

- define verified vs submitted content
- preserve historical achievements and growth milestones
- ensure portfolio output references official sources
- maintain proper access and privacy rules

## Prompt 8 — Scouting and Opportunity Blueprint

Design the scouting and opportunities layer as a consumer domain.

Requirements:

- keep scouting out of source-of-truth ownership
- define consent and visibility rules
- define how opportunity matches connect to player profiles
- define how scouting insights differ from official assessments

## Prompt 9 — Analytics and AI Blueprint

Design the intelligence layer as a downstream consumer of authorized data.

Requirements:

- define analytics and AI as derived data domains
- clearly separate official records from AI-generated recommendations
- apply player and guardian consent boundaries
- ensure reporting remains explainable and traceable

## Prompt 10 — Activation Prioritization Blueprint

Prioritize the unimplemented modules using architecture dependencies rather than UI availability.

Requirements:

- define activation sequence based on source-domain readiness
- identify blockers and required repository contracts
- define domain owners and acceptance criteria
- ensure the roadmap avoids duplicate product silos

## Overall instruction for all prompts

All prompts must respect:

- existing shell and routing architecture
- repository boundary pattern
- source-of-truth ownership
- player-centric journey model
- no rebuild and no duplicate DB ownership
