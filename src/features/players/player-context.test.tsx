import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { RoleProvider } from "@/lib/role-context";
import { getPlayer } from "@/data/repository";
import { PlayerJourneyTab, PrimaryContextSection, RelationshipSection } from "./player-tabs";

const player = getPlayer("p-123")!;

describe("PrimaryContextSection", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.localStorage.removeItem("fid.activeRole");
  });

  it("lets the player select an active organization and team as presentation context", async () => {
    window.localStorage.setItem("fid.activeRole", "player");
    render(
      <RoleProvider>
        <PrimaryContextSection player={player} />
      </RoleProvider>,
    );

    const organizationSelect = screen.getByRole("combobox", { name: "Primary organization" });
    await waitFor(() => expect(organizationSelect).not.toBeDisabled());
    fireEvent.keyDown(organizationSelect, { key: "ArrowDown" });
    fireEvent.click(await screen.findByRole("option", { name: "SSB Garuda Makassar" }));

    await waitFor(() => expect(organizationSelect).toHaveTextContent("SSB Garuda Makassar"));
    expect(
      screen.getByText(
        "A player-selected display preference. It does not change membership or grant access.",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Primary team" })).not.toBeDisabled();
  });

  it("keeps the preference read-only for an organization admin", () => {
    render(
      <RoleProvider>
        <PrimaryContextSection player={player} />
      </RoleProvider>,
    );

    expect(screen.getByRole("combobox", { name: "Primary organization" })).toBeDisabled();
    expect(
      screen.getByText(
        "Only the player or a guardian with current primary-context authorization can change this preference.",
      ),
    ).toBeTruthy();
  });

  it("shows affiliation history and marks missing legacy dates", () => {
    render(
      <RoleProvider>
        <RelationshipSection player={getPlayer("p-143")!} />
      </RoleProvider>,
    );

    expect(screen.getAllByText("SSB Garuda Makassar").length).toBeGreaterThan(0);
    expect(screen.getByText(/Teams:/).textContent).toContain("Garuda U8");
    expect(screen.getByText(/Start date not recorded/)).toBeTruthy();
  });

  it("does not show cross-organization history in an organization-admin view", () => {
    render(
      <RoleProvider>
        <RelationshipSection player={player} />
        <PlayerJourneyTab player={player} />
      </RoleProvider>,
    );

    expect(screen.getAllByText("SSB Garuda Makassar").length).toBeGreaterThan(0);
    expect(screen.queryByText("SSB Alpha Maros")).toBeNull();
    expect(screen.queryByText("Joined SSB Alpha Maros")).toBeNull();
  });

  it("shows full historical affiliations to the player", () => {
    window.localStorage.setItem("fid.activeRole", "player");
    render(
      <RoleProvider>
        <RelationshipSection player={player} />
      </RoleProvider>,
    );

    expect(screen.getByText("SSB Alpha Maros")).toBeTruthy();
    expect(screen.getByText("SSB Garuda Makassar")).toBeTruthy();
  });

  it("renders source-backed journey events and a distinct empty state", () => {
    const { rerender } = render(
      <RoleProvider>
        <PlayerJourneyTab player={player} />
      </RoleProvider>,
    );

    expect(screen.getByText("Football ID created")).toBeTruthy();
    expect(screen.getByText("Source: Player identity · record p-123")).toBeTruthy();

    rerender(
      <RoleProvider>
        <PlayerJourneyTab player={getPlayer("p-146")!} />
      </RoleProvider>,
    );
    expect(screen.getByText("No journey events recorded")).toBeTruthy();
  });

  it("requires explicit primary-context authorization for guardians", async () => {
    window.localStorage.setItem("fid.activeRole", "parent");
    const linked = render(
      <RoleProvider>
        <PrimaryContextSection player={getPlayer("p-123")!} />
      </RoleProvider>,
    );
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Primary organization" })).not.toBeDisabled(),
    );

    linked.unmount();
    const noGrant = render(
      <RoleProvider>
        <PrimaryContextSection player={getPlayer("p-125")!} />
      </RoleProvider>,
    );
    expect(screen.queryByRole("combobox", { name: "Primary organization" })).toBeNull();
    expect(screen.getByText(/No organization affiliations are available in this view/)).toBeTruthy();

    noGrant.unmount();
    render(
      <RoleProvider>
        <PrimaryContextSection player={getPlayer("p-148")!} />
      </RoleProvider>,
    );
    expect(screen.queryByRole("combobox", { name: "Primary organization" })).toBeNull();
    expect(
      screen.getByText(/No organization affiliations are available in this view/),
    ).toBeTruthy();
  });
});
