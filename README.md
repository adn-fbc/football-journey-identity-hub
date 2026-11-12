# Football ID Hub

# PROJECT: YOUTH FOOTBALL ECOSYSTEM PLATFORM

Act as a Senior Product Designer, UX Architect, and SaaS Design System Expert.

Before generating the application, understand the product vision and architecture below.

## PRODUCT VISION

We are NOT building a simple football academy or SSB management application.

We are building a scalable Youth Football Ecosystem Platform and future Football Data Infrastructure.

The platform connects:

Player → Parent/Guardian → Football Organization → Coach → Competition → Match → Development → Opportunity

The long-term ecosystem may also include:

Referee → Scout → Academy → Association → Federation

The central concept of the platform is:

# FOOTBALL ID

Every person should have one persistent football identity.

A player's Football ID belongs to the player and remains throughout their football journey.

Organizations do not own the player.

Organizations only have a relationship with the player.

Core principle:

# THE PLAYER OWNS THE JOURNEY

The platform is trusted infrastructure that manages identity, permissions, history, and connectivity.

---

# IMPORTANT DESIGN STRATEGY

Do NOT attempt to build every feature and every user role at once.

The purpose of this phase is to create a strong, scalable UI/UX foundation.

Focus on:

1. Football Identity
2. Player Profile
3. Parent / Guardian
4. Organization / SSB / Academy
5. Team Management
6. Competition
7. Match

Use a modular architecture so future modules can be added without redesigning the entire application.

Do NOT build complex backend logic.

Use realistic mock data and prototype interactions.

Prioritize:

- Information architecture
- User experience
- Navigation
- Design system
- Responsive layouts
- Reusable UI components
- Clear dashboard structure

---

# APPLICATION STRUCTURE

Create one unified platform with a modular application shell.

Main navigation:

1. Overview
2. Football ID
3. Players
4. Organizations
5. Teams
6. Competitions
7. Matches
8. Schedule
9. Notifications
10. Settings

Future modules should NOT be fully built now, but the architecture must be prepared for:

- Training
- Attendance
- Player Development
- Finance & Payments
- Coach Platform
- Referee Platform
- Scouting
- Opportunities
- Analytics
- Association
- Federation
- AI Assistant

---

# USER EXPERIENCE MODEL

One person may have multiple roles.

Example:

A person can be:

- Parent
- Coach
- Organization staff

Do NOT create separate accounts for each role.

Design a role-aware experience with a clear role switcher.

Example:

[ Current Role: Organization Admin ▼ ]

Possible roles:

- Player
- Parent / Guardian
- Coach
- Organization Admin
- Competition Organizer

The interface should adapt based on the active role.

---

# DESIGN DIRECTION

Create a premium, modern, trustworthy sports technology platform.

The visual identity should feel like:

- Modern SaaS
- Professional sports technology
- Data-driven
- Youth-friendly
- Trustworthy
- Clean
- Scalable

Avoid:

- Overly playful children's app design
- Generic football game aesthetics
- Excessive gradients
- Excessive cards
- Visual clutter

Use:

- Clean typography
- Clear hierarchy
- Spacious layouts
- Reusable components
- Accessible contrast
- Clear status indicators
- Consistent spacing

The interface must work for:

Desktop → primary experience for organizations and competition management

Mobile → primary experience for players and parents

---

# DESIGN SYSTEM

First create a reusable design system.

Include:

## Typography

Create a clear hierarchy:

- Display
- H1
- H2
- H3
- Body
- Small text
- Labels

## Components

Create reusable components for:

- Buttons
- Icon buttons
- Inputs
- Search
- Filters
- Select dropdowns
- Tabs
- Status badges
- Avatar
- Player card
- Organization card
- Match card
- Statistic card
- Empty state
- Loading state
- Error state
- Confirmation modal
- Data table
- Pagination

## Status System

Create consistent status styles for:

- Active
- Pending
- Verified
- Draft
- Completed
- Cancelled
- Archived

---

# CORE UI/UX SCREENS TO DESIGN

## 1. APPLICATION SHELL

Create:

- Desktop sidebar
- Mobile bottom navigation
- Top navigation
- Global search
- Notification center
- Profile menu
- Role switcher

The application shell must be reusable across all future modules.

---

## 2. OVERVIEW DASHBOARD

Create a role-aware dashboard.

For Organization Admin, display:

- Total players
- Active teams
- Upcoming training
- Upcoming matches
- Recent registrations

Include:

- Quick actions
- Upcoming activities
- Recent activity
- Attention required section

Do not overload the dashboard.

Focus on actionable information.

---

