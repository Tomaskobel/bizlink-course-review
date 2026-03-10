"use client";

import { useState, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type {
  ContentSection,
  FeedbackItem,
  TextChange,
  CommentThread,
  Severity,
} from "@/types/validation.types";
import React from "react";

// ── Highlight colors ────────────────────────────────────────────

const feedbackHighlightColors: Record<Severity, string> = {
  critical:
    "bg-red-100/70 dark:bg-red-900/30 decoration-red-400 decoration-wavy decoration-1 underline underline-offset-2",
  major:
    "bg-amber-100/60 dark:bg-amber-900/25 decoration-amber-400 decoration-1 underline underline-offset-2",
  minor: "bg-yellow-100/50 dark:bg-yellow-900/20",
  suggestion: "bg-blue-100/40 dark:bg-blue-900/20",
};

// ── Types ───────────────────────────────────────────────────────

interface EditableContentProps {
  sections: ContentSection[];
  feedbackItems: FeedbackItem[];
  textChanges: TextChange[];
  commentThreads: CommentThread[];
  activeFeedbackId: string | null;
  onHighlightClick: (feedbackId: string) => void;
  onTextEdit: (sectionId: string, originalText: string, newText: string, offset: number, feedbackItemId?: string) => void;
  onAcceptChange: (changeId: string) => void;
  onRejectChange: (changeId: string) => void;
  onOpenCommentThread: (threadId: string) => void;
  onStartNewComment: (sectionId: string, anchorText: string, anchorOffset: number) => void;
  showTrackChanges: boolean;
}

// ── Main Component ──────────────────────────────────────────────

export function EditableContent({
  sections,
  feedbackItems,
  textChanges,
  commentThreads,
  activeFeedbackId,
  onHighlightClick,
  onTextEdit,
  onAcceptChange,
  onRejectChange,
  onOpenCommentThread,
  onStartNewComment,
  showTrackChanges,
}: EditableContentProps) {
  const [editingSpan, setEditingSpan] = useState<{
    sectionId: string;
    text: string;
    offset: number;
    feedbackItemId?: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const editRef = useRef<HTMLTextAreaElement>(null);

  const startInlineEdit = useCallback(
    (sectionId: string, text: string, offset: number, feedbackItemId?: string) => {
      setEditingSpan({ sectionId, text, offset, feedbackItemId });
      setEditValue(text);
      // Focus after render
      setTimeout(() => editRef.current?.focus(), 50);
    },
    []
  );

  const commitEdit = useCallback(() => {
    if (!editingSpan) return;
    if (editValue !== editingSpan.text) {
      onTextEdit(
        editingSpan.sectionId,
        editingSpan.text,
        editValue,
        editingSpan.offset,
        editingSpan.feedbackItemId
      );
    }
    setEditingSpan(null);
  }, [editingSpan, editValue, onTextEdit]);

  const cancelEdit = useCallback(() => {
    setEditingSpan(null);
  }, []);

  // Handle text selection for new comments
  const handleMouseUp = useCallback(
    (sectionId: string, sectionBody: string) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) return;

      const selectedText = selection.toString().trim();
      const idx = sectionBody.indexOf(selectedText);
      if (idx === -1) return;

      // Store for the comment button to use
      (window as unknown as Record<string, unknown>).__pendingComment = {
        sectionId,
        text: selectedText,
        offset: idx,
      };
    },
    []
  );

  const handleAddComment = useCallback(() => {
    const pending = (window as unknown as Record<string, { sectionId: string; text: string; offset: number }>).__pendingComment;
    if (pending) {
      onStartNewComment(pending.sectionId, pending.text, pending.offset);
      delete (window as unknown as Record<string, unknown>).__pendingComment;
      window.getSelection()?.removeAllRanges();
    }
  }, [onStartNewComment]);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Floating comment button */}
        <FloatingCommentButton onAddComment={handleAddComment} />

        {sections.map((section) => {
          const sectionFeedback = feedbackItems.filter(
            (f) => f.status === "pending" || f.id === activeFeedbackId
          );
          const sectionChanges = textChanges.filter(
            (c) => c.sectionId === section.id
          );
          const sectionComments = commentThreads.filter(
            (c) => c.sectionId === section.id && !c.resolved
          );

          return (
            <div
              key={section.id}
              onMouseUp={() => handleMouseUp(section.id, section.body)}
            >
              <h3 className="text-base font-semibold mb-4 text-foreground">
                {section.title}
              </h3>
              <div className="text-sm leading-7 text-foreground/85">
                {renderContent({
                  text: section.body,
                  sectionId: section.id,
                  feedbackItems: sectionFeedback,
                  textChanges: sectionChanges,
                  commentThreads: sectionComments,
                  activeFeedbackId,
                  editingSpan,
                  editValue,
                  editRef,
                  showTrackChanges,
                  onHighlightClick,
                  onStartEdit: startInlineEdit,
                  onEditValueChange: setEditValue,
                  onCommitEdit: commitEdit,
                  onCancelEdit: cancelEdit,
                  onAcceptChange,
                  onRejectChange,
                  onOpenCommentThread,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

// ── Floating comment button ─────────────────────────────────────

function FloatingCommentButton({ onAddComment }: { onAddComment: () => void }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.toString().trim().length > 0) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setPos({ x: rect.right + 8, y: rect.top - 4 });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="fixed z-50 flex items-center gap-1 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium shadow-lg hover:opacity-90 transition-opacity"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={(e) => {
        e.preventDefault(); // Don't lose selection
        onAddComment();
      }}
    >
      <Icon name="add_comment" size={14} weight={400} className="text-background" />
      Comment
    </button>
  );
}

// ── Content Renderer ────────────────────────────────────────────

interface RenderConfig {
  text: string;
  sectionId: string;
  feedbackItems: FeedbackItem[];
  textChanges: TextChange[];
  commentThreads: CommentThread[];
  activeFeedbackId: string | null;
  editingSpan: { sectionId: string; text: string; offset: number; feedbackItemId?: string } | null;
  editValue: string;
  editRef: React.RefObject<HTMLTextAreaElement | null>;
  showTrackChanges: boolean;
  onHighlightClick: (id: string) => void;
  onStartEdit: (sectionId: string, text: string, offset: number, feedbackItemId?: string) => void;
  onEditValueChange: (value: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onAcceptChange: (id: string) => void;
  onRejectChange: (id: string) => void;
  onOpenCommentThread: (id: string) => void;
}

interface Annotation {
  start: number;
  end: number;
  type: "feedback" | "change" | "comment";
  id: string;
  severity?: Severity;
  change?: TextChange;
  thread?: CommentThread;
  feedbackItemId?: string;
}

function renderContent(cfg: RenderConfig): React.ReactNode {
  const { text, sectionId } = cfg;

  // Collect all annotations
  const annotations: Annotation[] = [];

  // Feedback highlights
  for (const fb of cfg.feedbackItems) {
    const idx = text.indexOf(fb.referencedText);
    if (idx !== -1) {
      annotations.push({
        start: idx,
        end: idx + fb.referencedText.length,
        type: "feedback",
        id: fb.id,
        severity: fb.severity,
        feedbackItemId: fb.id,
      });
    }
  }

  // Track changes
  if (cfg.showTrackChanges) {
    for (const change of cfg.textChanges) {
      const idx = text.indexOf(change.originalText);
      if (idx !== -1) {
        annotations.push({
          start: idx,
          end: idx + change.originalText.length,
          type: "change",
          id: change.id,
          change,
        });
      }
    }
  }

  // Comment anchors
  for (const thread of cfg.commentThreads) {
    const idx = text.indexOf(thread.anchorText);
    if (idx !== -1) {
      annotations.push({
        start: idx,
        end: idx + thread.anchorText.length,
        type: "comment",
        id: thread.id,
        thread,
      });
    }
  }

  if (annotations.length === 0) {
    return <>{text}</>;
  }

  // Sort by start, then by priority (changes > feedback > comments)
  annotations.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const priority = { change: 0, feedback: 1, comment: 2 };
    return priority[a.type] - priority[b.type];
  });

  // Remove overlaps — keep first occurrence
  const filtered: Annotation[] = [];
  let lastEnd = 0;
  for (const ann of annotations) {
    if (ann.start >= lastEnd) {
      filtered.push(ann);
      lastEnd = ann.end;
    }
  }

  const parts: React.ReactNode[] = [];
  lastEnd = 0;

  for (const ann of filtered) {
    // Plain text before annotation
    if (ann.start > lastEnd) {
      parts.push(
        <React.Fragment key={`t-${lastEnd}`}>
          {text.slice(lastEnd, ann.start)}
        </React.Fragment>
      );
    }

    const annotatedText = text.slice(ann.start, ann.end);

    // Check if this span is currently being edited inline
    if (
      cfg.editingSpan &&
      cfg.editingSpan.sectionId === sectionId &&
      cfg.editingSpan.text === annotatedText &&
      cfg.editingSpan.offset === ann.start
    ) {
      parts.push(
        <InlineEditor
          key={`edit-${ann.id}`}
          value={cfg.editValue}
          onChange={cfg.onEditValueChange}
          onCommit={cfg.onCommitEdit}
          onCancel={cfg.onCancelEdit}
          editRef={cfg.editRef}
        />
      );
      lastEnd = ann.end;
      continue;
    }

    if (ann.type === "change" && ann.change) {
      // Track change rendering
      parts.push(
        <TrackChangeSpan
          key={`ch-${ann.id}`}
          change={ann.change}
          onAccept={cfg.onAcceptChange}
          onReject={cfg.onRejectChange}
        />
      );
    } else if (ann.type === "feedback") {
      const isActive = ann.id === cfg.activeFeedbackId;
      parts.push(
        <span
          key={`fb-${ann.id}`}
          className={cn(
            "cursor-pointer rounded-sm px-0.5 -mx-0.5 transition-all relative group/highlight",
            feedbackHighlightColors[ann.severity!],
            isActive && "ring-2 ring-ring ring-offset-1 ring-offset-background"
          )}
          onClick={() => cfg.onHighlightClick(ann.id)}
          onDoubleClick={() =>
            cfg.onStartEdit(sectionId, annotatedText, ann.start, ann.feedbackItemId)
          }
          title="Click to select feedback · Double-click to edit inline"
        >
          {annotatedText}
          {/* Edit hint on hover */}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/highlight:opacity-100 transition-opacity bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
            double-click to edit
          </span>
        </span>
      );
    } else if (ann.type === "comment" && ann.thread) {
      parts.push(
        <CommentAnchor
          key={`cm-${ann.id}`}
          text={annotatedText}
          thread={ann.thread}
          onClick={() => cfg.onOpenCommentThread(ann.id)}
        />
      );
    }

    lastEnd = ann.end;
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

// ── Inline Editor ───────────────────────────────────────────────

function InlineEditor({
  value,
  onChange,
  onCommit,
  onCancel,
  editRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  editRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <span className="inline-flex flex-col gap-1 align-top my-0.5">
      <textarea
        ref={editRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onCommit();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        className="inline bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-800 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none field-sizing-content min-w-48"
        rows={1}
      />
      <span className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          className="h-5 text-[10px] text-green-700 dark:text-green-400"
          onClick={onCommit}
        >
          <Icon name="check" size={12} weight={500} />
          Save
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-5 text-[10px]"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <span className="text-[10px] text-muted-foreground/50 ml-auto">
          ⌘↵ save · Esc cancel
        </span>
      </span>
    </span>
  );
}

// ── Track Change Span ───────────────────────────────────────────

function TrackChangeSpan({
  change,
  onAccept,
  onReject,
}: {
  change: TextChange;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (change.accepted) {
    // Already accepted — just show the new text
    return (
      <span className="bg-green-50/50 dark:bg-green-950/20 rounded-sm px-0.5 -mx-0.5">
        {change.newText}
      </span>
    );
  }

  return (
    <span className="relative group/change inline">
      {/* Deleted text */}
      <span className="line-through decoration-red-400/70 text-red-600/70 dark:text-red-400/70 bg-red-50/50 dark:bg-red-950/20 rounded-sm px-0.5">
        {change.originalText}
      </span>
      {/* Inserted text */}
      <span className="text-green-700 dark:text-green-400 bg-green-50/60 dark:bg-green-950/30 rounded-sm px-0.5 ml-0.5">
        {change.newText}
      </span>
      {/* Accept/reject controls */}
      <span className="inline-flex items-center gap-0.5 ml-1 opacity-0 group-hover/change:opacity-100 transition-opacity align-middle">
        <button
          className="inline-flex items-center justify-center w-5 h-5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
          onClick={() => onAccept(change.id)}
          title="Accept change"
        >
          <Icon name="check" size={14} weight={500} />
        </button>
        <button
          className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          onClick={() => onReject(change.id)}
          title="Reject change"
        >
          <Icon name="close" size={14} weight={500} />
        </button>
      </span>
    </span>
  );
}

// ── Comment Anchor ──────────────────────────────────────────────

function CommentAnchor({
  text,
  thread,
  onClick,
}: {
  text: string;
  thread: CommentThread;
  onClick: () => void;
}) {
  return (
    <span
      className="bg-purple-100/50 dark:bg-purple-900/25 border-b-2 border-purple-400/50 cursor-pointer rounded-sm px-0.5 -mx-0.5 relative group/comment hover:bg-purple-100/80 dark:hover:bg-purple-900/40 transition-colors"
      onClick={onClick}
    >
      {text}
      <span className="absolute -top-5 -right-1 flex items-center gap-0.5 bg-purple-600 text-white text-[10px] font-medium px-1 py-0 rounded-full opacity-80 group-hover/comment:opacity-100 transition-opacity pointer-events-none">
        <Icon name="comment" size={12} weight={400} className="text-white" />
        {thread.comments.length}
      </span>
    </span>
  );
}
