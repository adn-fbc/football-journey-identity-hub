/**
 * Fictional mock data for the Indonesian youth football ecosystem prototype.
 * The prototype world is frozen at MOCK_TODAY so "upcoming" / "recent" stay stable.
 */
import rizkyPhoto from "@/assets/player-rizky.jpg";
import aisyahPhoto from "@/assets/player-aisyah.jpg";
import type {
  Achievement, Competition, Guardian, JourneyEvent, Match, Membership, Notification, Organization,
  Player, PlayerDocument, ScheduleItem, Team,
} from "./types";

export const MOCK_TODAY = "2027-02-14";
export const CURRENT_SEASON = "2026/27";

export const CURRENT_USER = {
  name: "Andi Pratama",
  email: "andi.pratama@example.id",
  footballId: "IDN-FB-1986-004512",
  initials: "AP",
};

export const organizations: Organization[] = [
  { id: "garuda", name: "SSB Garuda Makassar", short: "GRD", type: "SSB", city: "Makassar", province: "Sulawesi Selatan", founded: 2012, verification: "verified", color: "160", players: 148, teams: 8, coaches: 11, homeVenue: "Lapangan Hasanuddin, Makassar", description: "Grassroots football school focused on long-term player development from U6 to U14." },
  { id: "phinisi", name: "Akademi Phinisi Muda", short: "PHN", type: "Academy", city: "Makassar", province: "Sulawesi Selatan", founded: 2016, verification: "verified", color: "250", players: 112, teams: 6, coaches: 8, homeVenue: "Stadion Mini Tamalanrea", description: "Performance academy with a strong technical curriculum." },
  { id: "losari", name: "SSB Losari Putra", short: "LSR", type: "SSB", city: "Makassar", province: "Sulawesi Selatan", founded: 2009, verification: "verified", color: "25", players: 96, teams: 5, coaches: 6, homeVenue: "Lapangan Pantai Losari", description: "Community football school serving the coastal districts." },
  { id: "gowa", name: "Gowa Football Academy", short: "GFA", type: "Academy", city: "Sungguminasa", province: "Sulawesi Selatan", founded: 2018, verification: "pending", color: "65", players: 74, teams: 4, coaches: 5, homeVenue: "Lapangan Syekh Yusuf, Gowa", description: "Young academy growing fast in Gowa regency." },
  { id: "alpha", name: "SSB Alpha Maros", short: "ALP", type: "SSB", city: "Maros", province: "Sulawesi Selatan", founded: 2014, verification: "verified", color: "300", players: 58, teams: 4, coaches: 4, homeVenue: "Lapangan Pallantikang, Maros", description: "Neighbourhood SSB where many Maros players take their first steps." },
  { id: "toraja", name: "SSB Toraja Raya", short: "TRJ", type: "SSB", city: "Rantepao", province: "Sulawesi Selatan", founded: 2015, verification: "verified", color: "200", players: 63, teams: 4, coaches: 4, homeVenue: "Lapangan Bakti, Rantepao", description: "Highland football school with a strong U12 programme." },
];

