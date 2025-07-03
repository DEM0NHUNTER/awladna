// src/components/ui/Button.tsx

import React from "react";
import { cn } from "@/lib/utils"; // Optional: className utility (see note below)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants: Record<string, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  ghost: "text-gray-700 hover:bg-gray-100",
  link: "text-blue-600 underline hover:text-blue-800",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const style = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <button ref={ref} className={style} {...props} />
    );
  }
);

Button.displayName = "Button";
