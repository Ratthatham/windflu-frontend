export interface CreatorBackendProfile {
  accept_terms: boolean;
  account_verified: boolean;
  avatar_url?: string;
  avg_views: number;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_name?: string;
  banned: boolean;
  content_category: string[];
  country: string;
  created_at: string;
  display_name: string;
  email: string;
  first_name: string;
  followers_count: number;
  id: string;
  instagram_profile_link?: string;
  last_name: string;
  location?: string;
  omise_recipient_id?: string;
  payment_method?: string;
  phone: string;
  primary_platform: string;
  profile_code: string;
  profile_image_url?: string;
  promptpay_number?: string;
  provider: string;
  recipient_active: boolean;
  recipient_status: string;
  recipient_synced_at?: string;
  recipient_verified: boolean;
  shipping_address?: string;
  tiktok_open_id?: string;
  tiktok_profile_link?: string;
  tiktok_union_id?: string;
  verified_at?: string;
  verified_by?: string;
  youtube_channel?: string;
}

export interface BrandBackendProfile {
  accept_terms: boolean;
  budget_per_month: number;
  company_description?: string;
  company_name: string;
  contact_name: string;
  created_at: string;
  email: string;
  id: string;
  industry?: string;
  marketing_target?: string;
  phone: string;
  planning_start_campaign?: string;
}

export interface UnifiedProfile {
  id: string;
  email: string;
  role: "creator" | "brand" | "admin";
  name: string; // display_name or company_name
  avatarUrl: string; // avatar_url or profile_image_url
  phone: string;
  displayName: string; // Always display_name or company_name
  fullName: string; // display_name/first_last_name or contact_name
  location?: string;
  createdAt: string;
  // Common fields that might be used across components
  bio?: string; // bio, company_description
  companyName?: string;
  contactName?: string;
}
