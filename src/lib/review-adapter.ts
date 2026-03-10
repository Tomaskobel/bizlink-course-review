/**
 * Adapts cr_ table data (ReviewData) into the existing Course/Lesson/FeedbackItem
 * types so the built UI renders without structural changes.
 */
import type { ReviewData, SlideAction } from "@/types/review.types";
import type { Course, Lesson, FeedbackItem, Severity, FeedbackCategory } from "@/types/validation.types";

function mapPriority(p: string): Severity {
  switch (p) {
    case "P1": return "critical";
    case "P2": return "major";
    case "P3": return "minor";
    default: return "suggestion";
  }
}

function mapCategory(c: string): FeedbackCategory {
  switch (c) {
    case "TERMINOLOGY": return "accuracy";
    case "TECHNICAL": return "accuracy";
    case "CONTENT": return "completeness";
    case "TONE": return "tone";
    case "VISUAL": return "formatting";
    default: return "clarity";
  }
}

function mapStatus(s: string): FeedbackItem["status"] {
  switch (s) {
    case "superseded": return "rejected";
    case "done": return "accepted";
    default: return "pending";
  }
}

function actionToFeedbackItem(a: SlideAction): FeedbackItem {
  return {
    id: a.id,
    severity: mapPriority(a.priority),
    category: mapCategory(a.category),
    status: mapStatus(a.status),
    feedbackText: a.reviewer_comment,
    referencedText: a.action_summary,
    refStart: 0,
    refEnd: 0,
    author: a.reviewer,
    correctedText: a.replacement_text ?? undefined,
    commentDate: a.comment_date,
    reviewCategory: a.category,
    reviewPriority: a.priority,
  };
}

export function adaptReviewData(data: ReviewData): Course {
  // Group actions by slide_index
  const slideMap = new Map<number, SlideAction[]>();
  for (const action of data.slideActions) {
    const arr = slideMap.get(action.slide_index) ?? [];
    arr.push(action);
    slideMap.set(action.slide_index, arr);
  }

  const lessons: Lesson[] = Array.from(slideMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([slideIndex, actions]) => ({
      id: String(slideIndex),
      title: `Lesson ${slideIndex}: ${actions[0].slide_title}`,
      order: slideIndex,
      sections: [],
      feedbackItems: actions.map(actionToFeedbackItem),
    }));

  return {
    id: "BCM-100-M1L1-review",
    title: "BizLink LSH3 Dresspack — M1 L1 SME Review",
    lessons,
  };
}