export const teams: Team[] = [
  { id: "garuda-u10", name: "Garuda U10", orgId: "garuda", ageCategory: "U10", season: CURRENT_SEASON, coach: "Coach Hendra Saputra", assistant: "Coach Wahyu Nugroho", record: { w: 7, d: 2, l: 1 }, status: "active" },
  { id: "garuda-u8", name: "Garuda U8", orgId: "garuda", ageCategory: "U8", season: CURRENT_SEASON, coach: "Coach Andi Pratama", record: { w: 4, d: 3, l: 2 }, status: "active" },
  { id: "garuda-u12", name: "Garuda U12", orgId: "garuda", ageCategory: "U12", season: CURRENT_SEASON, coach: "Coach Irfan Maulana", assistant: "Coach Rudy Hartono", record: { w: 6, d: 1, l: 3 }, status: "active" },
  { id: "garuda-putri-u9", name: "Garuda Putri U9", orgId: "garuda", ageCategory: "U9", season: CURRENT_SEASON, coach: "Coach Sri Wahyuni", record: { w: 3, d: 1, l: 1 }, status: "active" },
  { id: "garuda-u14", name: "Garuda U14", orgId: "garuda", ageCategory: "U14", season: CURRENT_SEASON, coach: "Coach Bambang Ismail", record: { w: 0, d: 0, l: 0 }, status: "draft" },
  { id: "phinisi-u10", name: "Phinisi U10", orgId: "phinisi", ageCategory: "U10", season: CURRENT_SEASON, coach: "Coach Darmawan", record: { w: 6, d: 1, l: 3 }, status: "active" },
  { id: "phinisi-u12", name: "Phinisi U12", orgId: "phinisi", ageCategory: "U12", season: CURRENT_SEASON, coach: "Coach Yusran", record: { w: 7, d: 0, l: 3 }, status: "active" },
  { id: "losari-u10", name: "Losari U10", orgId: "losari", ageCategory: "U10", season: CURRENT_SEASON, coach: "Coach Syamsul Bahri", record: { w: 4, d: 3, l: 3 }, status: "active" },
  { id: "losari-u12", name: "Losari U12", orgId: "losari", ageCategory: "U12", season: CURRENT_SEASON, coach: "Coach Rahman", record: { w: 3, d: 2, l: 5 }, status: "active" },
  { id: "gowa-u10", name: "Gowa FA U10", orgId: "gowa", ageCategory: "U10", season: CURRENT_SEASON, coach: "Coach Ansar", record: { w: 2, d: 2, l: 6 }, status: "active" },
  { id: "gowa-u12", name: "Gowa FA U12", orgId: "gowa", ageCategory: "U12", season: CURRENT_SEASON, coach: "Coach Faisal", record: { w: 5, d: 1, l: 4 }, status: "active" },
  { id: "alpha-u10", name: "Alpha U10", orgId: "alpha", ageCategory: "U10", season: CURRENT_SEASON, coach: "Coach Ridwan", record: { w: 3, d: 2, l: 5 }, status: "active" },
  { id: "toraja-u10", name: "Toraja Raya U10", orgId: "toraja", ageCategory: "U10", season: CURRENT_SEASON, coach: "Coach Paulus Rante", record: { w: 5, d: 1, l: 4 }, status: "active" },
  { id: "toraja-u12", name: "Toraja Raya U12", orgId: "toraja", ageCategory: "U12", season: CURRENT_SEASON, coach: "Coach Yohanes", record: { w: 8, d: 1, l: 1 }, status: "active" },
  { id: "garuda-u8b", name: "Phinisi U8", orgId: "phinisi", ageCategory: "U8", season: CURRENT_SEASON, coach: "Coach Nita", record: { w: 3, d: 2, l: 4 }, status: "active" },
  { id: "losari-u8", name: "Losari U8", orgId: "losari", ageCategory: "U8", season: CURRENT_SEASON, coach: "Coach Halim", record: { w: 2, d: 4, l: 3 }, status: "active" },
];

const p = (
  n: number, name: string, birthYear: number, position: Player["position"], positionLabel: string,
  foot: Player["foot"], teamId: string | undefined, jersey: number | undefined, membership: Player["membership"],
  verification: Player["verification"], memberSince: string | undefined, stats: Player["stats"], attendance: number,
  extra: Partial<Player> = {},
): Player => ({
  id: `p-${n}`,
  footballId: `IDN-FB-${birthYear}-${String(n).padStart(6, "0")}`,
  name, birthYear, gender: "M", position, positionLabel, foot,
  orgId: teamId ? teams.find((t) => t.id === teamId)?.orgId : undefined,
  teamId, jersey, membership, verification, memberSince, stats, attendance, guardianIds: [],
  ...extra,
});

