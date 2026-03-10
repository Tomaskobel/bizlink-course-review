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
  /** Reclassified severity (if reviewer changed it) */
  reclassifiedSeverity?: Severity;
  /** Reclassified category (if reviewer changed it) */
  reclassifiedCategory?: FeedbackCategory;
}

export interface ContentSection {
  id: string;
  title: string;
  body: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  sections: ContentSection[];
  feedbackItems: FeedbackItem[];
}

export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

// ── Tracked Changes ─────────────────────────────────────────────

export interface TextChange {
  id: string;
  sectionId: string;
  /** Original text that was replaced */
  originalText: string;
  /** New text that replaced it */
  newText: string;
  /** Character offset in the section body where the change starts */
  offset: number;
  /** Who made the change */
  author: string;
  /** When the change was made */
  timestamp: string;
  /** Linked feedback item ID (if change came from resolving feedback) */
  feedbackItemId?: string;
  /** Whether the change has been accepted/finalized */
  accepted: boolean;
}

// ── Comments ────────────────────────────────────────────────────

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface CommentThread {
  id: string;
  sectionId: string;
  /** The text passage this comment is anchored to */
  anchorText: string;
  /** Character offset in section body */
  anchorOffset: number;
  comments: Comment[];
  resolved: boolean;
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
