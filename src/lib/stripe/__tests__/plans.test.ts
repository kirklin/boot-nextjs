import { describe, expect, it } from "vitest";
import { findPlanByName, getHighlightedPlan, isSamePlan } from "../plans";

describe("isSamePlan", () => {
  it("compares case-insensitively (the Stripe plugin stores plan names lowercased)", () => {
    expect(isSamePlan("Partner", "partner")).toBe(true);
    expect(isSamePlan("partner", "professional")).toBe(false);
    expect(isSamePlan(null, "partner")).toBe(false);
  });
});

describe("findPlanByName", () => {
  it("resolves lowercased plan names from the database", () => {
    expect(findPlanByName("professional")?.name).toBe("Professional");
    expect(findPlanByName("unknown")).toBeUndefined();
  });
});

describe("getHighlightedPlan", () => {
  it("promotes the popular plan to visitors without a subscription", () => {
    expect(getHighlightedPlan(null)?.name).toBe("Professional");
    expect(getHighlightedPlan(undefined)?.name).toBe("Professional");
  });

  it("promotes the next tier up for subscribers", () => {
    expect(getHighlightedPlan("supporter")?.name).toBe("Professional");
    expect(getHighlightedPlan("Professional")?.name).toBe("Partner");
  });

  it("never promotes a downgrade to top-tier subscribers", () => {
    expect(getHighlightedPlan("partner")).toBeNull();
    expect(getHighlightedPlan("Partner")).toBeNull();
  });
});
