"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { categoryConfig, priorityConfig } from "@/types/review.types";
import type { ReviewCategory, ReviewPriority } from "@/types/review.types";
import type { FeedbackItem } from "@/types/validation.types";

function formatCommentDate(raw: string): string {
  // Input format: "10:04am March 9, 2026"
  const match = raw.match(/(\d{1,2}:\d{2}(?:am|pm))\s+(\w+)\s+(\d{1,2}),?\s*(\d{4})/i);
  if (!match) return raw;
  const [, , month, day] = match;
  return `${day} ${month.slice(0, 3)}`;
}

const statusStyles = {
  pending: "",
  accepted: "border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20",
  rejected: "opacity-50 border-dashed",
  edited: "border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20",
};

const statusIcons = {
  accepted: { icon: "check_circle", label: "Accepted — will be applied", color: "text-green-600 dark:text-green-400" },
  rejected: { icon: "cancel", label: "Rejected — will be skipped", color: "text-red-500 dark:text-red-400" },
  edited: { icon: "edit", label: "Edited — modified version will be applied", color: "text-blue-600 dark:text-blue-400" },
};

interface FeedbackCardProps {
  item: FeedbackItem;
  isActive?: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
  onSelect: (id: string) => void;
}

export function FeedbackCard({
  item,
  isActive,
  onAccept,
  onReject,
  onEdit,
  onSelect,
}: FeedbackCardProps) {
  const cat = item.reviewCategory
    ? categoryConfig[item.reviewCategory as ReviewCategory]
    : null;
  const pri = item.reviewPriority
    ? priorityConfig[item.reviewPriority as ReviewPriority]
    : null;

  const isResolved = item.status !== "pending";

  return (
    <div
      className={cn(
        "border rounded-lg transition-all cursor-pointer group",
        statusStyles[item.status],
        isActive && "ring-2 ring-ring shadow-sm",
        item.status === "pending" && "hover:shadow-sm hover:border-foreground/20"
      )}
      onClick={() => onSelect(item.id)}
    >
      {/* Status banner for resolved items */}
      {isResolved && item.status in statusIcons && (
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg border-b",
          item.status === "accepted" && "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
          item.status === "rejected" && "bg-muted text-muted-foreground border-border",
          item.status === "edited" && "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
        )}>
          <Icon name={statusIcons[item.status as keyof typeof statusIcons].icon} size={16} weight={400} />
          {statusIcons[item.status as keyof typeof statusIcons].label}
        </div>
      )}

      <div className={cn("p-4", isResolved && "opacity-60")}>
        {/* Header: category + priority + author */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {cat && (
              <Badge variant="outline" className={cn("text-[11px] font-medium border", cat.bg)}>
                <Icon name={cat.icon} size={14} weight={400} />
                {cat.label}
              </Badge>
            )}
            {pri && (
              <Badge className={cn("text-[11px] border-0", pri.bg)}>
                {pri.label}
              </Badge>
            )}
          </div>
          {(item.author || item.commentDate) && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {item.author && (
                <span>{item.author}</span>
              )}
              {item.commentDate && (
                <>
                  <span>&middot;</span>
                  <span>{formatCommentDate(item.commentDate)}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* What the reviewer said */}
        <div className="mb-3">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Reviewer comment
          </p>
          <p className="text-sm leading-relaxed">{item.feedbackText}</p>
        </div>

        {/* What text is affected */}
        <div className="mb-3">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Affected text in the course
          </p>
          <div className="text-sm bg-red-50/40 dark:bg-red-950/10 rounded px-3 py-2 border border-red-200/40 dark:border-red-900/30 text-foreground/80">
            {item.referencedText}
          </div>
        </div>

        {/* Proposed fix (if available) */}
        {item.correctedText && (
          <div className="mb-3">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Proposed replacement
            </p>
            <div className="text-sm bg-green-50/40 dark:bg-green-950/10 rounded px-3 py-2 border border-green-200/40 dark:border-green-900/30 text-foreground/80">
              {item.correctedText}
            </div>
          </div>
        )}

        {/* Reviewer note (if edited) */}
        {item.reviewerNote && (
          <div className="mb-3">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Your note
            </p>
            <p className="text-xs text-muted-foreground italic">{item.reviewerNote}</p>
          </div>
        )}

        {/* Actions — only for pending items */}
        {item.status === "pending" && (
          <div className="flex items-center gap-2 pt-2 border-t border-dashed">
            <span className="text-[11px] text-muted-foreground mr-1">Your decision:</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-green-700 border-green-200 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-950/40"
              onClick={(e) => {
                e.stopPropagation();
                onAccept(item.id);
              }}
            >
              <Icon name="check_circle" size={16} weight={400} />
              Apply this change
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950/40"
              onClick={(e) => {
                e.stopPropagation();
                onReject(item.id);
              }}
            >
              <Icon name="cancel" size={16} weight={400} />
              Skip
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item.id);
              }}
            >
              <Icon name="edit" size={16} weight={400} />
              Modify
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