export const players: Player[] = [
  p(123, "Muhammad Rizky Pratama", 2016, "FW", "Striker", "Right", "garuda-u10", 9, "active", "verified", "2025-07-12", { matches: 24, goals: 17, assists: 6, minutes: 980 }, 94, { nickname: "Rizky", photo: rizkyPhoto, guardianIds: ["g-1"] }),
  p(124, "Andi Fadhil Ramadhan", 2016, "MF", "Central midfielder", "Right", "garuda-u10", 8, "active", "verified", "2024-08-03", { matches: 26, goals: 5, assists: 11, minutes: 1120 }, 91),
  p(131, "Ahmad Dzaky Al-Fatih", 2016, "GK", "Goalkeeper", "Right", "garuda-u10", 1, "active", "verified", "2023-07-20", { matches: 25, goals: 0, assists: 0, minutes: 1250 }, 97),
  p(132, "Rafael Kurniawan", 2016, "DF", "Centre-back", "Left", "garuda-u10", 4, "active", "verified", "2024-01-15", { matches: 22, goals: 1, assists: 2, minutes: 1010 }, 88),
  p(133, "Daffa Aditya Nugraha", 2016, "DF", "Full-back", "Right", "garuda-u10", 2, "active", "verified", "2024-07-08", { matches: 21, goals: 0, assists: 3, minutes: 870 }, 85),
  p(134, "Muh. Alif Syahputra", 2016, "MF", "Winger", "Left", "garuda-u10", 11, "active", "pending", "2026-08-01", { matches: 12, goals: 4, assists: 4, minutes: 460 }, 79),
  p(135, "Farhan Hidayat", 2016, "MF", "Defensive midfielder", "Right", "garuda-u10", 6, "active", "verified", "2024-07-08", { matches: 23, goals: 1, assists: 4, minutes: 990 }, 92),
  p(136, "Arya Wicaksono", 2016, "FW", "Forward", "Both", "garuda-u10", 10, "active", "verified", "2025-01-10", { matches: 20, goals: 9, assists: 7, minutes: 820 }, 90),
  p(137, "Kevin Tandiarrang", 2016, "DF", "Centre-back", "Right", "garuda-u10", 5, "active", "verified", "2025-07-12", { matches: 18, goals: 2, assists: 0, minutes: 760 }, 83),
  p(138, "Galih Saputra", 2016, "DF", "Full-back", "Left", "garuda-u10", 3, "pending", "pending", undefined, { matches: 0, goals: 0, assists: 0, minutes: 0 }, 0),
  p(139, "Nabil Akbar", 2016, "GK", "Goalkeeper", "Right", "garuda-u10", 12, "active", "verified", "2025-07-12", { matches: 4, goals: 0, assists: 0, minutes: 120 }, 86),
  p(140, "Rangga Mahendra", 2014, "MF", "Attacking midfielder", "Right", "garuda-u12", 10, "active", "verified", "2022-07-02", { matches: 31, goals: 12, assists: 14, minutes: 1640 }, 93),
  p(141, "Ilham Basri", 2014, "FW", "Striker", "Right", "garuda-u12", 9, "active", "verified", "2023-01-09", { matches: 28, goals: 19, assists: 5, minutes: 1480 }, 89),
  p(142, "Yusuf Hamzah", 2018, "MF", "Midfielder", "Right", "garuda-u8", 7, "active", "verified", "2025-07-12", { matches: 14, goals: 3, assists: 2, minutes: 420 }, 95),
  p(143, "Reza Firmansyah", 2018, "FW", "Forward", "Left", "garuda-u8", 9, "pending", "pending", undefined, { matches: 0, goals: 0, assists: 0, minutes: 0 }, 0),
  p(144, "Dimas Prasetyo", 2013, "DF", "Centre-back", "Right", "garuda-u14", 4, "archived", "verified", "2020-07-11", { matches: 52, goals: 3, assists: 2, minutes: 2900 }, 0),
  p(125, "Aisyah Putri Pratama", 2018, "MF", "Midfielder", "Right", "garuda-putri-u9", 7, "active", "verified", "2026-01-18", { matches: 8, goals: 2, assists: 3, minutes: 260 }, 98, { gender: "F", nickname: "Aisyah", photo: aisyahPhoto, guardianIds: ["g-1"] }),
  p(145, "Naila Ramadhani", 2018, "DF", "Defender", "Right", "garuda-putri-u9", 4, "active", "verified", "2026-01-18", { matches: 8, goals: 0, assists: 1, minutes: 300 }, 92, { gender: "F" }),
  p(146, "Bagas Setiawan", 2016, "MF", "Midfielder", "Right", "garuda-u10", 14, "pending", "pending", undefined, { matches: 0, goals: 0, assists: 0, minutes: 0 }, 0),
  p(147, "Fikri Anugrah", 2014, "GK", "Goalkeeper", "Right", "garuda-u12", 1, "active", "verified", "2022-07-02", { matches: 29, goals: 0, assists: 0, minutes: 1700 }, 96),
];

