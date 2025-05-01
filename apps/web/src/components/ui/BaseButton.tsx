import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/classname-util";
import { ChevronRightIcon } from "../icons/ChevronRight";

const buttonVariants = cva(
  "px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/90",
        secondary: "border border-border hover:bg-white/[0.15]",
        destructive:
          "bg-transparent text-destructive border border-destructive hover:bg-destructive/10",
        text: "text-secondary-text hover:text-white",
      },
      size: {
        default: "h-12",
        large: "h-[52px]",
        small: "h-10 min-w-[100px] w-fit",
        text: "p-1 fit leading-none",
        icon: "h-10 w-10",
        "icon-large": "h-12 w-12 min-w-12 min-h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  backArrow?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ className, variant, size, backArrow, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(buttonVariants({ variant, size, className }), className)}
      >
        {backArrow && (
          <ChevronRightIcon className="rotate-180" color="#000000" />
        )}
        {props.children}
      </button>
    );
  }
);
BaseButton.displayName = "BaseButton";

export { BaseButton, type BaseButtonProps };
