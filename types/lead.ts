export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export type LeadSource =
  | "website"
  | "referral"
  | "cold_call"
  | "social_media"
  | "email"
  | "event"
  | "other";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadFormData = Omit<Lead, "id" | "createdAt" | "updatedAt">;
