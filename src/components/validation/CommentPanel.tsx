"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/Icon";
import type { CommentThread, Comment } from "@/types/validation.types";
import { format } from "date-fns";

interface CommentPanelProps {
  thread: CommentThread | null;
  /** When creating a new comment (thread is null), this holds the anchor text */
  newCommentAnchor?: { sectionId: string; anchorText: string; anchorOffset: number };
  onAddComment: (threadId: string, text: string) => void;
  onCreateThread: (sectionId: string, anchorText: string, anchorOffset: number, text: string) => void;
  onResolve: (threadId: string) => void;
  onClose: () => void;
}

export function CommentPanel({
  thread,
  newCommentAnchor,
  onAddComment,
  onCreateThread,
  onResolve,
  onClose,
}: CommentPanelProps) {
  const [newText, setNewText] = useState("");
  const isNewThread = !thread && !!newCommentAnchor;

  const handleSubmit = () => {
    if (!newText.trim()) return;

    if (thread) {
      onAddComment(thread.id, newText.trim());
    } else if (newCommentAnchor) {
      onCreateThread(
        newCommentAnchor.sectionId,
        newCommentAnchor.anchorText,
        newCommentAnchor.anchorOffset,
        newText.trim()
      );
    }
    setNewText("");
  };

  const anchorText = thread?.anchorText ?? newCommentAnchor?.anchorText;

  return (
    <div className="border-t bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Icon name="comment" size={16} weight={300} className="text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {isNewThread ? "New Comment" : "Comment Thread"}
          </span>
          {thread && (
            <span className="text-xs text-muted-foreground">
              · {thread.comments.length} {thread.comments.length === 1 ? "reply" : "replies"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {thread && !thread.resolved && (
            <Button
              variant="ghost"
              size="xs"
              className="h-6 text-[11px] text-green-700 dark:text-green-400"
              onClick={() => onResolve(thread.id)}
            >
              <Icon name="check_circle" size={14} weight={400} />
              Resolve
            </Button>
          )}
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <Icon name="close" size={16} weight={300} />
          </Button>
        </div>
      </div>

      {/* Anchor text */}
      {anchorText && (
        <div className="px-4 py-2 border-b">
          <p className="text-xs text-muted-foreground mb-1">Commenting on:</p>
          <p className="text-xs bg-purple-50/50 dark:bg-purple-950/20 border-l-2 border-purple-400/50 px-2 py-1 rounded-r">
            &ldquo;{anchorText}&rdquo;
          </p>
        </div>
      )}

      {/* Existing comments */}
      {thread && thread.comments.length > 0 && (
        <div className="px-4 py-2 space-y-3 max-h-48 overflow-y-auto">
          {thread.comments.map((comment) => (
            <CommentBubble key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {/* New comment input */}
      <div className="px-4 py-3 flex items-start gap-2">
        <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon name="person" size={14} weight={300} className="text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-2">
          <Textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={isNewThread ? "Add a comment..." : "Reply..."}
            className="min-h-10 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/50">⌘↵ to submit</span>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleSubmit}
              disabled={!newText.trim()}
            >
              <Icon name="send" size={14} weight={400} />
              {isNewThread ? "Comment" : "Reply"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentBubble({ comment }: { comment: Comment }) {
  let timeStr = "";
  try {
    timeStr = format(new Date(comment.timestamp), "MMM d, HH:mm");
  } catch {
    timeStr = comment.timestamp;
  }

  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-400">
          {comment.author.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{comment.author}</span>
          <span className="text-[10px] text-muted-foreground">{timeStr}</span>
        </div>
        <p className="text-sm text-foreground/80 mt-0.5">{comment.text}</p>
      </div>
    </div>
  );
}
