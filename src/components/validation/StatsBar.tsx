"use client";

import { Icon } from "@/components/ui/Icon";
import type { ValidationStats } from "@/types/validation.types";

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  accent?: string;
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="bg-card border rounded-lg px-5 py-4 flex items-center gap-4">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-lg"
        style={{ backgroundColor: accent ? `${accent}15` : "var(--muted)" }}
      >
        <Icon
          name={icon}
          size={24}
          weight={400}
          className={accent ? "" : "text-muted-foreground"}
          fill
        />
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

interface StatsBarProps {
  stats: ValidationStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const resolved = stats.accepted + stats.rejected + stats.edited;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Total Issues" value={stats.total} icon="summarize" />
      <StatCard
        label="Pending Review"
        value={stats.pending}
        icon="pending_actions"
        accent="oklch(0.75 0.18 55)"
      />
      <StatCard
        label="Resolved"
        value={resolved}
        icon="task_alt"
        accent="oklch(0.65 0.17 145)"
      />
      <StatCard
        label="Critical Open"
        value={stats.criticalPending ?? stats.critical}
        icon="error"
        accent="oklch(0.577 0.245 27.325)"
      />
    </div>
  );
}