export const guardians: Guardian[] = [
  { id: "g-1", name: "Andi Pratama", footballId: CURRENT_USER.footballId, relation: "Father", childIds: ["p-123", "p-125"] },
];

export const journeys: Record<string, JourneyEvent[]> = {
  "p-123": [
    { id: "j1", date: "2022-03-04", year: 2022, type: "identity", title: "Football ID created", detail: "Registered by guardian Andi Pratama. Identity verified with birth certificate.", verifiedBy: "Football ID Registry" },
    { id: "j2", date: "2022-07-16", year: 2022, type: "join", title: "Joined SSB Alpha Maros", detail: "First football school · U6 group", orgId: "alpha", verifiedBy: "SSB Alpha Maros" },
    { id: "j3", date: "2024-02-10", year: 2024, type: "competition", title: "Festival Sepak Bola Usia Dini", detail: "First competition · Alpha U8 · 4 matches, 3 goals", orgId: "alpha" },
    { id: "j4", date: "2025-03-22", year: 2025, type: "competition", title: "Played in Makassar Youth Cup 2025", detail: "Alpha U10 · Quarter-finalist · 5 matches, 6 goals", orgId: "alpha" },
    { id: "j5", date: "2025-06-30", year: 2025, type: "leave", title: "Completed membership at SSB Alpha Maros", detail: "Relationship closed by guardian · history preserved", orgId: "alpha" },
    { id: "j6", date: "2025-07-12", year: 2025, type: "join", title: "Joined SSB Garuda Makassar", detail: "Membership approved by guardian", orgId: "garuda", verifiedBy: "SSB Garuda Makassar" },
    { id: "j7", date: "2026-01-05", year: 2026, type: "achievement", title: "Top scorer · Liga Anak Makassar 2026", detail: "11 goals in 8 matches", orgId: "garuda" },
    { id: "j8", date: "2026-07-20", year: 2026, type: "team", title: "Joined Team Garuda U10", detail: "Season 2026/27 · Jersey #9 · Striker", orgId: "garuda" },
    { id: "j9", date: "2027-01-24", year: 2027, type: "competition", title: "Makassar Youth Cup 2027", detail: "Garuda U10 · Group A · in progress", orgId: "garuda" },
  ],
  "p-125": [
    { id: "a1", date: "2025-11-02", year: 2025, type: "identity", title: "Football ID created", detail: "Registered by guardian Andi Pratama", verifiedBy: "Football ID Registry" },
    { id: "a2", date: "2026-01-18", year: 2026, type: "join", title: "Joined SSB Garuda Makassar", detail: "Garuda Putri U9", orgId: "garuda", verifiedBy: "SSB Garuda Makassar" },
    { id: "a3", date: "2026-10-09", year: 2026, type: "competition", title: "Festival Putri Sulsel 2026", detail: "First tournament · 3 matches, 2 goals", orgId: "garuda" },
  ],
};

export const memberships: Record<string, Membership[]> = {
  "p-123": [
    { orgId: "garuda", role: "Player", from: "2025-07-12", status: "active", teams: ["Garuda U10"] },
    { orgId: "alpha", role: "Player", from: "2022-07-16", to: "2025-06-30", status: "completed", teams: ["Alpha U6", "Alpha U8", "Alpha U10"] },
  ],
};

export const achievements: Record<string, Achievement[]> = {
  "p-123": [
    { id: "ac1", title: "Top Scorer", competition: "Liga Anak Makassar 2026", year: 2026, kind: "award" },
    { id: "ac2", title: "Runner-up", competition: "Festival Garuda Cup 2026", year: 2026, kind: "trophy" },
    { id: "ac3", title: "Quarter-finalist", competition: "Makassar Youth Cup 2025", year: 2025, kind: "trophy" },
    { id: "ac4", title: "First competitive goal", competition: "Festival Sepak Bola Usia Dini 2024", year: 2024, kind: "milestone" },
    { id: "ac5", title: "25 career matches", competition: "Football ID milestone", year: 2027, kind: "milestone" },
  ],
};

