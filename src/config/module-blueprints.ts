/**
 * Future module blueprints — the project baseline for every module registered in ./modules.ts
 * with status "soon". The /modules pages render this data and `future-modules-baseline.md`
 * is generated from it (bun scripts/generate-module-baseline.ts). Edit scope here, not in the markdown.
 */
import type { RoleId } from "./roles";

export type RolloutWave = 1 | 2 | 3;

export interface ModuleBlueprint {
  /** Matches an `AppModule.id` in ./modules.ts. */
  id: string;
  wave: RolloutWave;
  summary: string;
  problem: string;
  roleJobs: { role: RoleId; job: string }[];
  scope: { mvp: string[]; next: string[]; later: string[] };
  /** Records this module will create and be the single source of truth for. */
  entities: { name: string; description: string }[];
  /** Existing platform data this module reads but never owns. */
  consumes: string[];
  /** Football Journey events this module will publish to the player's timeline. */
  journeyEvents: string[];
  privacy: string[];
  /** Other future module ids that must ship first. */
  dependsOn: string[];
  /** What already exists in the app that this module builds on. */
  foundations: string[];
  metrics: string[];
  outOfScope: string[];
  /** First-release acceptance criteria in Given / When / Then form; each one should become a test. */
  acceptance: { given: string; when: string; then: string }[];
  /** Module-specific implementation tasks. Standard steps every module needs are added by the baseline generator. */
  checklist: string[];
  /** Deeper project documents, relative to the repository root. */
  docs?: string[] | undefined;
}

export const WAVES: Record<RolloutWave, { label: string; title: string; goal: string }> = {
  1: {
    label: "Wave 1",
    title: "Club operations",
    goal: "Give SSBs and academies the weekly tools they run on, producing trusted activity data for every Football ID.",
  },
  2: {
    label: "Wave 2",
    title: "Professional networks",
    goal: "Bring coaches, referees and scouts onto the same identity layer and open consent-based pathways for players.",
  },
  3: {
    label: "Wave 3",
    title: "Governance & intelligence",
    goal: "Turn verified ecosystem data into regional and national infrastructure, reporting and assistance.",
  },
};

