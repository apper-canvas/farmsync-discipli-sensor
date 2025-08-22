import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl active:scale-95",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-lg hover:from-secondary-500 hover:to-secondary-600 hover:shadow-xl active:scale-95",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg hover:from-accent-600 hover:to-accent-700 hover:shadow-xl active:scale-95",
    outline: "border-2 border-primary-500 text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-600 active:scale-95",
    ghost: "text-primary-600 bg-transparent hover:bg-primary-50 active:scale-95",
    danger: "bg-gradient-to-r from-error to-red-500 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl active:scale-95"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm font-medium",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-semibold"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;