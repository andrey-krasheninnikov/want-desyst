import type { ComponentProps } from 'react';
import { Skeleton } from './ui/skeleton.js';
import { cn } from './utils.js';

export type ShimmerProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: string;
  variant?: 'block' | 'text' | 'avatar' | 'card';
  paused?: boolean;
};
export function Shimmer({ label, variant = 'block', paused = false, className, ...props }: ShimmerProps) {
  return <div {...props} data-slot="shimmer" className={cn('ui-shimmer', className)} data-variant={variant} data-paused={paused || undefined} role="status" aria-label={label}>
    <div className="ui-shimmer-art" aria-hidden="true">
      {(variant === 'block' || variant === 'avatar' || variant === 'card') && <Skeleton className={cn('ui-shimmer-piece ui-shimmer-block', variant === 'avatar' && 'rounded-full', variant === 'card' && 'rounded-xl')} />}
      {(variant === 'text' || variant === 'card') && <div className="ui-shimmer-lines">{[0, 1, 2].map(index => <Skeleton key={index} className="ui-shimmer-piece ui-shimmer-line" />)}</div>}
    </div>
  </div>;
}
