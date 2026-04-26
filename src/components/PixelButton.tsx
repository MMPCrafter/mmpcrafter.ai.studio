import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export default function PixelButton({ children, className, variant = 'primary', ...props }: PixelButtonProps) {
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-lg",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20",
    success: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg",
  };

  return (
    <button
      className={cn(
        "px-6 py-2 font-medium tracking-tight transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
        variants[variant],
        className
      )}
      id={`sleek-btn-${props.id || 'default'}`}
      {...props}
    >
      {children}
    </button>
  );
}
