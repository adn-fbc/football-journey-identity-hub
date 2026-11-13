import { render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { RoleProvider, useRole } from "./role-context";

function RoleReadinessProbe() {
  const { role, ready } = useRole();
  return <div>{ready ? `ready:${role}` : "not-ready"}</div>;
}

afterEach(() => {
  window.localStorage.removeItem("fid.activeRole");
});

describe("workspace role hydration", () => {
  it("does not resolve a default actor during server rendering", () => {
    const html = renderToString(
      <RoleProvider>
        <RoleReadinessProbe />
      </RoleProvider>,
    );

    expect(html).toContain("not-ready");
    expect(html).not.toContain("ready:org_admin");
  });

  it("waits for the saved role before marking the actor context ready", async () => {
    window.localStorage.setItem("fid.activeRole", "parent");
    render(
      <RoleProvider>
        <RoleReadinessProbe />
      </RoleProvider>,
    );

    await waitFor(() => expect(screen.getByText("ready:parent")).toBeInTheDocument());
  });
});
