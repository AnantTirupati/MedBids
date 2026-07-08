import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  className?: string;
  data?: number[];
  labels?: string[];
}

export function ChartCard({ title, description, className, data, labels }: ChartCardProps) {
  const points = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    const maxVal = Math.max(...data, 1);
    const xStep = 400 / Math.max(1, data.length - 1);
    return data.map((val, idx) => {
      const x = idx * xStep;
      // Scale: maxVal -> y=30, 0 -> y=130 (leaving margins)
      const y = 130 - (val / maxVal) * 100;
      return { x, y };
    });
  }, [data]);

  const linePath = React.useMemo(() => {
    if (!points) return "M0,130 Q50,70 100,100 T200,50 T300,90 T400,30";
    return points.map((p, idx) => (idx === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  }, [points]);

  const areaPath = React.useMemo(() => {
    if (!points) return "M0,130 Q50,70 100,100 T200,50 T300,90 T400,30 L400,160 L0,160 Z";
    return `${linePath} L 400,160 L 0,160 Z`;
  }, [points, linePath]);

  return (
    <Card className={cn("rounded-card border border-surface-card-border bg-surface-card select-none", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-headline-sm font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-body-sm text-on-surface-variant">{description}</p>
        )}
      </CardHeader>

      <CardContent className="pt-4 min-h-[220px] flex items-center justify-center relative overflow-hidden">
        {/* Abstract WebGL-style vector line illustration in pure CSS/SVG */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.15)_0%,transparent_70%)]" />
        <svg
          className="w-full h-40 overflow-visible relative z-10"
          viewBox="0 0 400 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F766E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F766E" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="400" y2="40" stroke="#273244" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="80" x2="400" y2="80" stroke="#273244" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="400" y2="120" stroke="#273244" strokeWidth="1" strokeDasharray="4 4" />

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#chartGradient)"
          />

          {/* Line path */}
          <path
            d={linePath}
            fill="none"
            stroke="#80d5cb"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Glowing points */}
          {points ? (
            points.map((p, idx) => (
              <circle key={idx} cx={p.x} cy={p.y} r="4" fill="#80d5cb" className="animate-pulse" />
            ))
          ) : (
            <>
              <circle cx="100" cy="100" r="4" fill="#80d5cb" className="animate-pulse" />
              <circle cx="200" cy="50" r="4" fill="#80d5cb" className="animate-pulse" />
              <circle cx="300" cy="90" r="4" fill="#80d5cb" className="animate-pulse" />
            </>
          )}
        </svg>

        {/* Dynamic labels overlay */}
        <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[11px] text-text-muted w-[calc(100%-48px)]">
          {labels ? (
            labels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))
          ) : (
            <>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartCard;