export const MODULE_BLUEPRINTS: ModuleBlueprint[] = [
  // ---------------- Wave 1 — Club operations ----------------
  {
    id: "attendance",
    wave: 1,
    summary: "Fast check-in for training sessions and matches, with attendance history for players, guardians and coaches.",
    problem: "Most SSBs track attendance on paper or in chat groups, so coaches cannot see trends and guardians are not told when a child misses training.",
    roleJobs: [
      { role: "coach", job: "Take attendance at the pitch in under a minute and see who is falling behind." },
      { role: "org_admin", job: "Monitor attendance rates per team and follow up on long absences." },
      { role: "parent", job: "Check a child in, report an absence in advance and see attendance history." },
    ],
    scope: {
      mvp: [
        "Coach roster check-in per session (present, late, excused, absent)",
        "Guardian and player self check-in within an authorized activity window",
        "Advance absence reporting with a reason",
        "Attendance rate per player and per team (last 30 days, season)",
      ],
      next: [
        "QR check-in at the venue",
        "Automatic guardian notification on unexcused absence",
        "Low-attendance alerts for coaches and admins",
      ],
      later: ["Offline check-in with sync", "Attendance export for association reporting"],
    },
    entities: [
      { name: "AttendanceRecord", description: "One person, one activity, one status, with who recorded it and when." },
      { name: "AbsenceNotice", description: "An advance absence reported by a guardian or adult player." },
      { name: "AttendanceSummary", description: "Derived rates per player and team; never edited by hand." },
    ],
    consumes: ["Schedule items (training and matches)", "Team rosters and active affiliations", "Guardian relationships and consent"],
    journeyEvents: ["Attendance milestones (e.g. 50 sessions attended) as attendance_record events"],
    privacy: [
      "Guardians see only their own linked children's records.",
      "Coaches see records only for teams they are assigned to.",
      "Attendance is evidence of participation, never a development score.",
    ],
    dependsOn: [],
    foundations: ["Check-in page for players and guardians", "Attendance column in the organization workspace", "Schedule module"],
    metrics: ["Share of sessions with attendance recorded", "Median time to complete a roster check-in", "Guardian absence notices submitted before the session"],
    outOfScope: ["GPS or location tracking of minors", "Paying or penalizing based on attendance"],
    acceptance: [
      { given: "a coach assigned to Garuda U10 opens today's training session", when: "they mark each rostered player present, late, excused or absent and save", then: "one AttendanceRecord per player is stored with the coach as recorder and a timestamp" },
      { given: "a guardian with a linked child and an open check-in window", when: "they check the child in", then: "the child's record shows present, recorded by the guardian, and a check-in outside the window is rejected with a clear message" },
      { given: "a guardian reports an absence with a reason before the session starts", when: "the coach opens the roster", then: "the child is pre-marked excused and the reason is visible to the coach only" },
      { given: "a player with 20 recorded sessions this season", when: "an admin opens the team attendance view", then: "the 30-day and season rates match the records, and excused sessions are not counted as absences" },
      { given: "a coach who is not assigned to a team", when: "they try to open that team's attendance", then: "access is denied and no records are shown" },
    ],
    checklist: [
      "Extend the existing check-in model (src/features/check-in) instead of creating a second check-in flow",
      "Derive AttendanceSummary from records in a pure function with unit tests; never store hand-edited rates",
      "Add an attendance tab to the team page and a summary to the guardian child card",
      "Add access rules (coach: assigned teams; guardian: linked children) with tests",
      "Publish milestone journey events (e.g. 50 sessions) from the summary, not on every check-in",
    ],
  },
  {
    id: "training",
    wave: 1,
    summary: "Session planning, a shared drill library and team training calendars for coaches.",
    problem: "Coaches plan sessions in notebooks, so assistants, admins and guardians cannot see what is trained and nothing carries over between seasons.",
    roleJobs: [
      { role: "coach", job: "Plan a session from drills, assign it to a team and reuse it next week." },
      { role: "org_admin", job: "Keep a consistent club curriculum across age categories." },
    ],
    scope: {
      mvp: [
        "Training session planner (objective, duration, drills, equipment)",
        "Club drill library with age category and focus tags",
        "Assign sessions to team schedules",
        "Share plans with assistant coaches",
      ],
      next: ["Season and term curriculum templates", "Post-session coach notes", "Session load overview per team"],
      later: ["Video and diagram attachments", "Shared drill library across organizations"],
    },
    entities: [
      { name: "TrainingSession", description: "A scheduled session for a team, linked to a schedule item." },
      { name: "SessionPlan", description: "The reusable plan: objectives, blocks and drills." },
      { name: "Drill", description: "A library item with focus area, age range and instructions." },
      { name: "Curriculum", description: "An ordered set of plans for an age category and term." },
    ],
    consumes: ["Teams and coach assignments", "Schedule items", "Organization structure"],
    journeyEvents: ["Training session participation summaries as training_session events (via Attendance)"],
    privacy: ["Session plans belong to the organization and are visible to its staff only.", "No player-level data is stored in plans."],
    dependsOn: ["attendance"],
    foundations: ["Training schedule view in the organization workspace", "Schedule rows and calendar"],
    metrics: ["Sessions planned before they happen", "Plans reused at least once", "Active coaches planning weekly"],
    outOfScope: ["Physical load monitoring with wearables", "Paid drill marketplace"],
    acceptance: [
      { given: "a coach with access to the club drill library", when: "they create a session plan with an objective, duration and at least one drill", then: "the plan is saved and the total duration equals the sum of its blocks" },
      { given: "a saved session plan", when: "the coach assigns it to Garuda U10 on a date", then: "a training item appears in the team schedule and on guardians' schedules for that team" },
      { given: "a plan used last week", when: "the coach duplicates it for next week", then: "a new independent plan is created and editing it does not change the original" },
      { given: "an assistant coach of the same team", when: "they open a shared plan", then: "they can view it, and can edit only if the head coach granted edit rights" },
      { given: "a guardian or player", when: "they open a team's training session", then: "they see the time, place and objective but not internal coach notes" },
    ],
    checklist: [
      "Link TrainingSession to an existing schedule item instead of duplicating date and venue fields",
      "Build the drill library with filters for age category and focus tags",
      "Build the session planner with drag-to-reorder blocks and a running duration total",
      "Add plan sharing rights (view or edit) for assistant coaches",
      "Make sure no player-level data is stored in plans or drills",
    ],
  },
  {
    id: "development",
    wave: 1,
    summary: "Competency-based development tracking: coach observations, periodic assessments, player goals and season reviews.",
    problem: "Feedback to young players is informal and lost when they change club; families never see structured progress.",
    roleJobs: [
      { role: "coach", job: "Record quick observations and complete a periodic assessment against the competency framework." },
      { role: "player", job: "Set personal goals and see feedback in plain language." },
      { role: "parent", job: "Read season reviews and support goals at home." },
      { role: "org_admin", job: "Ensure every player receives a review each term." },
    ],
    scope: {
      mvp: [
        "Coach observations linked to a session or match",
        "Assessment against the platform competency framework",
        "Player goals with progress status",
        "Season review shared with the player and guardians",
      ],
      next: ["Development plan per player", "Self-assessment for older players", "Review reminders for coaches"],
      later: ["Portable development history across organizations with consent", "Comparison to age-category benchmarks"],
    },
    entities: [
      { name: "CoachObservation", description: "A short, dated note on a player linked to an activity." },
      { name: "DevelopmentAssessment", description: "A formal rating against competencies for a period." },
      { name: "PlayerGoal", description: "A goal owned by the player with status and target date." },
      { name: "SeasonReview", description: "A published summary visible to the player and guardians." },
    ],
    consumes: ["Football ID and player profile", "Attendance and training records", "Match participation"],
    journeyEvents: ["Published season reviews as development_assessment events", "Achieved goals as achievement events"],
    privacy: [
      "Assessments are visible only to the player, linked guardians and the assessing organization.",
      "Observations inform assessments but are never published raw.",
      "Development data never becomes a public ranking.",
    ],
    dependsOn: ["attendance"],
    foundations: ["Player profile tabs", "Football Journey timeline (development_assessment and coach_observation sources)"],
    metrics: ["Players with a review each term", "Guardians who open published reviews", "Goals with progress updates"],
    outOfScope: ["Automated talent scores", "Sharing development data with scouts without consent"],
    acceptance: [
      { given: "a coach assigned to a player's team", when: "they record an observation linked to a session or match", then: "the observation is saved against that activity and is not visible to the player or guardians" },
      { given: "an assessment period is open", when: "the coach rates a player against every competency in the framework and submits", then: "the assessment is stored as a draft until the coach publishes it" },
      { given: "a player who sets a goal with a target date", when: "the goal's status changes", then: "the change is shown on the player's profile and to linked guardians" },
      { given: "a coach publishes a season review", when: "a linked guardian opens the child's profile", then: "the review is readable in plain language and appears on the Football Journey timeline" },
      { given: "a user from another organization or a scout", when: "they open the player's development tab", then: "no assessments, observations or reviews are shown" },
    ],
    checklist: [
      "Follow the deeper player-development documents listed below; they are the source of truth for this module",
      "Load the competency framework from configuration, not hard-coded UI",
      "Build the observation quick-entry flow from the session and match pages",
      "Build the assessment form with draft and publish states",
      "Build goals and season review on the existing player profile tabs",
      "Add access rules for player, guardian, assessing organization and coach with tests",
    ],
    docs: [
      "player-development-product-blueprint.md",
      "player-development-competency-framework.md",
      "player-development-data-model.md",
      "player-development-permission-model.md",
      "player-development-phase-1-specification.md",
    ],
  },
  {
    id: "finance",
    wave: 1,
    summary: "Membership fees, invoices and payment status for organizations and guardians.",
    problem: "Fee collection is manual and tracked in spreadsheets; guardians lack clear invoices and admins cannot see who has paid.",
    roleJobs: [
      { role: "org_admin", job: "Set fee plans, issue invoices and see outstanding balances." },
      { role: "parent", job: "See what is owed for each child, pay and download receipts." },
    ],
    scope: {
      mvp: [
        "Fee plans per organization (monthly, term, registration)",
        "Invoices per player, payable by the linked guardian",
        "Manual payment recording with proof upload",
        "Outstanding balance overview",
      ],
      next: ["Digital payment (QRIS and virtual account) through a licensed provider", "Automatic reminders", "Receipts as PDF"],
      later: ["Competition entry fees", "Financial reports for associations"],
    },
    entities: [
      { name: "FeePlan", description: "Price, period and the teams or categories it applies to." },
      { name: "Invoice", description: "Amount owed for a player and period, with due date and status." },
      { name: "Payment", description: "A recorded payment against one or more invoices." },
    ],
    consumes: ["Organization and team membership", "Guardian relationships", "Competition registrations"],
    journeyEvents: [],
    privacy: [
      "Payment status never appears on a player's Football ID or public profile.",
      "Coaches do not see payment data.",
      "Unpaid fees never block a child's identity or journey record.",
    ],
    dependsOn: [],
    foundations: ["Child payments shown in the guardian view (mock)"],
    metrics: ["Invoices paid by the due date", "Time admins spend on fee follow-up", "Guardians paying digitally"],
    outOfScope: ["Holding funds on the platform", "Loans or credit"],
    acceptance: [
      { given: "an admin creates a monthly fee plan for Garuda U10", when: "invoices are generated for the month", then: "each active member of the team gets exactly one invoice with the plan's amount and due date" },
      { given: "a guardian with two linked children", when: "they open payments", then: "they see each child's invoices separately with the amount in Rupiah and the status" },
      { given: "an admin records a manual payment with proof", when: "the payment covers the invoice amount", then: "the invoice becomes paid and the outstanding balance drops by that amount" },
      { given: "a child with an overdue invoice", when: "anyone views the child's Football ID, journey or match pages", then: "no payment status is shown and the child can still be checked in and selected" },
      { given: "a coach", when: "they open the team or a player", then: "no fee or payment data is visible" },
    ],
    checklist: [
      "Store amounts as integer Rupiah; format with the existing format helpers",
      "Build fee plan setup, invoice list and outstanding balance overview for admins",
      "Build the guardian payments view per child with receipt download",
      "Add manual payment recording with proof upload",
      "Keep payment data out of every player, team and journey view (add a test that guards this)",
      "Do not start digital payments until a licensed provider is chosen",
    ],
  },

  // ---------------- Wave 2 — Professional networks ----------------
  {
    id: "coach",
    wave: 2,
    summary: "A coaching career on the coach's own Football ID: licences, courses and coaching history across organizations.",
    problem: "Coaching qualifications and experience are scattered across paper certificates and cannot be verified by clubs.",
    roleJobs: [{ role: "coach", job: "Show verified licences and coaching history when joining a new club." }],
    scope: {
      mvp: ["Licence records (e.g. PSSI/AFC levels) with expiry", "Coaching history from team assignments", "Verification by the issuing body"],
      next: ["Course catalogue and enrolment", "Licence expiry reminders"],
      later: ["Coach development credits (CPD)", "Coach availability for opportunities"],
    },
    entities: [
      { name: "CoachLicence", description: "Level, issuer, issue and expiry date, verification status." },
      { name: "CoachingAssignment", description: "A dated assignment to a team, derived from Teams." },
      { name: "CourseEnrolment", description: "A course the coach is taking or has completed." },
    ],
    consumes: ["Coach Football ID", "Team coach assignments", "Organization records"],
    journeyEvents: ["Coach licence verified (on the coach's own journey)"],
    privacy: ["The coach controls which licences and history are public.", "Safeguarding checks are visible only to authorized administrators."],
    dependsOn: ["training"],
    foundations: ["Coach role and assigned-team access rules", "Coach overview"],
    metrics: ["Coaches with at least one verified licence", "Clubs viewing coach history when hiring"],
    outOfScope: ["Coach employment contracts", "Salary handling"],
    acceptance: [
      { given: "a coach adds a licence with level, issuer and expiry", when: "the issuing body verifies it", then: "the licence shows as verified on the coach's own Football ID" },
      { given: "a coach assigned to teams over several seasons", when: "they open their coaching history", then: "every assignment is listed with organization, team and dates, derived from Teams" },
      { given: "a licence that expired", when: "a club views the coach's profile", then: "the licence is marked expired and is no longer counted as valid" },
      { given: "a coach hides a licence from the public profile", when: "another organization views the profile", then: "that licence is not shown" },
    ],
    checklist: [
      "Add coach licences and history to the coach's existing Football ID page",
      "Derive CoachingAssignment from team coach assignments; never let users edit it directly",
      "Add licence verification states (pending, verified, expired, rejected) using the status system",
      "Add per-item public or private visibility controls for the coach",
      "Keep safeguarding checks visible only to authorized administrators",
    ],
  },
  {
    id: "referee",
    wave: 2,
    summary: "Match assignments, digital match reports and referee development for referees and organizers.",
    problem: "Referee appointments are arranged by phone and match reports are on paper, which delays results and disciplinary decisions.",
    roleJobs: [
      { role: "referee", job: "Accept assignments and submit the official match report from the pitch." },
      { role: "competition_organizer", job: "Appoint referees to fixtures and confirm results from reports." },
    ],
    scope: {
      mvp: ["Referee pool per competition", "Assign and accept match appointments", "Digital match report (score, cards, incidents)"],
      next: ["Availability calendar", "Organizer confirmation of reports into results"],
      later: ["Referee assessments", "Licence and fitness test records"],
    },
    entities: [
      { name: "RefereeAppointment", description: "A referee assigned to a match in a role (main, assistant)." },
      { name: "MatchReport", description: "The official record of a match submitted by the referee." },
      { name: "RefereeAssessment", description: "A performance review by an assessor." },
    ],
    consumes: ["Matches and competitions", "Team sheets", "Referee Football ID"],
    journeyEvents: ["Confirmed match reports feed match events on players' journeys"],
    privacy: ["Disciplinary details are visible to organizers and the teams involved only.", "Assessments are private to the referee and assessors."],
    dependsOn: [],
    foundations: ["Referee role", "Match detail with event timeline"],
    metrics: ["Matches with a digital report", "Time from final whistle to confirmed result"],
    outOfScope: ["Referee payments", "Live video review"],
    acceptance: [
      { given: "an organizer with a referee pool for a competition", when: "they appoint a main referee and two assistants to a match", then: "each referee receives an appointment they can accept or decline" },
      { given: "a referee declines an appointment", when: "the organizer opens the fixture", then: "the slot shows as open again" },
      { given: "the appointed main referee after the final whistle", when: "they submit the match report with score, cards and incidents", then: "the report is stored as submitted and the match shows 'result pending confirmation'" },
      { given: "a submitted report", when: "the organizer confirms it", then: "the match result and events update, and standings recalculate" },
      { given: "a parent or a team not involved in the match", when: "they open the match", then: "disciplinary details from the report are not shown" },
    ],
    checklist: [
      "Add referee pool management to competition pages for organizers",
      "Build appointment accept and decline for the referee role",
      "Build the mobile-first match report form, starting from the existing match event timeline",
      "Route confirmed reports into results and the existing standings calculation",
      "Add access rules for disciplinary details with tests",
    ],
  },
  {
    id: "opportunities",
    wave: 2,
    summary: "Trials, selection camps and scholarships that players can apply to with their Football ID.",
    problem: "Opportunities are shared in chat groups and reach only well-connected families; applications are repeated paperwork.",
    roleJobs: [
      { role: "player", job: "Find opportunities for my age and position and apply with my Football ID." },
      { role: "parent", job: "Approve a child's application and see its status." },
    ],
    scope: {
      mvp: ["Opportunity listings by organizations", "Eligibility by age category, gender and region", "Apply with Football ID; guardian approval for minors"],
      next: ["Application status tracking", "Shortlist and invitations"],
      later: ["Scholarship programs with sponsors", "Recommendations based on the journey"],
    },
    entities: [
      { name: "Opportunity", description: "A trial, camp or scholarship with dates, eligibility and capacity." },
      { name: "Application", description: "A player's application, with guardian approval and status." },
    ],
    consumes: ["Football ID and journey", "Guardian consent", "Organization records"],
    journeyEvents: ["Selection for a camp or academy as an achievement event"],
    privacy: [
      "Applicants share only the profile sections they choose.",
      "Minors cannot apply without guardian approval.",
      "Rejected applications are never visible to other organizations.",
    ],
    dependsOn: [],
    foundations: ["Guardian consent grants", "Football ID passport"],
    metrics: ["Applications per opportunity", "Applicants from outside the host organization", "Guardian approval time"],
    outOfScope: ["Paid placement fees", "Agent representation"],
    acceptance: [
      { given: "an organization publishes a U12 trial for players born 2014-2015 in South Sulawesi", when: "a player outside that range browses", then: "the trial is shown as not eligible with the reason" },
      { given: "an eligible minor applies with their Football ID", when: "the application is submitted", then: "it stays 'awaiting guardian approval' and the host organization cannot see it yet" },
      { given: "a guardian approves the application", when: "the host organization opens applicants", then: "they see only the profile sections the family chose to share" },
      { given: "an application is rejected", when: "another organization views the player", then: "the rejection is not visible anywhere" },
      { given: "an opportunity reaches its capacity", when: "another player tries to apply", then: "applying is closed and the listing shows it is full" },
    ],
    checklist: [
      "Build opportunity listing and detail pages with eligibility checks as a tested pure function",
      "Build the apply flow with share-section selection",
      "Add guardian approval through the existing consent and notification patterns",
      "Build application status tracking for families and an applicant list for the host",
      "Publish a selection as an achievement journey event",
    ],
  },
  {
    id: "scouting",
    wave: 2,
    summary: "Consent-based talent discovery for verified scouts, with guardian-approved contact.",
    problem: "Scouting of minors happens informally with no consent, verification or protection for families.",
    roleJobs: [
      { role: "scout", job: "Discover players who opted in and request contact through the platform." },
      { role: "parent", job: "Decide whether a child is discoverable and approve each contact request." },
      { role: "org_admin", job: "See and approve scout interest in the club's players." },
    ],
    scope: {
      mvp: ["Verified scout accounts", "Player discoverability opt-in (guardian consent for minors)", "Contact requests routed through guardian and club"],
      next: ["Scout watchlists", "Match attendance requests"],
      later: ["Scouting reports shared with consent", "Cross-region discovery"],
    },
    entities: [
      { name: "ScoutVerification", description: "Verified identity and affiliation of a scout." },
      { name: "DiscoverabilitySetting", description: "What a player exposes to scouts, set by player or guardian." },
      { name: "ContactRequest", description: "A scout's request to contact a player, with approvals." },
    ],
    consumes: ["Football ID", "Verified achievements and match history", "Guardian consent grants"],
    journeyEvents: [],
    privacy: [
      "Players under 18 are hidden from scouts by default.",
      "Scouts never see contact details; all contact goes through the platform.",
      "Every scout view of a profile is logged and visible to the guardian.",
    ],
    dependsOn: ["development", "opportunities"],
    foundations: ["Scout role", "Privacy & Consent controls in My Children"],
    metrics: ["Contact requests approved", "Guardian complaints (target zero)"],
    outOfScope: ["Transfer negotiation", "Public talent rankings"],
    acceptance: [
      { given: "a player under 18 with no guardian opt-in", when: "a verified scout searches", then: "the player never appears in results" },
      { given: "an unverified scout account", when: "it tries to search or view profiles", then: "access is denied until verification is complete" },
      { given: "a guardian turns on discoverability for selected profile sections", when: "a verified scout views the child", then: "only those sections are shown and no contact details are visible" },
      { given: "a scout sends a contact request", when: "the guardian and club review it", then: "contact is only opened after both approve, and either can decline" },
      { given: "a scout views a child's profile", when: "the guardian opens consent settings", then: "the view is listed with the scout's name, affiliation and date" },
    ],
    checklist: [
      "Build scout verification before any discovery feature",
      "Connect discoverability to the existing Privacy & Consent controls in My Children (default off for minors)",
      "Build discovery search over opted-in players only, filtered on the server side",
      "Build the contact request flow with guardian and club approvals",
      "Add a profile view log visible to guardians",
      "Add access tests that prove hidden players never leak into results",
    ],
  },

  // ---------------- Wave 3 — Governance & intelligence ----------------
  {
    id: "analytics",
    wave: 3,
    summary: "Insights for organizations and organizers across attendance, development, competitions and membership.",
    problem: "Clubs and organizers have data in the platform but no way to answer simple questions about growth, retention and results.",
    roleJobs: [
      { role: "org_admin", job: "Track retention, attendance and development coverage across teams." },
      { role: "competition_organizer", job: "See participation, results and fair-play trends across a competition." },
    ],
    scope: {
      mvp: ["Organization dashboard: members, retention, attendance", "Competition dashboard: participation and results"],
      next: ["Player pathway analytics (category to category)", "Exportable reports (CSV, PDF)"],
      later: ["Benchmarks across organizations (anonymized)", "Custom report builder"],
    },
    entities: [
      { name: "MetricSnapshot", description: "Pre-computed metrics per organization or competition and period." },
      { name: "ReportDefinition", description: "A saved report with filters and columns." },
    ],
    consumes: ["All source domains (read-only)"],
    journeyEvents: [],
    privacy: [
      "Analytics are derived and never overwrite official records.",
      "Cross-organization benchmarks use anonymized, aggregated data only.",
      "Small groups (fewer than 5 players) are not shown individually in aggregates.",
    ],
    dependsOn: ["attendance", "development"],
    foundations: ["Organization and competition dashboards with stat cards", "Standings calculation"],
    metrics: ["Admins opening analytics monthly", "Reports exported"],
    outOfScope: ["Selling data to third parties", "Individual player rankings"],
    acceptance: [
      { given: "an organization admin", when: "they open analytics for the last season", then: "member count, retention and attendance rate match the source records" },
      { given: "a competition organizer", when: "they open competition analytics", then: "participation by category and results match the competition's matches" },
      { given: "a filter that leaves fewer than 5 players in a group", when: "the dashboard renders", then: "that group is hidden or merged and no individual values are shown" },
      { given: "an admin exports a report", when: "the export completes", then: "the file contains the same numbers as the screen and no player contact details" },
    ],
    checklist: [
      "Compute metrics in pure, tested functions from repository data; never write back to source records",
      "Build organization and competition dashboards with the existing stat card and data table components",
      "Apply the small-group (fewer than 5) rule in one shared helper with tests",
      "Add CSV export in the Next release",
      "Make sure each role only sees metrics for organizations or competitions it manages",
    ],
  },
  {
    id: "association",
    wave: 3,
    summary: "Regional governance for city and provincial associations: club registry, sanctioning and licensing.",
    problem: "Associations keep club and competition records separately from clubs, so registration and sanctioning are slow and hard to verify.",
    roleJobs: [
      { role: "org_admin", job: "Register the organization with the association and keep its status valid." },
      { role: "competition_organizer", job: "Request sanctioning for a competition and receive approval." },
    ],
    scope: {
      mvp: ["Organization registration and renewal with the association", "Competition sanctioning requests", "Status visible on organization and competition pages"],
      next: ["Organization licensing criteria checklist", "Association announcements"],
      later: ["Regional disciplinary records", "Association fee collection (via Finance)"],
    },
    entities: [
      { name: "OrganizationRegistration", description: "An organization's registration with an association, with validity." },
      { name: "SanctionRequest", description: "A competition's request for official approval." },
      { name: "LicenceCriterion", description: "A requirement an organization must meet." },
    ],
    consumes: ["Organizations and competitions", "Membership and Digital KTA", "Association workspace"],
    journeyEvents: ["Participation in sanctioned competitions marked as verified on players' journeys"],
    privacy: ["Associations see organization-level data; player data only as needed for registration.", "Every approval is recorded with who approved and when."],
    dependsOn: ["analytics"],
    foundations: ["Association role workspace", "Member directory, membership review and Digital KTA", "Competition oversight"],
    metrics: ["Organizations registered", "Median time to sanction a competition"],
    outOfScope: ["Replacing national federation systems", "Legal entity registration"],
    acceptance: [
      { given: "an organization admin submits a registration with the provincial association", when: "the association approves it", then: "the organization page shows 'Registered' with the validity end date" },
      { given: "a registration whose validity has ended", when: "anyone views the organization", then: "the status shows as expired and the admin sees a renewal prompt" },
      { given: "an organizer requests sanctioning for Makassar Youth Cup 2027", when: "the association approves it", then: "the competition shows 'Sanctioned' and the approval records who approved and when" },
      { given: "an association official", when: "they review an organization", then: "they see organization-level data and only the player data needed for registration" },
    ],
    checklist: [
      "Build on the existing association workspace, member directory, membership review and Digital KTA",
      "Build organization registration and renewal with validity dates",
      "Build competition sanctioning requests and the approval queue",
      "Show registration and sanction status on organization and competition pages using the status system",
      "Record every approval with approver and timestamp (audit trail)",
    ],
  },
  {
    id: "federation",
    wave: 3,
    summary: "A national player registry with transfers, eligibility checks and federation-wide reporting.",
    problem: "Eligibility and transfers between clubs are checked manually, which allows age fraud and duplicate registrations.",
    roleJobs: [{ role: "competition_organizer", job: "Check player eligibility against the national registry before a match." }],
    scope: {
      mvp: ["Registry sync of verified Football IDs", "Eligibility check (age category, registration, suspension)"],
      next: ["Transfer requests between organizations", "Duplicate identity detection"],
      later: ["Integration with national federation systems", "Federation-wide reporting"],
    },
    entities: [
      { name: "RegistryEntry", description: "A verified player's national registration record." },
      { name: "Transfer", description: "A move between organizations with approvals and dates." },
      { name: "EligibilityCheck", description: "A logged check of a player for a competition category." },
    ],
    consumes: ["Football ID verification", "Affiliations", "Association registrations"],
    journeyEvents: ["Approved transfers as join and leave events", "Registry verification as a verification event"],
    privacy: ["Identity documents are visible only to verifying officials.", "Transfers require the player's (or guardian's) confirmation."],
    dependsOn: ["association"],
    foundations: ["Football ID verification status", "Affiliation history on the journey"],
    metrics: ["Eligibility disputes per competition", "Duplicate identities detected"],
    outOfScope: ["Professional contract registration", "International transfers"],
    acceptance: [
      { given: "a player with a verified Football ID", when: "the registry sync runs", then: "exactly one registry entry exists for that player" },
      { given: "an organizer checks a team sheet before a U10 match", when: "a player is too old, unregistered or suspended", then: "the player is flagged with the reason and the check is logged" },
      { given: "a transfer request between two organizations", when: "the player (or guardian) has not confirmed", then: "the transfer cannot be approved" },
      { given: "an approved transfer", when: "anyone views the player's journey", then: "it shows a leave event for the old organization and a join event for the new one with the same date" },
    ],
    checklist: [
      "Build the registry entry for verified Football IDs only",
      "Build the eligibility check as a tested pure function (age category, registration, suspension)",
      "Add eligibility flags to team sheets in competition pages",
      "Build the transfer flow with player or guardian confirmation and both organizations' approvals",
      "Keep identity documents visible only to verifying officials",
    ],
  },
  {
    id: "ai",
    wave: 3,
    summary: "An assistant that answers questions about your own football data and drafts summaries, within your permissions.",
    problem: "Useful information is spread across modules; busy coaches and guardians need quick answers and summaries.",
    roleJobs: [
      { role: "coach", job: "Ask who missed training this month or draft session ideas." },
      { role: "parent", job: "Get a plain-language summary of a child's month." },
      { role: "org_admin", job: "Ask for quick operational summaries before meetings." },
    ],
    scope: {
      mvp: ["Questions answered from data the user can already see", "Summaries of a player's month for guardians", "Every answer shows its sources"],
      next: ["Draft session plans from the drill library", "Lineup suggestions based on availability"],
      later: ["Bahasa Indonesia voice input", "Proactive weekly digests"],
    },
    entities: [
      { name: "AssistantConversation", description: "A user's conversation, private to them." },
      { name: "AssistantAnswer", description: "A response with the records it was based on." },
    ],
    consumes: ["Any domain, strictly through the user's existing permissions"],
    journeyEvents: [],
    privacy: [
      "The assistant can only read what the signed-in user is allowed to see.",
      "Suggestions are advisory and never change official records.",
      "Children's data is never used to train external models.",
    ],
    dependsOn: ["analytics"],
    foundations: ["Role-based access rules for coaches, guardians and associations"],
    metrics: ["Answers rated helpful", "Answers with correct sources"],
    outOfScope: ["Automated selection or talent decisions", "Medical advice"],
    acceptance: [
      { given: "a coach asks 'who missed training this month?'", when: "the assistant answers", then: "the answer lists only players from teams the coach is assigned to and links to the source records" },
      { given: "a guardian asks for a summary of a child's month", when: "the assistant answers", then: "it covers only that guardian's linked children and is written in plain language" },
      { given: "a user asks about data they cannot see", when: "the assistant answers", then: "it says it cannot access that information and reveals nothing" },
      { given: "the assistant suggests a lineup or session", when: "the user does nothing", then: "no official record is changed" },
    ],
    checklist: [
      "Route every assistant data read through the same access rules the pages use",
      "Run model calls on the server only, through the Lovable AI gateway",
      "Show sources under every answer",
      "Store conversations privately per user",
      "Add tests that prove cross-role leaks are impossible before launch",
    ],
  },
];

export const getBlueprint = (id: string) => MODULE_BLUEPRINTS.find((b) => b.id === id);
export const blueprintsByWave = (wave: RolloutWave) => MODULE_BLUEPRINTS.filter((b) => b.wave === wave);
