import { describe, expect, it } from "vitest";
import { listRegistrations, listSanctionRequests } from "@/data/association-repository";
import { approveRegistration, medianDaysToDecision, registrationState, submitRenewal, decideSanction } from "./association-model";

const TODAY = "2027-02-14";
const reg = (id: string) => listRegistrations().find((r) => r.id === id)!;

describe("association registrations", () => {
  it("shows registered with validity when approved and more than 60 days remain", () => {
    expect(registrationState(reg("reg-phinisi"), TODAY)).toBe("registered");
  });
  it("prompts renewal within 60 days of the validity end", () => {
    expect(registrationState(reg("reg-garuda"), TODAY)).toBe("expiring");
  });
  it("shows expired once the validity end date has passed", () => {
    expect(registrationState(reg("reg-alpha"), TODAY)).toBe("expired");
  });
  it("approval sets one year of validity and records approver and time", () => {
    const { registration, entry } = approveRegistration(reg("reg-gowa"), "Official A", "2027-02-14T09:00:00", "Gowa Football Academy");
    expect(registration.validTo).toBe("2028-02-14");
    expect(registration.decidedBy).toBe("Official A");
    expect(registration.decidedAt).toBe("2027-02-14T09:00:00");
    expect(entry.actor).toBe("Official A");
    expect(registrationState(registration, TODAY)).toBe("registered");
  });
  it("a submitted renewal waits for review", () => {
    expect(registrationState(submitRenewal(reg("reg-garuda"), "2027-02-14T09:00:00"), TODAY)).toBe("pending");
  });
});

describe("competition sanctioning", () => {
  it("approval records who sanctioned and when", () => {
    const req = listSanctionRequests().find((r) => r.id === "san-las")!;
    const { request } = decideSanction(req, "approved", "Official A", "2027-02-14T10:00:00", "Liga Anak Sulsel 2027");
    expect(request.decision).toBe("approved");
    expect(request.decidedBy).toBe("Official A");
    expect(request.decidedAt).toBe("2027-02-14T10:00:00");
  });
  it("median days to sanction uses decided requests only", () => {
    // MYC: 5 Dec → 12 Dec = 7 days; Festival: 20 Aug → 24 Aug = 4 days
    expect(medianDaysToDecision(listSanctionRequests())).toBe(6);
  });
});
