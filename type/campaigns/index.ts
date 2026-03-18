export interface APICampaign {
  budget: number;
  category: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  description: string;
  end_date: string;
  history: {
    amount_delta: number;
    remaining_budget: number;
    spent_budget: number;
    submission_id: string;
    submission_views: number;
    updated_at: string;
    updated_by: string;
    views_delta: number;
  }[];
  id: string;
  images: string[];
  platform: string;
  price_per_1000_views: number;
  remaining_budget: number;
  require_product_shipping: boolean;
  requirements: string[];
  slot_submission: number;
  spent_budget: number;
  start_date: string;
  status: string;
  submission_ids: string[];
  submitted: boolean;
  target_views: number;
  tier: string;
  title: string;
  total_views: number;
  updated_at: string;
  updated_by: string;
  attachment_links: string[];
}

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  description: string;
  type: string;
  status: string;
  cpm: number;
  budget: number;
  thumbnail?: string;
  end_date: string;
  remaining_budget: number;
  slot_submission: number;
  submitted: boolean;
}
