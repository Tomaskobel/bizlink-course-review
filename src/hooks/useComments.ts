"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useComments(lessonId: string | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["lessonData", lessonId] });
  };

  const createThread = useMutation({
    mutationFn: async ({
      sectionId,
      anchorText,
      anchorOffset,
      text,
    }: {
      sectionId: string;
      anchorText: string;
      anchorOffset: number;
      text: string;
    }) => {
      // Create thread
      const { data: thread, error: threadErr } = await supabase
        .from("cv_comment_threads")
        .insert({
          section_id: sectionId,
          anchor_text: anchorText,
          anchor_offset: anchorOffset,
          resolved: false,
        })
        .select("id")
        .single();
      if (threadErr || !thread) throw threadErr;

      // Add first comment
      const { error: commentErr } = await supabase.from("cv_comments").insert({
        thread_id: thread.id,
        author: "reviewer",
        text,
      });
      if (commentErr) throw commentErr;
    },
    onSuccess: invalidate,
  });

  const addComment = useMutation({
    mutationFn: async ({ threadId, text }: { threadId: string; text: string }) => {
      const { error } = await supabase.from("cv_comments").insert({
        thread_id: threadId,
        author: "reviewer",
        text,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const resolveThread = useMutation({
    mutationFn: async (threadId: string) => {
      const { error } = await supabase
        .from("cv_comment_threads")
        .update({ resolved: true })
        .eq("id", threadId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    createThread: createThread.mutate,
    addComment: addComment.mutate,
    resolveThread: resolveThread.mutate,
  };
}
