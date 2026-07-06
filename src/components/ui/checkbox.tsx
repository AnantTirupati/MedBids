import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          id={checkboxId}
          className={cn(
            "w-4 h-4 rounded border-outline-variant bg-[#111827] checked:bg-primary-container checked:border-primary-container focus:ring-primary-container focus:ring-offset-[#1A2332] accent-[#0F766E] transition-all cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
export default Checkbox;
