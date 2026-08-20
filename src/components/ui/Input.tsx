import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error = false, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md border bg-input px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        error ? 'border-destructive' : 'border-border'
      } ${className}`}
      {...props}
    />
  );
}
