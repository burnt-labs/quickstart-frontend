import { cn } from "../../utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "error";
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-zinc-700 text-zinc-200",
    info: "bg-blue-900/50 text-blue-300 border-blue-700",
    success: "bg-green-900/50 text-green-300 border-green-700",
    warning: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    error: "bg-red-900/50 text-red-300 border-red-700",
  };

  const sizes = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-sm px-2 py-0.5",
    md: "text-base px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-zinc-700 font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}