"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ContentSection, FeedbackItem, Severity } from "@/types/validation.types";
import React from "react";

const highlightColors: Record<Severity, string> = {
  critical: "bg-red-100/70 dark:bg-red-900/30 underline decoration-red-400 decoration-wavy decoration-1 underline-offset-2",
  major: "bg-amber-100/60 dark:bg-amber-900/25 underline decoration-amber-400 decoration-1 underline-offset-2",
  minor: "bg-yellow-100/50 dark:bg-yellow-900/20",
  suggestion: "bg-blue-100/40 dark:bg-blue-900/20",
};

interface OriginalContentProps {
  sections: ContentSection[];
  feedbackItems: FeedbackItem[];
  activeFeedbackId: string | null;
  onHighlightClick: (feedbackId: string) => void;
}

export function OriginalContent({
  sections,
  feedbackItems,
  activeFeedbackId,
  onHighlightClick,
}: OriginalContentProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {sections.map((section) => {
          const sectionFeedback = feedbackItems.filter(
            (f) => f.status === "pending" || f.id === activeFeedbackId
          );

          return (
            <div key={section.id}>
              <h3 className="text-base font-semibold mb-4 text-foreground">
                {section.title}
              </h3>
              <div className="text-sm leading-7 text-foreground/85">
                {renderHighlightedText(
                  section.body,
                  sectionFeedback,
                  activeFeedbackId,
                  onHighlightClick
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function renderHighlightedText(
  text: string,
  feedbackItems: FeedbackItem[],
  activeFeedbackId: string | null,
  onHighlightClick: (id: string) => void
): React.ReactNode {
  // Find feedback items whose referenced text appears in this section's body
  const highlights: Array<{
    start: number;
    end: number;
    feedbackId: string;
    severity: Severity;
  }> = [];

  for (const fb of feedbackItems) {
    // Use stored offsets if they point to valid positions, fall back to indexOf
    let idx = fb.refStart;
    if (idx < 0 || idx >= text.length || text.slice(fb.refStart, fb.refEnd) !== fb.referencedText) {
      idx = text.indexOf(fb.referencedText);
    }
    if (idx !== -1) {
      highlights.push({
        start: idx,
        end: idx + fb.referencedText.length,
        feedbackId: fb.id,
        severity: fb.severity,
      });
    }
  }

  if (highlights.length === 0) {
    return <>{text}</>;
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const hl of highlights) {
    // Text before highlight
    if (hl.start > lastEnd) {
      parts.push(
        <React.Fragment key={`t-${lastEnd}`}>
          {text.slice(lastEnd, hl.start)}
        </React.Fragment>
      );
    }

    // Highlighted text
    const isActive = hl.feedbackId === activeFeedbackId;
    parts.push(
      <span
        key={`h-${hl.feedbackId}`}
        className={cn(
          "cursor-pointer rounded-sm px-0.5 -mx-0.5 transition-all",
          highlightColors[hl.severity],
          isActive && "ring-2 ring-ring ring-offset-1 ring-offset-background"
        )}
        onClick={() => onHighlightClick(hl.feedbackId)}
        title={`Click to see ${hl.severity} feedback`}
      >
        {text.slice(hl.start, hl.end)}
      </span>
    );

    lastEnd = hl.end;
  }

  // Remaining text
  if (lastEnd < text.length) {
    parts.push(
      <React.Fragment key={`t-${lastEnd}`}>
        {text.slice(lastEnd)}
      </React.Fragment>
    );
  }

  return <>{parts}</>;
}
