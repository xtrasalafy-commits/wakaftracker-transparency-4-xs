import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-emerald-100 text-emerald-800",
        secondary: "bg-slate-100 text-slate-700",
        warning: "bg-amber-100 text-amber-800",
        info: "bg-sky-100 text-sky-800",
        destructive: "bg-red-100 text-red-700",
        outline: "border border-slate-300 text-slate-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
