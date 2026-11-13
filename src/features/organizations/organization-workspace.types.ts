export const ORGANIZATION_WORKSPACE_VIEWS = [
  "dashboard",
  "players",
  "teams",
  "training",
  "attendance",
  "competitions",
  "finance",
  "staff",
] as const;

export type OrganizationWorkspaceView = (typeof ORGANIZATION_WORKSPACE_VIEWS)[number];
