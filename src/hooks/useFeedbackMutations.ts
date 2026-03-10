"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Severity, FeedbackCategory } from "@/types/validation.types";

export function useFeedbackMutations(lessonId: string | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["lessonData", lessonId] });
    queryClient.invalidateQueries({ queryKey: ["course"] });
  };

  const acceptMutation = useMutation({
    mutationFn: async (feedbackId: string) => {
      const { error } = await supabase
        .from("cv_feedback_items")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", feedbackId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const rejectMutation = useMutation({
    mutationFn: async (feedbackId: string) => {
      const { error } = await supabase
        .from("cv_feedback_items")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", feedbackId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const editMutation = useMutation({
    mutationFn: async ({
      feedbackId,
      correctedText,
      reviewerNote,
      reclassifiedSeverity,
      reclassifiedCategory,
    }: {
      feedbackId: string;
      correctedText: string;
      reviewerNote: string;
      reclassifiedSeverity?: Severity;
      reclassifiedCategory?: FeedbackCategory;
    }) => {
      const { error } = await supabase
        .from("cv_feedback_items")
        .update({
          status: "edited",
          corrected_text: correctedText,
          reviewer_note: reviewerNote || null,
          reclassified_severity: reclassifiedSeverity || null,
          reclassified_category: reclassifiedCategory || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", feedbackId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const acceptAllMinorMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("cv_feedback_items")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("lesson_id", lessonId)
        .eq("status", "pending")
        .in("severity", ["minor", "suggestion"]);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    accept: acceptMutation.mutate,
    reject: rejectMutation.mutate,
    edit: editMutation.mutate,
    acceptAllMinor: acceptAllMinorMutation.mutate,
  };
}