## 3. FOOTBALL ID

Create a Football Identity experience.

The Football ID page should include:

- Profile photo
- Player name
- Unique Football ID
- Birth year
- Primary position
- Preferred foot
- Current organization
- Current team
- Verification status

Include a visual Football Journey Timeline.

Example:

2024
Joined SSB Alpha

↓

2025
Played in Makassar Youth Cup

↓

2026
Joined Team U10

The timeline should feel like a long-term football passport.

Important:

The Football ID must visually communicate persistent identity and history.

---

## 4. PLAYER PROFILE

Create a comprehensive player profile.

Use tabs:

Overview
Journey
Teams
Matches
Achievements
Documents

For this phase, use realistic mock data.

The Overview should clearly show:

- Identity
- Current football activity
- Organization relationship
- Team
- Recent matches
- Key achievements

Do not expose sensitive personal information unnecessarily.

---

## 5. PARENT / GUARDIAN EXPERIENCE

Create a "My Children" experience.

The parent dashboard should display child cards.

Each child card should show:

- Photo
- Name
- Team
- Upcoming activity
- Organization
- Attendance summary

Create a child profile experience where the guardian can view:

- Football journey
- Schedule
- Matches
- Notifications
- Consent settings

Include a Privacy & Consent section.

Example:

Allow scouting opportunities

[ Toggle ON / OFF ]

The design should communicate trust and control.

---

## 6. ORGANIZATION MODULE

Create an Organization Dashboard.

Include:

- Organization profile
- Player summary
- Team summary
- Upcoming activities
- Recent registrations

Create pages for:

### Players

Features:

- Search
- Filters
- Player table
- Status
- Team
- Age category

### Player Detail

Show the player's relationship with the organization.

Do NOT imply that the organization owns the player.

Use wording such as:

Current Member
Membership History
Organization Relationship

---

## 7. TEAM MODULE

Create a Team Management experience.

Team page should include:

- Team name
- Age category
- Season
- Coach
- Player roster
- Upcoming matches
- Recent activity

Create a roster interface that is easy to scan.

---

## 8. COMPETITION MODULE

Create a Competition Dashboard.

Competition structure:

Competition
→ Categories
→ Participating Teams
→ Schedule
→ Matches
→ Results
→ Standings

Create:

### Competition List

Display:

- Competition name
- Status
- Categories
- Teams
- Date range

### Competition Detail

Use clear tabs:

Overview
Categories
Teams
Schedule
Matches
Standings

Do not build complex tournament automation yet.

Focus on excellent information architecture and UI.

---

## 9. MATCH EXPERIENCE

Create a Match Detail page.

Display:

- Competition
- Date
- Venue
- Team A
- Score
- Team B
- Match status

Use a timeline layout for match events.

Prepare empty sections for future:

- Statistics
- Match report
- Video
- Referee information

These can remain as placeholders or "Coming Soon" sections.

---

# RESPONSIVE DESIGN

Design both desktop and mobile experiences.

Desktop:

- Organization management
- Competition management
- Data tables

Mobile:

- Player profile
- Parent experience
- Schedule
- Match information

Do not simply shrink the desktop interface.

Create responsive UX appropriate to each device.

---

# MOCK DATA

Use realistic Indonesian football ecosystem examples.

Example:

Organization:
SSB Garuda Makassar

Player:
Muhammad Rizky Pratama

Football ID:
IDN-FB-2016-000123

Competition:
Makassar Youth Cup 2027

Team:
Garuda U10

Use fictional data only.

---

# FUTURE-PROOFING

The UI architecture must support future modules without redesigning the application shell.

Future modules:

1. Training
2. Attendance
3. Player Development
4. Finance & Payments
5. Coach
6. Referee
7. Scouting
8. Opportunities
9. Analytics
10. Association
11. Federation
12. AI Assistant

Do not fully design these modules now.

Only ensure:

- Navigation can scale
- Components are reusable
- Page layouts are modular
- Role-based access can expand

---

# IMPORTANT OUTPUT

Start by building:

1. Design System
2. Application Shell
3. Overview Dashboard
4. Football ID
5. Player Profile
6. Organization Dashboard
7. Team Module
8. Competition Module
9. Match Detail

Use mock data.

Do not implement real payment, external APIs, complex authentication, AI, or production backend at this stage.

The goal of this phase is:

# CREATE A HIGH-QUALITY MODULAR UI/UX FOUNDATION THAT CAN LATER BE EXPORTED AND CONTINUED IN VS CODE WITH GITHUB COPILOT.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44b8365f-e357-4c6d-b1d7-bdf804038a28).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
