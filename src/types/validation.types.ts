export type Severity = "critical" | "major" | "minor" | "suggestion";
export type FeedbackStatus = "pending" | "accepted" | "rejected" | "edited";

export type FeedbackCategory =
  | "accuracy"
  | "grammar"
  | "clarity"
  | "completeness"
  | "tone"
  | "formatting"
  | "pedagogy";

export interface FeedbackItem {
  id: string;
  severity: Severity;
  category: FeedbackCategory;
  status: FeedbackStatus;
  feedbackText: string;
  referencedText: string;
  /** Character offset in original content where the referenced text starts */
  refStart: number;
  /** Character offset in original content where the referenced text ends */
  refEnd: number;
  /** Author / reviewer who created this feedback */
  author?: string;
  /** Corrected text (filled when status is "edited") */
  correctedText?: string;
  /** Date the original comment was made */
  commentDate?: string;
  /** Original cr_ category (TERMINOLOGY, TECHNICAL, CONTENT, TONE, VISUAL) */
  reviewCategory?: string;
  /** Original cr_ priority (P1, P2, P3, P4) */
  reviewPriority?: string;
  /** Reviewer note */
  reviewerNote?: string;
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  sections: { id: string; title: string; body: string; order: number }[];
  feedbackItems: FeedbackItem[];
}

export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

/** Computed stats for a lesson or course */
export interface ValidationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  edited: number;
  critical: number;
  major: number;
  minor: number;
  suggestion: number;
  criticalPending: number;
}

export function computeStats(items: FeedbackItem[]): ValidationStats {
  return {
    total: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    accepted: items.filter((i) => i.status === "accepted").length,
    rejected: items.filter((i) => i.status === "rejected").length,
    edited: items.filter((i) => i.status === "edited").length,
    critical: items.filter((i) => i.severity === "critical").length,
    major: items.filter((i) => i.severity === "major").length,
    minor: items.filter((i) => i.severity === "minor").length,
    suggestion: items.filter((i) => i.severity === "suggestion").length,
    criticalPending: items.filter((i) => i.severity === "critical" && i.status === "pending").length,
  };
}
