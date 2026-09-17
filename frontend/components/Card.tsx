import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2> : null}
      {children}
    </div>
  );
}
