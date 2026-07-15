import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  hint?: string;
  icon: LucideIcon;
  tone?: "gold" | "info" | "danger" | "success" | "warning";
}

const TONE: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  gold: "text-primary bg-primary/10 border-primary/30",
  info: "text-info bg-info/10 border-info/30",
  danger: "text-destructive bg-destructive/10 border-destructive/30",
  success: "text-success bg-success/10 border-success/30",
  warning: "text-warning bg-warning/10 border-warning/30",
};

export function KpiCard({
  label,
  value,
  delta,
  trend = "up",
  hint,
  icon: Icon,
  tone = "gold",
}: KpiCardProps) {
  return (
    <div className="panel px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border",
            TONE[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {delta && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
              trend === "up"
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive"
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {delta}
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
          {label}
        </p>

        <h2 className="mt-3 text-[42px] font-black leading-none tracking-tight text-white">
          {value}
        </h2>

        {hint && (
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}