export interface SubmissionHistory {
  comments: number;
  earnings: number;
  earnings_delta: number;
  likes: number;
  submission_id: string;
  submission_note: string;
  updated_at: string;
  updated_by: string;
  views: number;
  views_delta: number;
}

export interface SubmissionMetrics {
  comments: number;
  likes: number;
  updated_at: string;
  views: number;
}

export interface SubmissionVideo {
  platform: string;
  posted_at: string;
  video_url: string;
}

export interface Submission {
  approved_at: string;
  campaign_id: string;
  created_at: string;
  creator_id: string;
  description: string;
  earnings: number;
  history: SubmissionHistory[];
  id: string;
  metrics: SubmissionMetrics;
  paid_at: string;
  paid_by: string;
  paid_channel: string;
  paid_note: string;
  payment_reference: string;
  payout_id: string;
  payout_status: string;
  reject_comment: string;
  rejected_at: string;
  social_link: string;
  status: string;
  updated_at: string;
  video: SubmissionVideo;
  video_clip: string;
  video_title: string;
}
