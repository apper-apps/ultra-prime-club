import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default", 
  size = "sm",
  ...props 
}, ref) => {
const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-primary-100 text-primary-800 border-primary-200",
    success: "bg-success-100 text-success-800 border-success-200",
    warning: "bg-accent-100 text-accent-800 border-accent-200",
    error: "bg-error-100 text-error-800 border-error-200",
    info: "bg-info-100 text-info-800 border-info-200"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center border rounded-full font-medium transition-colors duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;