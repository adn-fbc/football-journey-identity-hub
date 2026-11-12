/**
 * Module registry — the single source of truth for navigation.
 * The sidebar, mobile bottom bar, "More" sheet and global search all read from here.
 * To ship a future module: flip `status` to "live", set `path` to its route, and list its roles.
 */
import {
  LayoutDashboard, Fingerprint, Users, Building2, Shield, Trophy, Swords, CalendarDays, Bell, Settings,
  Baby, Dumbbell, ClipboardCheck, TrendingUp, Wallet, Megaphone, Flag, Telescope, Sparkles, BarChart3,
  Landmark, Globe2, Bot, type LucideIcon,
} from "lucide-react";
import type { RoleId } from "./roles";

export type ModuleStatus = "live" | "soon";
export type ModuleGroup = "core" | "manage" | "personal" | "future";

export interface AppModule {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  group: ModuleGroup;
  status: ModuleStatus;
  roles: RoleId[];
  /** Appears in the mobile bottom bar for these roles (max 4 per role). */
  mobileFor?: RoleId[] | undefined;
}

const ALL: RoleId[] = ["player", "parent", "coach", "org_admin", "competition_organizer"];

export const MODULES: AppModule[] = [
  { id: "overview", title: "Overview", description: "Your role-aware home", icon: LayoutDashboard, path: "/", group: "core", status: "live", roles: ALL, mobileFor: ALL },
  { id: "children", title: "My Children", description: "Guardian view of your children", icon: Baby, path: "/children", group: "personal", status: "live", roles: ["parent"], mobileFor: ["parent"] },
  { id: "football-id", title: "Football ID", description: "Persistent football identity", icon: Fingerprint, path: "/football-id", group: "core", status: "live", roles: ALL, mobileFor: ["player"] },
  { id: "players", title: "Players", description: "Members & relationships", icon: Users, path: "/players", group: "manage", status: "live", roles: ["org_admin", "coach"], mobileFor: ["org_admin"] },
  { id: "organizations", title: "Organizations", description: "SSB, academies & clubs", icon: Building2, path: "/organizations", group: "manage", status: "live", roles: ["org_admin", "competition_organizer", "parent", "coach"] },
  { id: "teams", title: "Teams", description: "Squads & rosters", icon: Shield, path: "/teams", group: "manage", status: "live", roles: ["org_admin", "coach", "player"], mobileFor: ["coach"] },
  { id: "competitions", title: "Competitions", description: "Tournaments & leagues", icon: Trophy, path: "/competitions", group: "manage", status: "live", roles: ALL, mobileFor: ["competition_organizer"] },
  { id: "matches", title: "Matches", description: "Fixtures & results", icon: Swords, path: "/matches", group: "core", status: "live", roles: ALL, mobileFor: ["player", "competition_organizer"] },
  { id: "schedule", title: "Schedule", description: "Training, matches & events", icon: CalendarDays, path: "/schedule", group: "core", status: "live", roles: ALL, mobileFor: ["parent", "coach", "player", "org_admin"] },
  { id: "notifications", title: "Notifications", description: "Updates & requests", icon: Bell, path: "/notifications", group: "core", status: "live", roles: ALL },
  { id: "settings", title: "Settings", description: "Account, roles & privacy", icon: Settings, path: "/settings", group: "core", status: "live", roles: ALL },

  // ---- Future modules (architecture prepared, UI placeholder only) ----
  { id: "training", title: "Training", description: "Session plans & drills", icon: Dumbbell, path: "/modules/training", group: "future", status: "soon", roles: ["coach", "org_admin"] },
  { id: "attendance", title: "Attendance", description: "Check-ins & attendance rates", icon: ClipboardCheck, path: "/modules/attendance", group: "future", status: "soon", roles: ["coach", "org_admin", "parent"] },
  { id: "development", title: "Player Development", description: "Skills, goals & progress", icon: TrendingUp, path: "/modules/development", group: "future", status: "soon", roles: ["coach", "parent", "player", "org_admin"] },
  { id: "finance", title: "Finance & Payments", description: "Fees, invoices & payouts", icon: Wallet, path: "/modules/finance", group: "future", status: "soon", roles: ["org_admin", "parent"] },
  { id: "coach", title: "Coach Platform", description: "Licences & coaching career", icon: Megaphone, path: "/modules/coach", group: "future", status: "soon", roles: ["coach"] },
  { id: "referee", title: "Referee Platform", description: "Assignments & match reports", icon: Flag, path: "/modules/referee", group: "future", status: "soon", roles: ["competition_organizer"] },
  { id: "scouting", title: "Scouting", description: "Consent-based talent discovery", icon: Telescope, path: "/modules/scouting", group: "future", status: "soon", roles: ["org_admin", "parent"] },
  { id: "opportunities", title: "Opportunities", description: "Trials, camps & scholarships", icon: Sparkles, path: "/modules/opportunities", group: "future", status: "soon", roles: ["player", "parent"] },
  { id: "analytics", title: "Analytics", description: "Insights across your data", icon: BarChart3, path: "/modules/analytics", group: "future", status: "soon", roles: ["org_admin", "competition_organizer"] },
  { id: "association", title: "Association", description: "Regional governance", icon: Landmark, path: "/modules/association", group: "future", status: "soon", roles: ["org_admin", "competition_organizer"] },
  { id: "federation", title: "Federation", description: "National registry & licensing", icon: Globe2, path: "/modules/federation", group: "future", status: "soon", roles: ["competition_organizer"] },
  { id: "ai", title: "AI Assistant", description: "Ask anything about your football data", icon: Bot, path: "/modules/ai", group: "future", status: "soon", roles: ALL },
];

export const GROUP_LABELS: Record<ModuleGroup, string> = {
  core: "Platform",
  personal: "Family",
  manage: "Manage",
  future: "Coming soon",
};

export const modulesForRole = (role: RoleId) => MODULES.filter((m) => m.roles.includes(role));
export const mobileModulesForRole = (role: RoleId) =>
  MODULES.filter((m) => m.mobileFor?.includes(role)).slice(0, 4);
export const getModule = (id: string) => MODULES.find((m) => m.id === id);
