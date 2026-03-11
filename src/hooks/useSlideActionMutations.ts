"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface EditPayload {
  id: string;
  reviewerNote?: string;
  replacementText?: string;
}

export function useSlideActionMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["review-data"] });

  const onError = (err: Error) => {
    console.error("[useSlideActionMutations]", err.message);
  };

  const acceptAction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cr_slide_actions")
        .update({ status: "applied", decided_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError,
  });

  const rejectAction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cr_slide_actions")
        .update({ status: "rejected", decided_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError,
  });

  const editAction = useMutation({
    mutationFn: async ({ id, reviewerNote, replacementText }: EditPayload) => {
      const update: Record<string, unknown> = {
        status: "applied",
        decided_at: new Date().toISOString(),
      };
      if (reviewerNote !== undefined) update.reviewer_note = reviewerNote;
      if (replacementText !== undefined) update.replacement_text = replacementText;

      const { error } = await supabase
        .from("cr_slide_actions")
        .update(update)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError,
  });

  return { acceptAction, rejectAction, editAction };
}
