import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-lg shadow-sm border border-gray-200',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pb-4', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';