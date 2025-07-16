import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/classname-util';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 border border-white/20 bg-[#0A0A0A]/80 rounded",
          "text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0",
          "focus:ring-offset-[#0A0A0A]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors cursor-pointer",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };