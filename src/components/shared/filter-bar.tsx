import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterBar({ options, activeValue, onChange, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {options.map((option) => {
        const isActive = option.value === activeValue;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-4 py-2 rounded-button text-label-md font-semibold select-none border transition-all duration-150 active:scale-[0.98]",
              isActive
                ? "bg-primary-container border-primary-container text-on-primary-container"
                : "border-outline-variant bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
