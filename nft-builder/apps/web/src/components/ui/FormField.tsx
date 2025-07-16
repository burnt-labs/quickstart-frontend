import { ReactNode } from 'react';
import { cn } from '../../utils/classname-util';

interface FormFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

export function FormField({
  label,
  description,
  required,
  error,
  children,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className={cn("block text-sm font-medium", labelClassName)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {description && !error && (
        <p className={cn("text-sm text-grey-text", descriptionClassName)}>
          {description}
        </p>
      )}
      
      {error && (
        <p className={cn("text-sm text-red-500", errorClassName)}>
          {error}
        </p>
      )}
    </div>
  );
}