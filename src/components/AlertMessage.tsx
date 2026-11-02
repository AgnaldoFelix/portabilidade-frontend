import type { ReactNode } from 'react';

export default function AlertMessage({
  children,
  variant = 'error',
}: {
  children: ReactNode;
  variant?: 'error' | 'warning';
}) {
  return (
    <div
      className={`alert alert-${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span className="alert-icon" aria-hidden="true">
        {variant === 'error' ? '!' : 'i'}
      </span>
      <span>{children}</span>
    </div>
  );
}