export const documents: Record<string, PlayerDocument[]> = {
  "p-123": [
    { id: "d1", name: "Birth certificate", status: "verified", updated: "2022-03-04", visibleTo: "Guardian · Registry" },
    { id: "d2", name: "Family card (KK)", status: "verified", updated: "2022-03-04", visibleTo: "Guardian · Registry" },
    { id: "d3", name: "Medical clearance 2026/27", status: "pending", updated: "2027-02-01", visibleTo: "Guardian · SSB Garuda" },
    { id: "d4", name: "Competition player card", status: "active", updated: "2027-01-15", visibleTo: "Guardian · Organizers" },
    { id: "d5", name: "School enrolment letter", status: "draft", updated: "2027-02-10", visibleTo: "Guardian only" },
  ],
};

const cat = (id: string, label: string, birthYear: string, format: string, groups: { name: string; teamIds: string[] }[]) => ({
  id, label, birthYear, format, groups, teamIds: groups.flatMap((g) => g.teamIds),
});

export const competitions: Competition[] = [
  {
    id: "myc-2027", name: "Makassar Youth Cup 2027", short: "MYC 27", organizer: "Askot PSSI Makassar (fictional)", city: "Makassar",
    status: "active", start: "2027-01-24", end: "2027-03-28", format: "Group stage + knockout", registrationDeadline: "2026-12-15",
    venues: ["Lapangan Hasanuddin", "Stadion Mini Tamalanrea", "Lapangan Pantai Losari"],
    description: "The city's largest grassroots tournament, bringing together SSBs and academies across South Sulawesi.",
    categories: [
      cat("u8", "U8", "2018–2019", "7v7 · 2×15 min", [{ name: "Group A", teamIds: ["garuda-u8", "garuda-u8b", "losari-u8"] }]),
      cat("u10", "U10", "2016–2017", "8v8 · 2×25 min", [
        { name: "Group A", teamIds: ["garuda-u10", "phinisi-u10", "losari-u10", "gowa-u10"] },
        { name: "Group B", teamIds: ["alpha-u10", "toraja-u10"] },
      ]),
      cat("u12", "U12", "2014–2015", "9v9 · 2×30 min", [{ name: "Group A", teamIds: ["garuda-u12", "phinisi-u12", "losari-u12", "gowa-u12", "toraja-u12"] }]),
    ],
  },
  {
    id: "liga-anak-2027", name: "Liga Anak Sulsel 2027", short: "LAS 27", organizer: "Liga Anak Sulsel (fictional)", city: "Makassar",
    status: "pending", start: "2027-04-10", end: "2027-07-31", format: "Round robin league", registrationDeadline: "2027-03-01",
    venues: ["Multiple home venues"], description: "Season-long league for U10 and U12 teams. Registration currently open.",
    categories: [
      cat("u10", "U10", "2016–2017", "8v8 · 2×25 min", [{ name: "League", teamIds: ["garuda-u10", "phinisi-u10", "toraja-u10"] }]),
      cat("u12", "U12", "2014–2015", "9v9 · 2×30 min", [{ name: "League", teamIds: ["garuda-u12", "toraja-u12"] }]),
    ],
  },
  {
    id: "gowa-cup-2027", name: "Gowa Junior Cup 2027", short: "GJC 27", organizer: "Gowa Football Academy", city: "Sungguminasa",
    status: "draft", start: "2027-05-15", end: "2027-05-23", format: "Festival", venues: ["Lapangan Syekh Yusuf"],
    description: "Draft competition — categories and teams not yet published.",
    categories: [cat("u10", "U10", "2016–2017", "8v8", [{ name: "TBD", teamIds: [] }])],
  },
  {
    id: "festival-2026", name: "Festival Sepak Bola Usia Dini 2026", short: "FUD 26", organizer: "Dispora Makassar (fictional)", city: "Makassar",
    status: "completed", start: "2026-10-03", end: "2026-10-11", format: "Festival · no standings", venues: ["Lapangan Karebosi"],
    description: "Non-competitive festival celebrating early-age football.",
    categories: [cat("u8", "U8", "2018–2019", "5v5", [{ name: "Festival", teamIds: ["garuda-u8", "losari-u8", "garuda-u8b"] }])],
  },
  {
    id: "maros-open-2026", name: "Maros Open Youth 2026", short: "MOY 26", organizer: "SSB Alpha Maros", city: "Maros",
    status: "cancelled", start: "2026-12-05", end: "2026-12-07", format: "Knockout", venues: ["Lapangan Pallantikang"],
    description: "Cancelled due to venue flooding. Registered teams were notified.",
    categories: [cat("u10", "U10", "2016–2017", "8v8", [{ name: "Knockout", teamIds: ["alpha-u10", "garuda-u10"] }])],
  },
];

