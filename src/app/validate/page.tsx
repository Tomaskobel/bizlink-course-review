"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedbackCard } from "@/components/validation/FeedbackCard";
import { ResolutionPanel } from "@/components/validation/ResolutionPanel";
import { FilterBar } from "@/components/validation/FilterBar";
import { useReviewData } from "@/hooks/useReviewData";
import { adaptReviewData } from "@/lib/review-adapter";
import {
  computeStats,
  type FeedbackItem,
  type FeedbackStatus,
  type Severity,
  type FeedbackCategory,
} from "@/types/validation.types";
import type { ReviewCategory, ReviewPriority } from "@/types/review.types";

export default function ValidatePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
      <ValidatePageContent />
    </Suspense>
  );
}

function ValidatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, isLoading } = useReviewData();

  const lessonId = searchParams.get("lesson");

  const course = useMemo(() => {
    if (!data) return null;
    return adaptReviewData(data);
  }, [data]);

  const lessonIndex = course?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const lesson = lessonIndex >= 0 ? course!.lessons[lessonIndex] : course?.lessons[0];
  const actualIndex = lessonIndex >= 0 ? lessonIndex : 0;
  const prevLesson = actualIndex > 0 ? course!.lessons[actualIndex - 1] : null;
  const nextLesson = course && actualIndex < course.lessons.length - 1 ? course.lessons[actualIndex + 1] : null;

  // Local state for feedback items
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FeedbackItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<ReviewCategory | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<ReviewPriority | null>(null);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | null>(null);

  // Reset when lesson changes
  useEffect(() => {
    if (lesson) {
      setFeedbackItems(lesson.feedbackItems);
      setActiveFeedbackId(null);
    }
  }, [lesson]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return feedbackItems.filter((item) => {
      if (categoryFilter && item.reviewCategory !== categoryFilter) return false;
      if (priorityFilter && item.reviewPriority !== priorityFilter) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      return true;
    });
  }, [feedbackItems, categoryFilter, priorityFilter, statusFilter]);

  const stats = useMemo(() => computeStats(feedbackItems), [feedbackItems]);

  const pendingMinorCount = useMemo(
    () =>
      feedbackItems.filter(
        (i) =>
          i.status === "pending" &&
          (i.severity === "minor" || i.severity === "suggestion")
      ).length,
    [feedbackItems]
  );

  // Actions
  const handleAccept = useCallback((id: string) => {
    setFeedbackItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "accepted" as const } : item
      )
    );
  }, []);

  const handleReject = useCallback((id: string) => {
    setFeedbackItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" as const } : item
      )
    );
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      const item = feedbackItems.find((i) => i.id === id);
      if (item) {
        setEditingItem(item);
        setEditDialogOpen(true);
      }
    },
    [feedbackItems]
  );

  const handleSaveResolution = useCallback(
    (
      id: string,
      data: {
        correctedText: string;
        reviewerNote: string;
        reclassifiedSeverity?: Severity;
        reclassifiedCategory?: FeedbackCategory;
      }
    ) => {
      setFeedbackItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "edited" as const,
                correctedText: data.correctedText,
                reviewerNote: data.reviewerNote,
                reclassifiedSeverity: data.reclassifiedSeverity,
                reclassifiedCategory: data.reclassifiedCategory,
              }
            : item
        )
      );
      setEditDialogOpen(false);
      setEditingItem(null);
    },
    []
  );

  const handleAcceptAllMinor = useCallback(() => {
    setFeedbackItems((prev) =>
      prev.map((item) =>
        item.status === "pending" &&
        (item.severity === "minor" || item.severity === "suggestion")
          ? { ...item, status: "accepted" as const }
          : item
      )
    );
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editDialogOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const activeItem = feedbackItems.find((i) => i.id === activeFeedbackId);
      if (!activeItem || activeItem.status !== "pending") return;

      switch (e.key.toLowerCase()) {
        case "a":
          handleAccept(activeItem.id);
          break;
        case "r":
          handleReject(activeItem.id);
          break;
        case "e":
          handleEdit(activeItem.id);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFeedbackId, feedbackItems, editDialogOpen, handleAccept, handleReject, handleEdit]);

  // Navigate between feedback items with J/K
  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (editDialogOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const currentIndex = filteredItems.findIndex(
        (i) => i.id === activeFeedbackId
      );

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(currentIndex + 1, filteredItems.length - 1);
        setActiveFeedbackId(filteredItems[next]?.id ?? null);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(currentIndex - 1, 0);
        setActiveFeedbackId(filteredItems[prev]?.id ?? null);
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [activeFeedbackId, filteredItems, editDialogOpen]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        <Icon name="progress_activity" size={24} weight={300} className="animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Lesson not found
      </div>
    );
  }

  const resolved = stats.accepted + stats.rejected + stats.edited;
  const progressPct = stats.total === 0 ? 100 : Math.round((resolved / stats.total) * 100);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="border-b bg-card shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => router.push("/")}
              >
                <Icon name="arrow_back" size={18} weight={300} />
                Dashboard
              </Button>
              <div className="w-px h-5 bg-border" />
              <div>
                <h1 className="text-sm font-semibold">{lesson.title}</h1>
                <p className="text-xs text-muted-foreground">
                  Lesson {actualIndex + 1} of {course.lessons.length}
                </p>
              </div>
            </div>

            {/* Progress — prominent */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium tabular-nums">
                  {resolved} of {stats.total} reviewed
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {stats.pending} remaining
                </p>
              </div>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 dark:bg-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-2 border-t bg-muted/30">
          <FilterBar
            activeCategory={categoryFilter}
            activePriority={priorityFilter}
            activeStatus={statusFilter}
            onCategoryChange={setCategoryFilter}
            onPriorityChange={setPriorityFilter}
            onStatusChange={setStatusFilter}
            onAcceptAllMinor={handleAcceptAllMinor}
            pendingMinorCount={pendingMinorCount}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 min-h-0">
          <div className="max-w-3xl mx-auto p-6 space-y-3">

            {/* Guide banner — explains what to do */}
            {showGuide && stats.pending > 0 && (
              <div className="border rounded-lg bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900 px-5 py-4 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <Icon name="info" size={18} weight={400} className="text-blue-600 dark:text-blue-400" />
                      How to review this lesson
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      Below are {stats.total} proposed changes to this lesson, based on reviewer comments.
                      Go through each one and decide what should happen:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="check_circle" size={14} weight={400} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Apply this change</p>
                          <p className="text-muted-foreground">You agree — this correction should be made in the course.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="cancel" size={14} weight={400} className="text-red-500 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Skip</p>
                          <p className="text-muted-foreground">You disagree — the current course text is fine as-is.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="edit" size={14} weight={400} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Modify</p>
                          <p className="text-muted-foreground">The idea is right but the wording needs adjustment. Write your own version.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGuide(false)}
                    className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                  >
                    <Icon name="close" size={18} weight={300} />
                  </button>
                </div>
              </div>
            )}

            {/* All-done state */}
            {stats.pending === 0 && stats.total > 0 && (
              <div className="border rounded-lg bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900 px-5 py-6 mb-4 text-center">
                <Icon name="task_alt" size={32} weight={300} className="text-green-600 dark:text-green-400 mb-2" />
                <h3 className="text-sm font-semibold mb-1">All actions reviewed</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  You have reviewed all {stats.total} items in this lesson.
                  {stats.accepted > 0 && ` ${stats.accepted} accepted.`}
                  {stats.rejected > 0 && ` ${stats.rejected} skipped.`}
                  {stats.edited > 0 && ` ${stats.edited} modified.`}
                </p>
                {nextLesson ? (
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => router.push(`/validate?lesson=${nextLesson.id}`)}
                  >
                    Continue to next lesson
                    <Icon name="arrow_forward" size={16} weight={300} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => router.push("/")}
                  >
                    Back to dashboard
                    <Icon name="arrow_forward" size={16} weight={300} />
                  </Button>
                )}
              </div>
            )}

            {/* Feedback cards */}
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Icon name="filter_list_off" size={32} weight={200} className="mb-2" />
                <p className="text-sm">No actions match the selected filters</p>
                <p className="text-xs mt-1">Try removing a filter to see more items.</p>
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div key={item.id}>
                  {/* Item counter */}
                  {item.status === "pending" && (
                    <p className="text-[11px] text-muted-foreground mb-1.5 ml-1">
                      Item {idx + 1} of {filteredItems.length}
                    </p>
                  )}
                  <FeedbackCard
                    item={item}
                    isActive={activeFeedbackId === item.id}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onEdit={handleEdit}
                    onSelect={setActiveFeedbackId}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Lesson navigation */}
      <footer className="border-t bg-card shrink-0">
        <div className="px-6 py-2.5 flex items-center justify-between">
          {prevLesson ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => router.push(`/validate?lesson=${prevLesson.id}`)}
            >
              <Icon name="chevron_left" size={16} weight={300} />
              <span className="hidden sm:inline text-muted-foreground">{prevLesson.title}</span>
              <span className="sm:hidden text-muted-foreground">Previous</span>
            </Button>
          ) : (
            <div />
          )}

          <span className="text-xs text-muted-foreground tabular-nums">
            {actualIndex + 1} / {course.lessons.length}
          </span>

          {nextLesson ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => router.push(`/validate?lesson=${nextLesson.id}`)}
            >
              <span className="hidden sm:inline text-muted-foreground">{nextLesson.title}</span>
              <span className="sm:hidden text-muted-foreground">Next</span>
              <Icon name="chevron_right" size={16} weight={300} />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </footer>

      {/* Resolution panel dialog */}
      <ResolutionPanel
        item={editingItem}
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveResolution}
      />
    </div>
  );
}
