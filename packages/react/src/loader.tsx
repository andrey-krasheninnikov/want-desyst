import type { ComponentProps } from 'react';
import { cn } from './utils.js';

export type LoaderProps = Omit<ComponentProps<'span'>, 'children'> & {
  label: string;
  variant?: 'spinner' | 'dots' | 'bars' | 'orbit';
  size?: 'sm' | 'md' | 'lg';
  paused?: boolean;
};
export function Loader({ label, variant = 'spinner', size = 'md', paused = false, className, ...props }: LoaderProps) {
  return <span {...props} data-slot="loader" className={cn('ui-loader', className)} data-variant={variant} data-size={size} data-paused={paused || undefined} role="status" aria-label={label}>
    <span className="ui-loader-art" aria-hidden="true">{variant === 'spinner'
      ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" className="ui-loader-track" /><circle cx="12" cy="12" r="9" strokeDasharray="38 60" /></svg>
      : Array.from({ length: variant === 'bars' ? 5 : 3 }, (_, index) => <span key={index} />)}</span>
  </span>;
}
