"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { categoryConfig, priorityConfig } from "@/types/review.types";
import type { ReviewCategory, ReviewPriority } from "@/types/review.types";
import type { FeedbackStatus } from "@/types/validation.types";

const categoryFilters: { value: ReviewCategory; label: string; icon: string }[] = [
  { value: "TERMINOLOGY", label: "Terminology", icon: "spellcheck" },
  { value: "TECHNICAL", label: "Technical", icon: "engineering" },
  { value: "CONTENT", label: "Content", icon: "article" },
  { value: "TONE", label: "Tone", icon: "record_voice_over" },
  { value: "VISUAL", label: "Visual", icon: "image" },
];

const priorityFilters: { value: ReviewPriority; label: string }[] = [
  { value: "P1", label: "P1 Critical" },
  { value: "P2", label: "P2 High" },
  { value: "P3", label: "P3 Medium" },
  { value: "P4", label: "P4 Low" },
];

const statusFilters: { value: FeedbackStatus; label: string; icon: string }[] = [
  { value: "pending", label: "Pending", icon: "pending_actions" },
  { value: "accepted", label: "Accepted", icon: "check_circle" },
  { value: "rejected", label: "Rejected", icon: "cancel" },
  { value: "edited", label: "Edited", icon: "edit" },
];

interface FilterBarProps {
  activeCategory: ReviewCategory | null;
  activePriority: ReviewPriority | null;
  activeStatus: FeedbackStatus | null;
  onCategoryChange: (cat: ReviewCategory | null) => void;
  onPriorityChange: (pri: ReviewPriority | null) => void;
  onStatusChange: (status: FeedbackStatus | null) => void;
  onAcceptAllMinor: () => void;
  pendingMinorCount: number;
}

export function FilterBar({
  activeCategory,
  activePriority,
  activeStatus,
  onCategoryChange,
  onPriorityChange,
  onStatusChange,
  onAcceptAllMinor,
  pendingMinorCount,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Category filters */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Type:</span>
        {categoryFilters.map((f) => {
          const cfg = categoryConfig[f.value];
          return (
            <button
              key={f.value}
              onClick={() =>
                onCategoryChange(activeCategory === f.value ? null : f.value)
              }
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border",
                activeCategory === f.value
                  ? cn("border-current/20", cfg.color)
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon name={f.icon} size={14} weight={400} />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Priority filters */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Priority:</span>
        {priorityFilters.map((f) => {
          const cfg = priorityConfig[f.value];
          return (
            <button
              key={f.value}
              onClick={() =>
                onPriorityChange(activePriority === f.value ? null : f.value)
              }
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border",
                activePriority === f.value
                  ? cn("border-current/20", cfg.color)
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Status filters */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Status:</span>
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() =>
              onStatusChange(activeStatus === f.value ? null : f.value)
            }
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border",
              activeStatus === f.value
                ? "bg-secondary text-secondary-foreground border-secondary-foreground/20"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon name={f.icon} size={14} weight={400} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Batch action */}
      {pendingMinorCount > 0 && (
        <>
          <div className="w-px h-5 bg-border" />
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={onAcceptAllMinor}
          >
            <Icon name="done_all" size={14} weight={400} />
            Accept all minor ({pendingMinorCount})
          </Button>
        </>
      )}
    </div>
  );
}
