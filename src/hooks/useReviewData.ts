"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ReviewData, GlobalRule, SlideAction, Conflict, RawComment } from "@/types/review.types";

async function fetchReviewData(): Promise<ReviewData> {
  const [rulesRes, actionsRes, conflictsRes, commentsRes] = await Promise.all([
    supabase.from("cr_global_rules").select("*").order("rule_id"),
    supabase.from("cr_slide_actions").select("*").order("slide_index").order("execution_phase").order("action_id"),
    supabase.from("cr_conflicts").select("*").order("conflict_id"),
    supabase.from("cr_raw_comments").select("*").order("slide_index").order("comment_num"),
  ]);

  return {
    globalRules: (rulesRes.data as GlobalRule[]) ?? [],
    slideActions: (actionsRes.data as SlideAction[]) ?? [],
    conflicts: (conflictsRes.data as Conflict[]) ?? [],
    rawComments: (commentsRes.data as RawComment[]) ?? [],
  };
}

export function useReviewData() {
  return useQuery({
    queryKey: ["review-data"],
    queryFn: fetchReviewData,
  });
}