export const matches: Match[] = [
  {
    id: "m-101", competitionId: "myc-2027", categoryId: "u10", round: "Group A · Matchday 1", date: "2027-01-24", time: "08:00",
    venue: "Lapangan Hasanuddin", homeId: "garuda-u10", awayId: "gowa-u10", score: { home: 4, away: 0 }, status: "completed", duration: "2×25 min",
    events: [
      { minute: 0, type: "kickoff" },
      { minute: 7, type: "goal", side: "home", player: "Muhammad Rizky Pratama", detail: "Assist: Andi Fadhil Ramadhan" },
      { minute: 19, type: "goal", side: "home", player: "Arya Wicaksono" },
      { minute: 25, type: "half", detail: "2 – 0" },
      { minute: 33, type: "goal", side: "home", player: "Muhammad Rizky Pratama", detail: "Header" },
      { minute: 46, type: "goal", side: "home", player: "Muh. Alif Syahputra" },
      { minute: 50, type: "fulltime", detail: "4 – 0" },
    ],
  },
  {
    id: "m-102", competitionId: "myc-2027", categoryId: "u10", round: "Group A · Matchday 1", date: "2027-01-24", time: "09:15",
    venue: "Lapangan Hasanuddin", homeId: "phinisi-u10", awayId: "losari-u10", score: { home: 2, away: 2 }, status: "completed", duration: "2×25 min",
    events: [{ minute: 0, type: "kickoff" }, { minute: 25, type: "half", detail: "1 – 1" }, { minute: 50, type: "fulltime", detail: "2 – 2" }],
  },
  {
    id: "m-103", competitionId: "myc-2027", categoryId: "u10", round: "Group A · Matchday 2", date: "2027-02-07", time: "08:00",
    venue: "Stadion Mini Tamalanrea", homeId: "garuda-u10", awayId: "phinisi-u10", score: { home: 3, away: 1 }, status: "completed", duration: "2×25 min",
    events: [
      { minute: 0, type: "kickoff" },
      { minute: 12, type: "goal", side: "home", player: "Muhammad Rizky Pratama", detail: "Assist: Arya Wicaksono" },
      { minute: 18, type: "yellow", side: "away", player: "Fajar Ramli", detail: "Late challenge" },
      { minute: 25, type: "half", detail: "1 – 0" },
      { minute: 26, type: "sub", side: "home", player: "Muh. Alif Syahputra", detail: "for Daffa Aditya Nugraha" },
      { minute: 34, type: "goal", side: "home", player: "Muhammad Rizky Pratama", detail: "Left-footed finish" },
      { minute: 41, type: "goal", side: "away", player: "Rizal Hakim", detail: "Penalty" },
      { minute: 44, type: "yellow", side: "home", player: "Rafael Kurniawan" },
      { minute: 48, type: "goal", side: "home", player: "Andi Fadhil Ramadhan", detail: "Assist: Farhan Hidayat" },
      { minute: 50, type: "fulltime", detail: "3 – 1" },
    ],
  },
  {
    id: "m-104", competitionId: "myc-2027", categoryId: "u10", round: "Group A · Matchday 2", date: "2027-02-07", time: "09:15",
    venue: "Stadion Mini Tamalanrea", homeId: "losari-u10", awayId: "gowa-u10", score: { home: 1, away: 0 }, status: "completed", duration: "2×25 min",
    events: [{ minute: 0, type: "kickoff" }, { minute: 50, type: "fulltime", detail: "1 – 0" }],
  },
  {
    id: "m-105", competitionId: "myc-2027", categoryId: "u12", round: "Group A · Matchday 3", date: "2027-02-14", time: "10:30",
    venue: "Lapangan Pantai Losari", homeId: "garuda-u12", awayId: "toraja-u12", score: { home: 1, away: 1 }, status: "live", duration: "2×30 min",
    events: [
      { minute: 0, type: "kickoff" },
      { minute: 14, type: "goal", side: "away", player: "Markus Pongsapan" },
      { minute: 30, type: "half", detail: "0 – 1" },
      { minute: 38, type: "goal", side: "home", player: "Ilham Basri", detail: "Assist: Rangga Mahendra" },
    ],
  },
  {
    id: "m-106", competitionId: "myc-2027", categoryId: "u10", round: "Group A · Matchday 3", date: "2027-02-21", time: "08:00",
    venue: "Lapangan Pantai Losari", homeId: "losari-u10", awayId: "garuda-u10", status: "scheduled", duration: "2×25 min", events: [],
  },
  {
    id: "m-107", competitionId: "myc-2027", categoryId: "u10", round: "Group A · Matchday 3", date: "2027-02-21", time: "09:15",
    venue: "Lapangan Pantai Losari", homeId: "gowa-u10", awayId: "phinisi-u10", status: "scheduled", duration: "2×25 min", events: [],
  },
  {
    id: "m-108", competitionId: "myc-2027", categoryId: "u12", round: "Group A · Matchday 4", date: "2027-02-28", time: "10:30",
    venue: "Stadion Mini Tamalanrea", homeId: "phinisi-u12", awayId: "garuda-u12", status: "scheduled", duration: "2×30 min", events: [],
  },
  {
    id: "m-109", competitionId: "myc-2027", categoryId: "u8", round: "Festival Round 2", date: "2027-02-21", time: "07:30",
    venue: "Lapangan Hasanuddin", homeId: "garuda-u8", awayId: "losari-u8", status: "scheduled", duration: "2×15 min", events: [],
  },
  {
    id: "m-110", competitionId: "myc-2027", categoryId: "u10", round: "Group B · Matchday 2", date: "2027-02-07", time: "10:30",
    venue: "Lapangan Pantai Losari", homeId: "alpha-u10", awayId: "toraja-u10", status: "cancelled", duration: "2×25 min",
    events: [{ minute: 0, type: "kickoff", detail: "Postponed — waterlogged pitch" }],
  },
  {
    id: "m-111", competitionId: "myc-2027", categoryId: "u12", round: "Group A · Matchday 2", date: "2027-02-07", time: "13:00",
    venue: "Lapangan Hasanuddin", homeId: "losari-u12", awayId: "garuda-u12", score: { home: 0, away: 2 }, status: "completed", duration: "2×30 min",
    events: [{ minute: 0, type: "kickoff" }, { minute: 60, type: "fulltime", detail: "0 – 2" }],
  },
];

