"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapFeedbackItem, type DbFeedbackItem } from "./useCourse";
import type {
  ContentSection,
  FeedbackItem,
  TextChange,
  CommentThread,
  Comment,
} from "@/types/validation.types";

interface DbTextChange {
  id: string;
  section_id: string;
  original_text: string;
  new_text: string;
  offset: number;
  author: string;
  feedback_item_id: string | null;
  accepted: boolean;
  created_at: string;
}

interface DbCommentThread {
  id: string;
  section_id: string;
  anchor_text: string;
  anchor_offset: number;
  resolved: boolean;
  created_at: string;
}

interface DbComment {
  id: string;
  thread_id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface LessonData {
  sections: ContentSection[];
  feedbackItems: FeedbackItem[];
  textChanges: TextChange[];
  commentThreads: CommentThread[];
}

async function fetchLessonData(lessonId: string): Promise<LessonData> {
  // Fetch sections
  const { data: rawSections } = await supabase
    .from("cv_sections")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("order");

  const sections: ContentSection[] = (rawSections ?? []).map((s: { id: string; title: string; body: string; order: number }) => ({
    id: s.id,
    title: s.title,
    body: s.body,
    order: s.order,
  }));

  const sectionIds = sections.map((s) => s.id);

  // Fetch feedback items
  const { data: rawFeedback } = await supabase
    .from("cv_feedback_items")
    .select("*")
    .eq("lesson_id", lessonId);

  const feedbackItems: FeedbackItem[] = (rawFeedback as DbFeedbackItem[] ?? []).map(mapFeedbackItem);

  // Fetch text changes
  const { data: rawChanges } = sectionIds.length > 0
    ? await supabase
        .from("cv_text_changes")
        .select("*")
        .in("section_id", sectionIds)
        .order("created_at")
    : { data: [] };

  const textChanges: TextChange[] = (rawChanges as DbTextChange[] ?? []).map((c) => ({
    id: c.id,
    sectionId: c.section_id,
    originalText: c.original_text,
    newText: c.new_text,
    offset: c.offset,
    author: c.author,
    timestamp: c.created_at,
    feedbackItemId: c.feedback_item_id ?? undefined,
    accepted: c.accepted,
  }));

  // Fetch comment threads + comments
  const { data: rawThreads } = sectionIds.length > 0
    ? await supabase
        .from("cv_comment_threads")
        .select("*")
        .in("section_id", sectionIds)
        .order("created_at")
    : { data: [] };

  const threadIds = (rawThreads as DbCommentThread[] ?? []).map((t) => t.id);
  const { data: rawComments } = threadIds.length > 0
    ? await supabase
        .from("cv_comments")
        .select("*")
        .in("thread_id", threadIds)
        .order("created_at")
    : { data: [] };

  const commentsByThread = new Map<string, Comment[]>();
  for (const c of (rawComments as DbComment[] ?? [])) {
    const arr = commentsByThread.get(c.thread_id) ?? [];
    arr.push({ id: c.id, author: c.author, text: c.text, timestamp: c.created_at });
    commentsByThread.set(c.thread_id, arr);
  }

  const commentThreads: CommentThread[] = (rawThreads as DbCommentThread[] ?? []).map((t) => ({
    id: t.id,
    sectionId: t.section_id,
    anchorText: t.anchor_text,
    anchorOffset: t.anchor_offset,
    comments: commentsByThread.get(t.id) ?? [],
    resolved: t.resolved,
  }));

  return { sections, feedbackItems, textChanges, commentThreads };
}

export function useLessonData(lessonId: string | null) {
  return useQuery({
    queryKey: ["lessonData", lessonId],
    queryFn: () => fetchLessonData(lessonId!),
    enabled: !!lessonId,
  });
}
