import { LeadStatus } from "@/types/lead";
import { STATUS_CONFIG } from "@/lib/constants";

interface StatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`${cfg.bg} ${cfg.color}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: size === "sm" ? "2px 8px" : "3px 10px",
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 700,
        fontFamily: "'Nunito', Arial, sans-serif",
        borderRadius: 3,
        border: "1px solid",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <span className={cfg.dot} style={{
        width: 6, height: 6, borderRadius: "50%",
        display: "inline-block", flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  );
}
