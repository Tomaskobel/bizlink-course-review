"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Course, Lesson, ContentSection, FeedbackItem } from "@/types/validation.types";

interface DbCourse {
  id: string;
  title: string;
  created_at: string;
}

interface DbLesson {
  id: string;
  course_id: string;
  title: string;
  order: number;
}

interface DbSection {
  id: string;
  lesson_id: string;
  title: string;
  body: string;
  order: number;
}

interface DbFeedbackItem {
  id: string;
  lesson_id: string;
  section_id: string | null;
  severity: string;
  category: string;
  status: string;
  feedback_text: string;
  referenced_text: string;
  ref_start: number;
  ref_end: number;
  corrected_text: string | null;
  reviewer_note: string | null;
  reclassified_severity: string | null;
  reclassified_category: string | null;
}

function mapFeedbackItem(db: DbFeedbackItem): FeedbackItem {
  return {
    id: db.id,
    severity: db.severity as FeedbackItem["severity"],
    category: db.category as FeedbackItem["category"],
    status: db.status as FeedbackItem["status"],
    feedbackText: db.feedback_text,
    referencedText: db.referenced_text,
    refStart: db.ref_start,
    refEnd: db.ref_end,
    correctedText: db.corrected_text ?? undefined,
    reviewerNote: db.reviewer_note ?? undefined,
    reclassifiedSeverity: (db.reclassified_severity as FeedbackItem["severity"]) ?? undefined,
    reclassifiedCategory: (db.reclassified_category as FeedbackItem["category"]) ?? undefined,
  };
}

async function fetchCourse(courseId?: string): Promise<Course | null> {
  // Get the first (or specified) course
  let query = supabase.from("cv_courses").select("*");
  if (courseId) {
    query = query.eq("id", courseId);
  }
  const { data: courses, error: courseErr } = await query.order("created_at", { ascending: false }).limit(1);
  if (courseErr || !courses?.length) return null;

  const course = courses[0] as DbCourse;

  // Get lessons
  const { data: lessons } = await supabase
    .from("cv_lessons")
    .select("*")
    .eq("course_id", course.id)
    .order("order");

  // Get all sections for these lessons
  const lessonIds = (lessons as DbLesson[] | null)?.map((l) => l.id) ?? [];
  const { data: sections } = await supabase
    .from("cv_sections")
    .select("*")
    .in("lesson_id", lessonIds)
    .order("order");

  // Get all feedback items for these lessons
  const { data: feedbackItems } = await supabase
    .from("cv_feedback_items")
    .select("*")
    .in("lesson_id", lessonIds);

  // Assemble
  const sectionsByLesson = new Map<string, ContentSection[]>();
  for (const s of (sections as DbSection[] | null) ?? []) {
    const arr = sectionsByLesson.get(s.lesson_id) ?? [];
    arr.push({ id: s.id, title: s.title, body: s.body, order: s.order });
    sectionsByLesson.set(s.lesson_id, arr);
  }

  const feedbackByLesson = new Map<string, FeedbackItem[]>();
  for (const f of (feedbackItems as DbFeedbackItem[] | null) ?? []) {
    const arr = feedbackByLesson.get(f.lesson_id) ?? [];
    arr.push(mapFeedbackItem(f));
    feedbackByLesson.set(f.lesson_id, arr);
  }

  const mappedLessons: Lesson[] = ((lessons as DbLesson[] | null) ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    order: l.order,
    sections: sectionsByLesson.get(l.id) ?? [],
    feedbackItems: feedbackByLesson.get(l.id) ?? [],
  }));

  return {
    id: course.id,
    title: course.title,
    lessons: mappedLessons,
  };
}

export function useCourse(courseId?: string) {
  return useQuery({
    queryKey: ["course", courseId ?? "latest"],
    queryFn: () => fetchCourse(courseId),
  });
}

export { mapFeedbackItem, type DbFeedbackItem };
