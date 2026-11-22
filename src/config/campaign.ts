// Central campaign configuration: prices, dates, links and modes live here only.
export type CampaignMode = "blackfriday" | "noel" | "evergreen";

export const campaign = {
  // Add the new real checkout URLs here when they are ready. Empty means no payment navigation.
  checkoutUrl: "",
  premiumCheckoutUrl: "",
  price: 9.9,
  premiumPrice: 19.9,
  premiumBonusesReady: true,
  referencePrice: 29.9,
  // Set to true only when the reference price is backed by real pricing history.
  showReferencePrice: true,
  referencePriceNote: "Prix de référence : prix le plus bas pratiqué au cours des 30 jours précédant la promotion.",
  guaranteeDays: 30,
  bonusValues: [19, 15, 12],
  // ISO dates with Paris offset. Modes switch automatically when a period ends.
  blackFriday: { start: "2026-11-20T00:00:00+01:00", end: "2026-12-01T23:59:59+01:00" },
  noel: { start: "2026-12-02T00:00:00+01:00", end: "2026-12-25T23:59:59+01:00" },
  // Real customer reviews only; rating is the customer's genuine score out of five.
  testimonials: [] as { name: string; city: string; text: string; rating: 1 | 2 | 3 | 4 | 5 }[],
};

export function getMode(now: Date = new Date()): CampaignMode {
  const t = now.getTime();
  const inRange = (r: { start: string; end: string }) =>
    t >= new Date(r.start).getTime() && t <= new Date(r.end).getTime();
  if (inRange(campaign.blackFriday)) return "blackfriday";
  if (inRange(campaign.noel)) return "noel";
  return "evergreen";
}

export function getDeadline(mode: CampaignMode): Date | null {
  if (mode === "blackfriday") return new Date(campaign.blackFriday.end);
  if (mode === "noel") return new Date(campaign.noel.end);
  return null;
}

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
export const euro = (n: number) => fmt.format(n);
export const discountPct = () => Math.round((1 - campaign.price / campaign.referencePrice) * 100);
