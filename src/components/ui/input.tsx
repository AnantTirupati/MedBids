import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 flex items-center justify-center text-on-surface-variant pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "w-full h-12 rounded-button bg-[#111827] border border-outline-variant text-on-surface text-body-md font-sans transition-colors placeholder:text-text-muted focus:border-primary-container focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-10 pr-4" : "px-4",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export default Input;