export const schedule: ScheduleItem[] = [
  { id: "s1", date: "2027-02-14", start: "10:30", end: "11:30", type: "match", title: "Garuda U12 vs Toraja Raya U12", teamId: "garuda-u12", venue: "Lapangan Pantai Losari", matchId: "m-105" },
  { id: "s2", date: "2027-02-15", start: "16:00", end: "17:30", type: "training", title: "Technical session · finishing", teamId: "garuda-u10", venue: "Lapangan Hasanuddin" },
  { id: "s3", date: "2027-02-15", start: "16:00", end: "17:00", type: "training", title: "Fun games & coordination", teamId: "garuda-u8", venue: "Lapangan Hasanuddin" },
  { id: "s4", date: "2027-02-16", start: "16:00", end: "17:30", type: "training", title: "Small-sided games", teamId: "garuda-putri-u9", venue: "Lapangan Hasanuddin" },
  { id: "s5", date: "2027-02-17", start: "16:00", end: "17:30", type: "training", title: "Pressing & transitions", teamId: "garuda-u10", venue: "Lapangan Hasanuddin" },
  { id: "s6", date: "2027-02-17", start: "19:30", end: "20:30", type: "meeting", title: "Parents meeting · Makassar Youth Cup", venue: "Garuda clubhouse" },
  { id: "s7", date: "2027-02-18", start: "16:00", end: "17:30", type: "training", title: "Set pieces", teamId: "garuda-u12", venue: "Lapangan Hasanuddin" },
  { id: "s8", date: "2027-02-19", start: "16:00", end: "17:30", type: "training", title: "Match preparation", teamId: "garuda-u10", venue: "Lapangan Hasanuddin" },
  { id: "s9", date: "2027-02-21", start: "07:30", end: "08:30", type: "match", title: "Garuda U8 vs Losari U8", teamId: "garuda-u8", venue: "Lapangan Hasanuddin", matchId: "m-109" },
  { id: "s10", date: "2027-02-21", start: "08:00", end: "09:00", type: "match", title: "Losari U10 vs Garuda U10", teamId: "garuda-u10", venue: "Lapangan Pantai Losari", matchId: "m-106" },
  { id: "s11", date: "2027-02-22", start: "09:00", end: "12:00", type: "event", title: "Football ID verification day", venue: "Garuda clubhouse" },
  { id: "s12", date: "2027-02-28", start: "10:30", end: "11:30", type: "match", title: "Phinisi U12 vs Garuda U12", teamId: "garuda-u12", venue: "Stadion Mini Tamalanrea", matchId: "m-108" },
];

