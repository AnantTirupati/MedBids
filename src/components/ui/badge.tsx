import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-badge border px-2.5 py-0.5 text-label-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 select-none uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-container text-on-primary-container",
        secondary: "border-transparent bg-secondary-container text-on-secondary-container",
        outline: "border-outline text-on-surface-variant",
        success: "border-transparent bg-tertiary-container text-on-tertiary-container",
        destructive: "border-transparent bg-error-container text-on-error-container",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
export default Badge;
