import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function PixelCard({ children, className, title }: PixelCardProps) {
  return (
    <div className={cn(
      "relative glass rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/30",
      className
    )} id="sleek-card">      
      {title && (
        <h3 className="text-emerald-400 font-bold tracking-tight text-sm mb-4 border-b border-slate-700/50 pb-3 uppercase">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
