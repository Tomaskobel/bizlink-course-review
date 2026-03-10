"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useTextChanges(lessonId: string | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["lessonData", lessonId] });
  };

  const createChange = useMutation({
    mutationFn: async ({
      sectionId,
      originalText,
      newText,
      offset,
      feedbackItemId,
    }: {
      sectionId: string;
      originalText: string;
      newText: string;
      offset: number;
      feedbackItemId?: string;
    }) => {
      const { error } = await supabase.from("cv_text_changes").insert({
        section_id: sectionId,
        original_text: originalText,
        new_text: newText,
        offset,
        author: "reviewer",
        feedback_item_id: feedbackItemId || null,
        accepted: false,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const acceptChange = useMutation({
    mutationFn: async (changeId: string) => {
      const { error } = await supabase
        .from("cv_text_changes")
        .update({ accepted: true })
        .eq("id", changeId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const rejectChange = useMutation({
    mutationFn: async (changeId: string) => {
      const { error } = await supabase
        .from("cv_text_changes")
        .delete()
        .eq("id", changeId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    create: createChange.mutate,
    accept: acceptChange.mutate,
    reject: rejectChange.mutate,
  };
}
