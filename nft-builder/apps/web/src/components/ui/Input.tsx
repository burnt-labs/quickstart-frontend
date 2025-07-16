import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/classname-util';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          "w-full px-3 py-2 border border-white/20 bg-[#0A0A0A]/80 rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          "placeholder:text-grey-text",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };