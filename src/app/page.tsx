"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/badge";
import { StatsBar } from "@/components/validation/StatsBar";
import { LessonList } from "@/components/validation/LessonList";
import { useReviewData } from "@/hooks/useReviewData";
import { adaptReviewData } from "@/lib/review-adapter";
import { computeStats } from "@/types/validation.types";
import { categoryConfig, priorityConfig } from "@/types/review.types";
import type { FeedbackItem } from "@/types/validation.types";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, error } = useReviewData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Icon name="progress_activity" size={24} weight={300} className="animate-spin mr-2" />
        Loading review data...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load review data
      </div>
    );
  }

  const course = adaptReviewData(data);
  const allFeedback: FeedbackItem[] = course.lessons.flatMap((l) => l.feedbackItems);
  const stats = computeStats(allFeedback);

  const handleSlideSelect = (slideId: string) => {
    router.push(`/validate?lesson=${slideId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Icon name="fact_check" size={18} weight={400} className="text-background" />
              </div>
              <div>
                <h1 className="text-base font-semibold">Course Review Dashboard</h1>
                <p className="text-xs text-muted-foreground">{course.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{data.rawComments.length} raw comments</span>
              <span>&middot;</span>
              <span>{data.globalRules.length} global rules</span>
              <span>&middot;</span>
              <span>{data.conflicts.length} conflicts</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Methodology */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/40 px-5 py-3 border-b">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Icon name="account_tree" size={18} weight={400} className="text-muted-foreground" />
              How Your Comments Were Processed
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Here is what happened with the {data.rawComments.length} comments you left on the course — nothing was lost, and nothing was changed without your review.
            </p>
          </div>
          <div className="px-5 py-4">
            {/* Pipeline summary */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1 bg-muted rounded-full px-3 py-1.5 font-medium text-foreground">
                <Icon name="comment" size={14} weight={400} />
                {data.rawComments.length} comments from reviewers
              </span>
              <Icon name="arrow_forward" size={14} weight={300} />
              <span className="text-[11px]">organized into</span>
              <Icon name="arrow_forward" size={14} weight={300} />
              <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full px-3 py-1.5 font-medium">
                {data.globalRules.length} course-wide rules
              </span>
              <span className="text-[11px]">+</span>
              <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full px-3 py-1.5 font-medium">
                {data.slideActions.length} lesson-specific changes
              </span>
              <span className="text-[11px]">+</span>
              <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-full px-3 py-1.5 font-medium">
                {data.conflicts.length} items needing your decision
              </span>
            </div>

            {/* 3 steps explained */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  Group Repeated Corrections
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When multiple reviewers pointed out the same issue across different lessons (e.g. wrong product name), we extracted it as a <strong>course-wide rule</strong> — one fix applied everywhere, instead of repeating it lesson by lesson.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If a later, more complete rewrite already covers an earlier comment, the earlier one is marked as <em>superseded</em> — so no one has to do the same work twice.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  Classify &amp; Prioritize
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every action is tagged on two axes: <strong>what kind</strong> of issue it is (terminology fix, technical error, content rewrite, tone adjustment, or visual issue) and <strong>how urgent</strong> it is (P1 safety-critical down to P4 nice-to-have).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This helps the course developer focus on what matters most — a safety risk on Lesson 3 gets fixed before polishing wording on Lesson 7.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold">3</span>
                  Apply in the Right Order
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Changes are applied in a specific sequence to avoid wasted effort: <strong>first</strong> fix any safety or technical issues, <strong>then</strong> update terminology everywhere, <strong>then</strong> apply content rewrites, and <strong>finally</strong> polish tone and style.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <em>Why this order?</em> If you polish the wording of a paragraph first, but then that paragraph gets rewritten in the next step — the polish work was for nothing. By going from big changes to small, every edit counts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Classification: 2 Dimensions */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/40 px-5 py-3 border-b">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Icon name="tune" size={18} weight={400} className="text-muted-foreground" />
              Classification — 2 Dimensions
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Every action is tagged on exactly two axes: what kind of issue it is, and how urgent it is.
            </p>
          </div>
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Dimension 1: Category */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-bold">1</span>
                Type — what kind of issue
              </p>
              <div className="space-y-1.5">
                {(Object.entries(categoryConfig) as [string, { label: string; icon: string; bg: string }][]).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[11px] font-medium border ${cfg.bg}`}>
                      <Icon name={cfg.icon} size={14} weight={400} />
                      {cfg.label}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {key === "TERMINOLOGY" && "— naming / product term fix"}
                      {key === "TECHNICAL" && "— factually wrong or safety risk"}
                      {key === "CONTENT" && "— paragraph / section rewrite"}
                      {key === "TONE" && "— informal wording → formal"}
                      {key === "VISUAL" && "— image / diagram error"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Dimension 2: Priority */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-bold">2</span>
                Priority — how urgent
              </p>
              <div className="space-y-1.5">
                {(Object.entries(priorityConfig) as [string, { label: string; bg: string }][]).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Badge className={`text-[11px] border-0 ${cfg.bg}`}>
                      {key} {cfg.label}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {key === "P1" && "— safety risk, fix before publish"}
                      {key === "P2" && "— affects coherence, fix this cycle"}
                      {key === "P3" && "— improves quality, fix this cycle"}
                      {key === "P4" && "— polish, fix if time permits"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Rules — split into Terminology + Style */}
        {(() => {
          const terminologyIds = ["G-02", "G-03", "G-04", "G-05"];
          const styleIds = ["G-06", "G-07"];
          const terminology = data.globalRules.filter(r => terminologyIds.includes(r.rule_id));
          const style = data.globalRules.filter(r => styleIds.includes(r.rule_id));
          return (
            <div className="space-y-6">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Course-Wide Rules
                </h2>
                <span className="text-xs text-muted-foreground">
                  Applied across all lessons
                </span>
              </div>

              {/* Group 1: Terminology */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-50/60 dark:bg-blue-950/20 px-5 py-3 border-b border-blue-200 dark:border-blue-900">
                  <h3 className="text-xs font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-300">
                    <Icon name="spellcheck" size={16} weight={400} />
                    Product Definition &amp; Terminology ({terminology.length})
                  </h3>
                  <p className="text-[11px] text-blue-700/70 dark:text-blue-400/70 mt-0.5">
                    Concrete find-and-replace rules. The course developer can search for the wrong term and replace it everywhere.
                  </p>
                </div>
                <div className="divide-y">
                  {terminology.map((rule) => {
                    const cat = categoryConfig[rule.category];
                    const pri = priorityConfig[rule.priority];
                    return (
                      <div key={rule.id} className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[11px] font-mono bg-muted/50 border-muted-foreground/20">
                            {rule.rule_id}
                          </Badge>
                          <Badge variant="outline" className={`text-[11px] font-medium border ${cat.bg}`}>
                            <Icon name={cat.icon} size={14} weight={400} />
                            {cat.label}
                          </Badge>
                          <Badge className={`text-[11px] ${pri.bg} border-0`}>
                            {pri.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {rule.occurrence_count} occurrences &middot; {rule.reviewer_name}
                          </span>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="line-through text-red-400 dark:text-red-500/70">{rule.wrong_term}</span>
                              <span className="mx-2 text-muted-foreground">&rarr;</span>
                              <span className="font-medium text-green-700 dark:text-green-400">{rule.correct_term}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{rule.notes}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Style Guidelines */}
              <div className="border rounded-lg overflow-hidden border-dashed">
                <div className="bg-muted/30 px-5 py-3 border-b border-dashed">
                  <h3 className="text-xs font-semibold flex items-center gap-2 text-muted-foreground">
                    <Icon name="style" size={16} weight={400} />
                    Language &amp; Description Style ({style.length})
                  </h3>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                    General writing guidelines — not specific find-and-replace, but a tone and register to follow throughout the course.
                  </p>
                </div>
                <div className="divide-y divide-dashed">
                  {style.map((rule) => {
                    const cat = categoryConfig[rule.category];
                    const pri = priorityConfig[rule.priority];
                    return (
                      <div key={rule.id} className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[11px] font-mono bg-muted/50 border-muted-foreground/20">
                            {rule.rule_id}
                          </Badge>
                          <Badge variant="outline" className={`text-[11px] font-medium border ${cat.bg}`}>
                            <Icon name={cat.icon} size={14} weight={400} />
                            {cat.label}
                          </Badge>
                          <Badge className={`text-[11px] ${pri.bg} border-0`}>
                            {pri.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {rule.reviewer_name}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">{rule.wrong_term}</span>
                            <span className="mx-2 text-muted-foreground">&rarr;</span>
                            <span className="font-medium">{rule.correct_term}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{rule.notes}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Conflicts */}
        {data.conflicts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Icon name="warning" size={16} weight={400} className="inline mr-1 text-amber-500" />
                Open Conflicts ({data.conflicts.filter(c => c.status === "open").length})
              </h2>
            </div>
            <div className="space-y-2">
              {data.conflicts.map((conflict) => (
                <div key={conflict.id} className="border rounded-lg px-5 py-4 border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[11px] bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                      {conflict.conflict_id}
                    </Badge>
                    <Badge variant={conflict.status === "open" ? "destructive" : "default"} className="text-[11px]">
                      {conflict.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Lessons: {conflict.affected_slides}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-3">{conflict.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded px-3 py-2 border border-blue-200 dark:border-blue-900">
                      <p className="text-[11px] font-medium text-blue-700 dark:text-blue-400 mb-1">
                        Option A — {conflict.option_a_reviewer}
                      </p>
                      <p className="text-xs">{conflict.option_a}</p>
                    </div>
                    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded px-3 py-2 border border-indigo-200 dark:border-indigo-900">
                      <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400 mb-1">
                        Option B — {conflict.option_b_reviewer}
                      </p>
                      <p className="text-xs">{conflict.option_b}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Recommendation:</span> {conflict.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 1 / Lesson Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Module 1 — Lesson Actions
            </h2>
            <span className="text-xs text-muted-foreground">
              {course.lessons.length} lessons &middot;{" "}
              {allFeedback.length} actions total
            </span>
          </div>
          <LessonList
            lessons={course.lessons}
            onSelect={handleSlideSelect}
          />
        </div>
      </main>
    </div>
  );
}
