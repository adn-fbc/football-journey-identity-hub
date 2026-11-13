import type { ReactNode } from "react";
import type { Organization } from "@/data/types";
import { getOrganizationWorkspaceSnapshot } from "./organization-workspace-model";
import { OrganizationContext } from "./organization-context";

export function OrganizationProvider({
  organization,
  children,
}: {
  organization: Organization;
  children: ReactNode;
}) {
  const workspace = getOrganizationWorkspaceSnapshot(organization);
  return (
    <OrganizationContext.Provider value={{ organization, workspace }}>
      {children}
    </OrganizationContext.Provider>
  );
}
