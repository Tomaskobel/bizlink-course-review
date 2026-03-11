"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/Icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  categoryConfig,
  priorityConfig,
  type ReviewCategory,
  type ReviewPriority,
} from "@/types/review.types";
import type { FeedbackItem } from "@/types/validation.types";

interface ResolutionPanelProps {
  item: FeedbackItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    data: {
      correctedText: string;
      reviewerNote: string;
    }
  ) => void;
}

export function ResolutionPanel({ item, open, onClose, onSave }: ResolutionPanelProps) {
  const [correctedText, setCorrectedText] = useState("");
  const [reviewerNote, setReviewerNote] = useState("");

  // Reset form when item changes
  const resetForm = () => {
    setCorrectedText(item?.correctedText ?? item?.referencedText ?? "");
    setReviewerNote("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && item) {
      resetForm();
    }
    if (!isOpen) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!item) return;
    onSave(item.id, {
      correctedText,
      reviewerNote,
    });
  };

  if (!item) return null;

  const cat = item.reviewCategory
    ? categoryConfig[item.reviewCategory as ReviewCategory]
    : null;
  const pri = item.reviewPriority
    ? priorityConfig[item.reviewPriority as ReviewPriority]
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="edit_note" size={24} weight={400} />
            Modify This Change
          </DialogTitle>
          <DialogDescription>
            The reviewer suggested a change, but you want to adjust it. Edit the replacement text below to write your own version.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Classification — read-only context */}
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

          {/* What the reviewer said */}
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Reviewer comment
            </p>
            <p className="text-sm leading-relaxed">{item.feedbackText}</p>
          </div>

          {/* Current text in the course */}
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Current text in the course
            </p>
            <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-md px-3 py-2.5 text-sm text-foreground/80">
              {item.referencedText}
            </div>
          </div>

          {/* Your corrected version */}
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Your corrected version
            </p>
            <p className="text-[11px] text-muted-foreground mb-2">
              Edit the text below to write how it should appear in the course.
            </p>
            <Textarea
              value={correctedText}
              onChange={(e) => setCorrectedText(e.target.value)}
              placeholder="Write the corrected text as it should appear in the course..."
              className="min-h-24 bg-green-50/30 dark:bg-green-950/10 border-green-200/50 dark:border-green-900/50 focus-visible:border-green-400"
            />
          </div>

          {/* Optional note */}
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Note for the course developer
              <span className="text-muted-foreground/60 font-normal ml-1">(optional)</span>
            </p>
            <Textarea
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Explain why you changed it, or add context for the developer..."
              className="min-h-16"
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Icon name="save" size={16} weight={400} />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
