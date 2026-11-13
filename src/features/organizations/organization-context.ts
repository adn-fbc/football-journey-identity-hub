import { createContext, useContext } from "react";
import type { Organization } from "@/data/types";
import type { OrganizationWorkspaceSnapshot } from "./organization-workspace-model";

export interface OrganizationContextValue {
  organization: Organization;
  workspace: OrganizationWorkspaceSnapshot;
}

export const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function useOrganizationWorkspace() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganizationWorkspace must be used inside <OrganizationProvider>");
  }
  return context;
}
