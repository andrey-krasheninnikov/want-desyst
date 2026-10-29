import type { ComponentProps } from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cn } from '../utils.js';

export type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root> & { label: string };

export function Progress({ label, className, value = null, max = 100, ...props }: ProgressProps) {
  const total = Number.isFinite(max) && max > 0 ? max : 100;
  const amount = value !== null && Number.isFinite(value) ? Math.min(total, Math.max(0, value)) : null;
  return <ProgressPrimitive.Root data-slot="progress" aria-label={label} className={cn('ui-progress', className)} value={amount} max={total} {...props}>
    <ProgressPrimitive.Indicator data-slot="progress-indicator" className="ui-progress-indicator" style={amount === null ? undefined : { transform: `scaleX(${amount / total})` }} />
  </ProgressPrimitive.Root>;
}
