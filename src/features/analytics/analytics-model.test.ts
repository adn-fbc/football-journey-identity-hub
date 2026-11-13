import { describe, expect, it } from "vitest";
import { listMatches } from "@/data/repository";
import { HIDDEN_LABEL, computeCompetitionAnalytics, computeOrgAnalytics, orgExportRows, suppressSmallGroups, toCsv } from "./analytics-model";

describe("small-group rule", () => {
  it("hides a group of 4 players and drops its numbers", () => {
    expect(suppressSmallGroups([{ label: "U9 Putri", players: 4, rate: 95 }])).toEqual([{ label: "U9 Putri", hidden: true }]);
  });

  it("shows a group of exactly 5 players", () => {
    expect(suppressSmallGroups([{ label: "U8", players: 5 }])).toEqual([{ label: "U8", players: 5, hidden: false }]);
  });

  it("hides Garuda Putri U9 (4 players) in the attendance table", () => {
    const team = computeOrgAnalytics("garuda", "30d").teams.find((t) => t.label === "Garuda Putri U9");
    expect(team?.hidden).toBe(true);
  });
});

describe("organization analytics", () => {
  it("computes U12 retention as 27 of 34 = 79%", () => {
    const u12 = computeOrgAnalytics("garuda", "season").retention.find((r) => r.label === "U12");
    expect(u12 && !u12.hidden ? u12.rate : null).toBe(79);
  });

  it("leaves hidden groups out of the overall retention rate (98 of 117 = 84%)", () => {
    expect(computeOrgAnalytics("garuda", "season").retentionTotal).toBe(84);
  });

  it("exports the same 148 active members the dashboard shows", () => {
    const rows = orgExportRows(computeOrgAnalytics("garuda", "season"));
    expect(rows.find((r) => r.metric === "Active members")?.value).toBe(148);
  });

  it("exports hidden groups as a label only", () => {
    const rows = orgExportRows(computeOrgAnalytics("garuda", "30d"));
    expect(rows.find((r) => r.metric === "Garuda Putri U9")?.value).toBe(HIDDEN_LABEL);
  });
});

describe("competition analytics", () => {
  it("counts every completed Makassar Youth Cup match once in the results split", () => {
    const a = computeCompetitionAnalytics("myc-2027");
    const completed = listMatches({ competitionId: "myc-2027" }).filter((m) => m.status === "completed").length;
    expect(a.results.reduce((n, r) => n + r.count, 0)).toBe(completed);
  });

  it("excludes the cancelled match from the fixture total", () => {
    const all = listMatches({ competitionId: "myc-2027" });
    expect(computeCompetitionAnalytics("myc-2027").kpis.total).toBe(all.length - all.filter((m) => m.status === "cancelled").length);
  });
});

describe("CSV export", () => {
  it("writes a header and one line per row", () => {
    expect(toCsv([{ section: "Summary", metric: "Teams", value: 14 }])).toBe('section,metric,value\r\n"Summary","Teams","14"');
  });

  it("never includes extra fields such as phone numbers", () => {
    const row = { section: "Summary", metric: "Teams", value: 14, phone: "0812-0000-0000" };
    expect(toCsv([row])).not.toContain("0812");
  });
});
