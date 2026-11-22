import { describe, it, expect } from "vitest";
import { campaign, getMode, euro, discountPct } from "./campaign";

describe("campaign rules", () => {
  it("Black Friday mode during the Black Friday period", () => {
    expect(getMode(new Date("2026-11-27T12:00:00+01:00"))).toBe("blackfriday");
  });
  it("Christmas mode after Black Friday ends", () => {
    expect(getMode(new Date("2026-12-10T12:00:00+01:00"))).toBe("noel");
  });
  it("evergreen after Christmas", () => {
    expect(getMode(new Date("2026-12-27T12:00:00+01:00"))).toBe("evergreen");
  });
  it("formats prices in French euros", () => {
    expect(euro(9.9).replace(/\s/g, " ")).toBe("9,90 €");
  });
  it("discount from 29,90 to 9,90 is 67%", () => {
    expect(discountPct()).toBe(67);
  });
  it("keeps the main Essential price at 9,90 €", () => {
    expect(campaign.price).toBe(9.9);
  });
  it("sets the optional Premium price at 19,90 €", () => {
    expect(campaign.premiumPrice).toBe(19.9);
  });
  it("keeps the Premium upgrade exactly 10 € above Essential", () => {
    expect(campaign.premiumPrice - campaign.price).toBeCloseTo(10);
  });
  it("has no old or invented checkout destinations while the new checkout is pending", () => {
    expect(campaign.checkoutUrl).toBe("");
    expect(campaign.premiumCheckoutUrl).toBe("");
  });
});
