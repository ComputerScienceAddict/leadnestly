"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead, LeadFormData } from "@/types/lead";
import { getSupabase } from "@/lib/supabase";

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    company: String(row.company ?? ""),
    status: (row.status as Lead["status"]) ?? "new",
    source: (row.source as Lead["source"]) ?? "cold_call",
    value: Number(row.value ?? 0),
    notes: String(row.notes ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setError("Supabase not configured");
      setIsLoaded(true);
      return;
    }

    async function fetchLeads() {
      try {
        const { data, error: err } = await sb
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (err) {
          setError(err.message);
          setLeads([]);
        } else {
          setLeads((data ?? []).map(rowToLead));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load leads");
      } finally {
        setIsLoaded(true);
      }
    }

    fetchLeads();
  }, []);

  const updateLead = useCallback((id: string, data: LeadFormData): Lead | null => {
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;
    const updated: Lead = {
      ...leads[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    const next = [...leads];
    next[index] = updated;
    setLeads(next);
    const sb = getSupabase();
    if (sb) {
      sb.from("leads").update({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        company: updated.company,
        status: updated.status,
        source: updated.source,
        value: updated.value,
        notes: updated.notes,
        updated_at: updated.updatedAt,
      }).eq("id", id).then(() => {});
    }
    return updated;
  }, [leads]);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    const sb = getSupabase();
    if (sb) sb.from("leads").delete().eq("id", id).then(() => {});
  }, []);

  const getLead = useCallback(
    (id: string): Lead | undefined => leads.find((l) => l.id === id),
    [leads]
  );

  return { leads, isLoaded, error, updateLead, deleteLead, getLead };
}