export const notifications: Notification[] = [
  { id: "n1", type: "registration", title: "New registration request", body: "Bagas Setiawan (2016) requested to join Garuda U10. Guardian consent received.", time: "2027-02-14T08:12", read: false, roles: ["org_admin"], href: "/players/p-146" },
  { id: "n2", type: "match", title: "Garuda U12 is live", body: "Garuda U12 1 – 1 Toraja Raya U12 · 38'", time: "2027-02-14T11:08", read: false, roles: ["org_admin", "coach", "competition_organizer", "player", "parent"], href: "/matches/m-105" },
  { id: "n3", type: "consent", title: "Consent request from SSB Garuda Makassar", body: "Permission to feature Rizky's photo in Makassar Youth Cup media.", time: "2027-02-13T19:40", read: false, roles: ["parent"], href: "/children/p-123" },
  { id: "n4", type: "verification", title: "3 players awaiting verification", body: "Upload or confirm birth documents to complete Football ID verification.", time: "2027-02-13T10:02", read: true, roles: ["org_admin"], href: "/players" },
  { id: "n5", type: "schedule", title: "Training moved", body: "Garuda U10 training on Wed 17 Feb moved to 16:00 at Lapangan Hasanuddin.", time: "2027-02-12T15:30", read: true, roles: ["org_admin", "coach", "parent", "player"], href: "/schedule" },
  { id: "n6", type: "match", title: "Result confirmed", body: "Garuda U10 3 – 1 Phinisi U10 has been confirmed by the organizer.", time: "2027-02-07T12:20", read: true, roles: ["org_admin", "coach", "parent", "player", "competition_organizer"], href: "/matches/m-103" },
  { id: "n7", type: "system", title: "Liga Anak Sulsel 2027 registration closes soon", body: "Deadline 1 March 2027 · 2 Garuda teams eligible.", time: "2027-02-10T09:00", read: false, roles: ["org_admin", "competition_organizer"], href: "/competitions/liga-anak-2027" },
  { id: "n8", type: "verification", title: "Result awaiting confirmation", body: "Alpha U10 vs Toraja Raya U10 postponed — set a new date.", time: "2027-02-07T10:40", read: false, roles: ["competition_organizer"], href: "/matches/m-110" },
];

export const activity = [
  { id: "a1", who: "Coach Hendra Saputra", what: "updated the Garuda U10 lineup", when: "2h ago" },
  { id: "a2", who: "Andi Pratama", what: "approved Muh. Alif Syahputra's documents", when: "5h ago" },
  { id: "a3", who: "Makassar Youth Cup", what: "confirmed result Garuda U10 3 – 1 Phinisi U10", when: "1w ago" },
  { id: "a4", who: "Ibu Ratna Dewi", what: "accepted membership for Bagas Setiawan", when: "1d ago" },
  { id: "a5", who: "Coach Sri Wahyuni", what: "scheduled 4 training sessions for Garuda Putri U9", when: "2d ago" },
];
