"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types/validation.types";
import { computeStats } from "@/types/validation.types";

interface LessonListProps {
  lessons: Lesson[];
  onSelect: (lessonId: string) => void;
}

export function LessonList({ lessons, onSelect }: LessonListProps) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson) => {
        const stats = computeStats(lesson.feedbackItems);
        const total = stats.total;
        const resolved = stats.accepted + stats.rejected + stats.edited;
        const progress = total === 0 ? 100 : Math.round((resolved / total) * 100);
        const isComplete = progress === 100;
        const hasItems = total > 0;

        return (
          <button
            key={lesson.id}
            onClick={() => onSelect(lesson.id)}
            className={cn(
              "w-full text-left border rounded-lg px-5 py-4 transition-all group",
              "hover:shadow-sm hover:border-foreground/15",
              isComplete && "bg-muted/30"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium group-hover:text-foreground transition-colors">
                {lesson.title}
              </h3>
              <div className="flex items-center gap-2">
                {hasItems && stats.critical > 0 && stats.pending > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-red-600 dark:text-red-400 font-medium">
                    <Icon name="error" size={14} fill weight={500} />
                    {stats.critical}
                  </span>
                )}
                {isComplete ? (
                  <Icon
                    name="check_circle"
                    size={20}
                    weight={400}
                    fill
                    className="text-green-600 dark:text-green-400"
                  />
                ) : hasItems ? (
                  <Icon
                    name="arrow_forward"
                    size={18}
                    weight={300}
                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No issues</span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {hasItems && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isComplete
                        ? "bg-green-500 dark:bg-green-400"
                        : "bg-foreground/30"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                  {progress}%
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
