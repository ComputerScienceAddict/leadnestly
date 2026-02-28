import { LeadStatus, LeadSource } from "@/types/lead";

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  new: {
    label: "New",
    color: "text-blue-800",
    bg: "bg-blue-100 border-blue-300",
    dot: "bg-blue-600",
  },
  contacted: {
    label: "Contacted",
    color: "text-purple-800",
    bg: "bg-purple-100 border-purple-300",
    dot: "bg-purple-600",
  },
  qualified: {
    label: "Qualified",
    color: "text-yellow-800",
    bg: "bg-yellow-100 border-yellow-400",
    dot: "bg-yellow-500",
  },
  proposal: {
    label: "Proposal",
    color: "text-orange-800",
    bg: "bg-orange-100 border-orange-300",
    dot: "bg-orange-500",
  },
  won: {
    label: "Won",
    color: "text-green-800",
    bg: "bg-green-100 border-green-400",
    dot: "bg-green-600",
  },
  lost: {
    label: "Lost",
    color: "text-red-800",
    bg: "bg-red-100 border-red-300",
    dot: "bg-red-500",
  },
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  cold_call: "Cold Call",
  social_media: "Social Media",
  email: "Email Campaign",
  event: "Event",
  other: "Other",
};

export const ALL_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export const ALL_SOURCES: LeadSource[] = [
  "website",
  "referral",
  "cold_call",
  "social_media",
  "email",
  "event",
  "other",
];
