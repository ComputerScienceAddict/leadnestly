"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";

export type CallResult = "interested" | "not_interested";

export interface LeadStatusMap {
  [leadId: string]: CallResult;
}

export function useLeadStatus() {
  const [statuses, setStatuses] = useState<LeadStatusMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoaded(true);
      return;
    }

    async function fetchStatuses(client: NonNullable<ReturnType<typeof getSupabase>>) {
      try {
        const { data } = await client
          .from("lead_call_results")
          .select("lead_id, call_result");

        const map: LeadStatusMap = {};
        (data ?? []).forEach((row: { lead_id: string; call_result: CallResult }) => {
          map[row.lead_id] = row.call_result;
        });
        setStatuses(map);
      } catch {
        // ignore
      } finally {
        setLoaded(true);
      }
    }

    fetchStatuses(sb);
  }, []);

  const markLead = useCallback(async (leadId: string, result: CallResult) => {
    setStatuses((prev) => ({ ...prev, [leadId]: result }));

    const sb = getSupabase();
    if (sb) {
      await sb.from("lead_call_results").upsert(
        { lead_id: leadId, call_result: result },
        { onConflict: "lead_id" }
      );
    }
  }, []);

  const getStatus = useCallback(
    (id: string): CallResult | undefined => statuses[id],
    [statuses]
  );

  const isClaimed = useCallback(
    (id: string): boolean => id in statuses,
    [statuses]
  );

  return { statuses, markLead, getStatus, isClaimed, loaded };
}
