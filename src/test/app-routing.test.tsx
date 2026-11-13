import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("registers the identity setup route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/identity");

    expect(matches.at(-1)?.routeId).toBe("/identity");
  });

  it("registers the contextual check-in route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/check-in");

    expect(matches.at(-1)?.routeId).toBe("/check-in");
  });

  it("registers the public competition portal route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/public/competitions/myc-2027");

    expect(matches.at(-1)?.routeId).toBe("/public/competitions/$competitionId");
  });

  it("registers the competition oversight detail route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/competitions/oversight/myc-2027");

    expect(matches.at(-1)?.routeId).toBe("/competitions/oversight/$competitionId");
  });
});
