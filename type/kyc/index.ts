export interface KYCRequest {
  id: string;
  creator_id: string;
  status: string;
  selfie_with_id_url: string;
  id_card_image_url: string;
  comment?: string;
  last_submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface KYCListResponse {
  items: KYCRequest[];
  limit: number;
  offset: number;
  total: number;
}
