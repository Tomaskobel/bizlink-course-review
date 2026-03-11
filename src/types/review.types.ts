// ── Course Review types (cr_ tables) ────────────────────────────

export type ReviewCategory = "TERMINOLOGY" | "TECHNICAL" | "CONTENT" | "TONE" | "VISUAL";
export type ReviewPriority = "P1" | "P2" | "P3" | "P4";
export type ActionStatus = "pending" | "applied" | "rejected" | "superseded";

export interface GlobalRule {
  id: string;
  rule_id: string;
  wrong_term: string;
  correct_term: string;
  category: ReviewCategory;
  priority: ReviewPriority;
  source_comments: string;
  notes: string;
  reviewer_email: string;
  reviewer_name: string;
  occurrence_count: number;
}

export interface SlideAction {
  id: string;
  action_id: string;
  slide_index: number;
  slide_title: string;
  action_summary: string;
  reviewer_comment: string;
  replacement_text: string | null;
  category: ReviewCategory;
  priority: ReviewPriority;
  action_type: string;
  execution_phase: number;
  reviewer: string;
  reviewer_email: string;
  comment_date: string;
  source_comment_refs: string;
  status: ActionStatus;
  superseded_by: string | null;
}

export interface Conflict {
  id: string;
  conflict_id: string;
  description: string;
  option_a: string;
  option_a_reviewer: string;
  option_b: string;
  option_b_reviewer: string;
  affected_slides: string;
  recommendation: string;
  status: "open" | "resolved";
  decided_by: string | null;
  decided_at: string | null;
  linked_rule_id: string | null;
}

export interface RawComment {
  id: string;
  slide_index: number;
  slide_title: string;
  comment_num: number;
  comment_type: string;
  reviewer_email: string;
  reviewer_name: string;
  comment_date: string;
  message: string;
  resolved: boolean;
}

export interface ReviewData {
  globalRules: GlobalRule[];
  slideActions: SlideAction[];
  conflicts: Conflict[];
  rawComments: RawComment[];
}

// ── Category & Priority config ──────────────────────────────────

export const categoryConfig: Record<ReviewCategory, { label: string; color: string; bg: string; icon: string }> = {
  TERMINOLOGY: {
    label: "Terminology",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
    icon: "spellcheck",
  },
  TECHNICAL: {
    label: "Technical",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
    icon: "engineering",
  },
  CONTENT: {
    label: "Content",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
    icon: "article",
  },
  TONE: {
    label: "Tone",
    color: "text-indigo-700 dark:text-indigo-400",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
    icon: "record_voice_over",
  },
  VISUAL: {
    label: "Visual",
    color: "text-pink-700 dark:text-pink-400",
    bg: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-900",
    icon: "image",
  },
};

export const priorityConfig: Record<ReviewPriority, { label: string; color: string; bg: string }> = {
  P1: {
    label: "Critical",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300",
  },
  P2: {
    label: "High",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
  P3: {
    label: "Medium",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300",
  },
  P4: {
    label: "Low",
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300",
  },
};

