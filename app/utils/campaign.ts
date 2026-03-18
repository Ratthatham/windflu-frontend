import { APICampaign, Campaign } from "@/type/campaigns";

export const categoryToType = (cat?: string): string => {
  if (!cat) return "food";
  const c = cat.toLowerCase();
  if (c.includes("food") || c.includes("beverage")) return "food";
  if (c.includes("game") || c.includes("gaming")) return "game";
  if (c.includes("tech") || c.includes("gadget")) return "gadget";
  if (c.includes("education")) return "education";
  return c;
};

export const mapApiToCard = (c: APICampaign): Campaign => ({
  id: c.id,
  name: c.title,
  brand: "-",
  description: c.description || "",
  type: categoryToType(c.category),
  status:
    c.status === "active" || c.status === "open"
      ? "open"
      : (c.status ?? "open"),
  cpm: c.price_per_1000_views,
  budget: c.budget,
  remaining_budget: c.remaining_budget,
  slot_submission: c.slot_submission,
  thumbnail: c.images?.[0],
  end_date: c.end_date,
  submitted: c.submitted,
});
