import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  className?: string;
}

export function ChartCard({ title, description, className }: ChartCardProps) {
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
            d="M0,130 Q50,70 100,100 T200,50 T300,90 T400,30 L400,160 L0,160 Z"
            fill="url(#chartGradient)"
          />

          {/* Line path */}
          <path
            d="M0,130 Q50,70 100,100 T200,50 T300,90 T400,30"
            fill="none"
            stroke="#80d5cb"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Glowing points */}
          <circle cx="100" cy="100" r="4" fill="#80d5cb" className="animate-pulse" />
          <circle cx="200" cy="50" r="4" fill="#80d5cb" className="animate-pulse" />
          <circle cx="300" cy="90" r="4" fill="#80d5cb" className="animate-pulse" />
        </svg>

        {/* Dynamic labels overlay */}
        <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[11px] text-text-muted">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartCard;
